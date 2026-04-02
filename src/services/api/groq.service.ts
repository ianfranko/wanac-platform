/**
 * Groq AI Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles two things for post-session Fireteam reports:
 *   1. Audio transcription  — Groq's Whisper large-v3 (free tier: ~2 000 min/day)
 *   2. LLM report generation — Groq's llama-3.3-70b-versatile (free tier: 14 400 req/day)
 *
 * Setup: add  NEXT_PUBLIC_GROQ_API_KEY=<your key>  to .env.local
 * Get a free key at https://console.groq.com
 */

const GROQ_BASE = 'https://api.groq.com/openai/v1';
const WHISPER_MODEL = 'whisper-large-v3';
const LLM_MODEL = 'llama-3.3-70b-versatile';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParticipantAudio {
  /** Display name shown in the session (e.g. "Ian Odundo") */
  name: string;
  /** LiveKit identity string */
  identity: string;
  /** Raw audio blob recorded from the participant's individual track */
  blob: Blob;
  /** Seconds after recordingStart when this participant's recording began.
   *  Normally 0 for everyone unless someone joined mid-recording. */
  offsetSeconds?: number;
}

export interface TimedSegment {
  speakerName: string;
  /** Seconds from start of merged timeline */
  start: number;
  end: number;
  text: string;
}

export interface AgendaItem {
  title: string;
  duration: string; // e.g. "10 mins", "5 min", "—"
}

interface AgendaWindow {
  title: string;
  startSec: number;
  endSec: number;
}

export interface MeetingData {
  experienceTitle: string;
  experienceDescription: string;
  agenda: AgendaItem[];
  participants: Array<{ id: string; name: string }>;
  duration: string;
  userId: string;
  userName: string;
  startTime: string;
  attendanceLog?: any[];
}

export interface MeetingSummary {
  participantSummary: {
    userId: string;
    userName: string;
    engagementLevel: 'high' | 'medium' | 'low';
    keyContributions: string[];
    actionItems: string[];
    overallSummary: string;
    speakingTime?: string;
    questionsAsked?: number;
    agendaContributions?: Array<{ agendaItem: string; contribution: string }>;
  };
  coachSummary: {
    overallEngagement: string;
    participantInsights: Array<{
      userId: string;
      userName: string;
      engagementLevel: 'high' | 'medium' | 'low';
      notes: string;
    }>;
    sessionObjectivesMet: boolean;
    agendaCoverage: Array<{
      agendaItem: string;
      covered: boolean;
      timeSpent: string;
      plannedTime: string;
      keyPoints: string[];
    }>;
    areasOfConcern: string[];
    recommendations: string[];
    keyTakeaways: string[];
  };
  adminSummary: {
    sessionMetrics: {
      totalParticipants: number;
      averageEngagement: string;
      completionRate: string;
      technicalIssues: string[];
    };
    agendaAdherence: string;
    facilitatorPerformance: string;
    contentEffectiveness: string;
    systemRecommendations: string[];
    nextSteps: string[];
  };
  /** The full merged transcript with speaker labels — useful for coaches / admins */
  fullTranscript: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GROQ_API_KEY) || '';
  if (!key) {
    throw new Error(
      'Missing Groq API key. Add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file. ' +
        'Get a free key at https://console.groq.com'
    );
  }
  return key;
}

/** Parse durations like "10 mins", "5 min", "1h 30m" → seconds */
function parseDurationToSeconds(duration: string): number {
  if (!duration || duration === '—' || duration === '-') return 0;
  let total = 0;
  const hours = duration.match(/(\d+)\s*h/i);
  const mins = duration.match(/(\d+)\s*m(?:in)?/i);
  if (hours) total += parseInt(hours[1]) * 3600;
  if (mins) total += parseInt(mins[1]) * 60;
  return total;
}

/** Build time windows for each agenda item (used for transcript chunking) */
function buildAgendaWindows(agenda: AgendaItem[]): AgendaWindow[] {
  let cursor = 0;
  return agenda
    .filter((a) => (a as any).isWaitingRoom !== true)
    .map((item) => {
      const dur = parseDurationToSeconds(item.duration);
      const window: AgendaWindow = {
        title: item.title,
        startSec: cursor,
        endSec: cursor + dur,
      };
      cursor += dur;
      return window;
    });
}

/** Format seconds as "mm:ss" */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Extract JSON safely from LLM output (may be wrapped in markdown fences) */
function parseJson(raw: string): any {
  const cleaned = (raw || '').trim();
  const match =
    cleaned.match(/```(?:json)?\s*([\s\S]*?)```/) ||
    cleaned.match(/(\{[\s\S]*\})/);
  const toParse = match ? (match[1] || match[0]).trim() : cleaned;
  return JSON.parse(toParse);
}

/** Build a readable transcript string from timed segments */
function buildTranscriptText(segments: TimedSegment[]): string {
  return segments
    .map((s) => `[${formatTime(s.start)}] ${s.speakerName}: ${s.text.trim()}`)
    .join('\n');
}

/** Assign transcript segments to agenda windows */
function assignSegmentsToAgenda(
  segments: TimedSegment[],
  windows: AgendaWindow[]
): Record<string, TimedSegment[]> {
  const result: Record<string, TimedSegment[]> = {};
  for (const w of windows) {
    result[w.title] = [];
  }
  const overflow: TimedSegment[] = [];

  for (const seg of segments) {
    const midpoint = (seg.start + seg.end) / 2;
    const window = windows.find((w) => midpoint >= w.startSec && midpoint < w.endSec);
    if (window) {
      result[window.title].push(seg);
    } else {
      overflow.push(seg);
    }
  }

  // Append overflow to the last agenda item
  if (overflow.length && windows.length > 0) {
    const last = windows[windows.length - 1].title;
    result[last] = [...(result[last] || []), ...overflow];
  }

  return result;
}

// ─── Core API calls ───────────────────────────────────────────────────────────

/**
 * Transcribe one participant's audio blob using Groq Whisper.
 * Returns an array of timed text segments shifted by `offsetSeconds`.
 */
async function transcribeParticipantAudio(
  audio: ParticipantAudio
): Promise<TimedSegment[]> {
  const apiKey = getApiKey();
  const offset = audio.offsetSeconds ?? 0;

  // Groq Whisper accepts audio files; we send as multipart/form-data
  const formData = new FormData();

  // Give the file an appropriate extension so Groq detects the codec
  const ext = audio.blob.type.includes('mp4') ? 'mp4'
    : audio.blob.type.includes('ogg') ? 'ogg'
    : 'webm';
  formData.append('file', audio.blob, `${audio.identity}.${ext}`);
  formData.append('model', WHISPER_MODEL);
  formData.append('response_format', 'verbose_json'); // gives us segment timestamps
  formData.append('language', 'en');

  const res = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Groq Whisper transcription failed for ${audio.name}: ` +
        (err?.error?.message || res.statusText)
    );
  }

  const data = await res.json();

  // verbose_json returns { text, segments: [{ start, end, text }] }
  if (data.segments && Array.isArray(data.segments)) {
    return data.segments.map((seg: any) => ({
      speakerName: audio.name,
      start: (seg.start ?? 0) + offset,
      end: (seg.end ?? seg.start ?? 0) + offset,
      text: seg.text || '',
    }));
  }

  // Fallback: no segments — treat whole transcript as one segment
  return [
    {
      speakerName: audio.name,
      start: offset,
      end: offset + 1,
      text: data.text || '',
    },
  ];
}

/** Call the Groq chat completions endpoint */
async function llmComplete(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = getApiKey();

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      'Groq LLM error: ' + (err?.error?.message || res.statusText)
    );
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// ─── Summary generators ───────────────────────────────────────────────────────

async function generateParticipantSummary(
  mergedTranscript: string,
  agendaChunks: Record<string, TimedSegment[]>,
  meetingData: MeetingData
) {
  const agendaBreakdown = Object.entries(agendaChunks)
    .map(([title, segs]) => {
      const userLines = segs
        .filter((s) => s.speakerName === meetingData.userName)
        .map((s) => s.text)
        .join(' ');
      return `• ${title}: ${userLines || '(no contributions recorded)'}`;
    })
    .join('\n');

  const system = `You are an AI assistant generating a personalized post-session report for a WANAC veteran coaching program participant.
Be concise, supportive, and specific. Respond ONLY with valid JSON — no markdown, no preamble.`;

  const user = `Session: "${meetingData.experienceTitle}"
Participant: ${meetingData.userName}
Duration: ${meetingData.duration}

Agenda items & this participant's contributions:
${agendaBreakdown}

Full session transcript (all speakers):
${mergedTranscript.slice(0, 28000)}

Generate a JSON report with this EXACT structure:
{
  "engagementLevel": "high" | "medium" | "low",
  "overallSummary": "2-3 sentence summary of their participation",
  "keyContributions": ["specific thing they said or did", ...],
  "agendaContributions": [
    { "agendaItem": "agenda title", "contribution": "what they specifically contributed" },
    ...
  ],
  "actionItems": ["concrete next step they committed to", ...],
  "speakingTime": "estimated speaking time e.g. '8 mins'",
  "questionsAsked": 2
}`;

  const raw = await llmComplete(system, user);
  const result = parseJson(raw);

  return {
    userId: meetingData.userId,
    userName: meetingData.userName,
    engagementLevel: result.engagementLevel || 'medium',
    overallSummary: result.overallSummary || '',
    keyContributions: Array.isArray(result.keyContributions) ? result.keyContributions : [],
    agendaContributions: Array.isArray(result.agendaContributions) ? result.agendaContributions : [],
    actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
    speakingTime: result.speakingTime,
    questionsAsked: result.questionsAsked ?? 0,
  };
}

async function generateCoachSummary(
  mergedTranscript: string,
  agendaChunks: Record<string, TimedSegment[]>,
  agendaWindows: AgendaWindow[],
  meetingData: MeetingData
) {
  const agendaCoverageInput = agendaWindows.map((w) => {
    const segs = agendaChunks[w.title] || [];
    const actualSec = segs.length > 0
      ? (segs[segs.length - 1].end - segs[0].start)
      : 0;
    const speakerBreakdown = Object.entries(
      segs.reduce((acc: Record<string, number>, s) => {
        acc[s.speakerName] = (acc[s.speakerName] || 0) + (s.end - s.start);
        return acc;
      }, {})
    )
      .map(([name, secs]) => `${name}: ~${Math.round(secs)}s`)
      .join(', ');
    const text = segs.map((s) => `${s.speakerName}: ${s.text}`).join(' ');
    return `Agenda: "${w.title}" | Planned: ${w.endSec - w.startSec}s | Actual: ~${Math.round(actualSec)}s | Speakers: ${speakerBreakdown || 'none'}\nContent: ${text.slice(0, 800) || '(no content recorded)'}`;
  }).join('\n\n');

  const participantList = meetingData.participants.map((p) => p.name).join(', ');

  const system = `You are an AI assistant generating a detailed coach report for a WANAC veteran peer coaching session.
Be analytical and specific. Respond ONLY with valid JSON — no markdown, no preamble.`;

  const user = `Session: "${meetingData.experienceTitle}"
Participants: ${participantList}
Duration: ${meetingData.duration}

Per-agenda-item breakdown (with speaker attribution):
${agendaCoverageInput}

Full transcript:
${mergedTranscript.slice(0, 28000)}

Generate a JSON report with this EXACT structure:
{
  "overallEngagement": "2-3 sentence overall assessment",
  "participantInsights": [
    {
      "userName": "name",
      "engagementLevel": "high" | "medium" | "low",
      "notes": "specific observations about their participation style and contributions"
    }
  ],
  "agendaCoverage": [
    {
      "agendaItem": "title",
      "covered": true | false,
      "timeSpent": "e.g. '12 mins'",
      "plannedTime": "e.g. '10 mins'",
      "keyPoints": ["main point discussed", ...]
    }
  ],
  "sessionObjectivesMet": true | false,
  "areasOfConcern": ["any participant who seemed disengaged or struggling"],
  "recommendations": ["coaching recommendation for next session", ...],
  "keyTakeaways": ["overall takeaway", ...]
}`;

  const raw = await llmComplete(system, user);
  const result = parseJson(raw);

  const participantInsights = (result.participantInsights || []).map((insight: any) => {
    const p = meetingData.participants.find(
      (x) => x.name.toLowerCase() === (insight.userName || '').toLowerCase()
    );
    return {
      userId: p?.id || '',
      userName: insight.userName || '',
      engagementLevel: insight.engagementLevel || 'medium',
      notes: insight.notes || '',
    };
  });

  return {
    overallEngagement: result.overallEngagement || '',
    participantInsights,
    agendaCoverage: Array.isArray(result.agendaCoverage) ? result.agendaCoverage : [],
    sessionObjectivesMet: Boolean(result.sessionObjectivesMet),
    areasOfConcern: Array.isArray(result.areasOfConcern) ? result.areasOfConcern : [],
    recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    keyTakeaways: Array.isArray(result.keyTakeaways) ? result.keyTakeaways : [],
  };
}

async function generateAdminSummary(
  mergedTranscript: string,
  agendaChunks: Record<string, TimedSegment[]>,
  agendaWindows: AgendaWindow[],
  meetingData: MeetingData
) {
  const agendaStats = agendaWindows.map((w) => {
    const segs = agendaChunks[w.title] || [];
    const covered = segs.length > 0;
    const plannedSec = w.endSec - w.startSec;
    const actualSec = segs.length > 0
      ? Math.round(segs[segs.length - 1].end - segs[0].start)
      : 0;
    return `"${w.title}": planned ${plannedSec}s, actual ${actualSec}s, covered: ${covered}`;
  }).join('\n');

  const totalCovered = agendaWindows.filter((w) => (agendaChunks[w.title] || []).length > 0).length;
  const coveragePct = agendaWindows.length
    ? Math.round((totalCovered / agendaWindows.length) * 100)
    : 0;

  const system = `You are an AI assistant generating an admin-level report for a WANAC veteran coaching platform.
Be data-driven and operational. Respond ONLY with valid JSON — no markdown, no preamble.`;

  const user = `Session: "${meetingData.experienceTitle}"
Total participants: ${meetingData.participants.length}
Duration: ${meetingData.duration}
Agenda items covered: ${totalCovered}/${agendaWindows.length} (${coveragePct}%)

Agenda time analysis:
${agendaStats}

Generate a JSON report with this EXACT structure:
{
  "sessionMetrics": {
    "totalParticipants": ${meetingData.participants.length},
    "averageEngagement": "high | medium | low",
    "completionRate": "${coveragePct}%",
    "technicalIssues": ["any issues observed in transcript, or empty array"]
  },
  "agendaAdherence": "brief assessment of how well the session followed the agenda and time allocations",
  "facilitatorPerformance": "assessment of coaching effectiveness based on transcript",
  "contentEffectiveness": "how well the content drove meaningful discussion",
  "systemRecommendations": ["platform or process improvement", ...],
  "nextSteps": ["follow-up action for the platform or program team", ...]
}

Transcript excerpt for context:
${mergedTranscript.slice(0, 15000)}`;

  const raw = await llmComplete(system, user);
  const result = parseJson(raw);
  const sm = result.sessionMetrics || {};

  return {
    sessionMetrics: {
      totalParticipants: meetingData.participants.length,
      averageEngagement: sm.averageEngagement || 'medium',
      completionRate: sm.completionRate || `${coveragePct}%`,
      technicalIssues: Array.isArray(sm.technicalIssues) ? sm.technicalIssues : [],
    },
    agendaAdherence: result.agendaAdherence || '',
    facilitatorPerformance: result.facilitatorPerformance || '',
    contentEffectiveness: result.contentEffectiveness || '',
    systemRecommendations: Array.isArray(result.systemRecommendations)
      ? result.systemRecommendations
      : [],
    nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const groqService = {
  /**
   * Main entry point: takes per-participant audio blobs, transcribes each with
   * Groq Whisper, merges into a speaker-labeled timeline, aligns against the
   * session agenda, then generates three role-specific reports.
   */
  async generateSessionReport(
    participantAudios: ParticipantAudio[],
    meetingData: MeetingData
  ): Promise<MeetingSummary> {
    if (!participantAudios || participantAudios.length === 0) {
      throw new Error('No participant audio recordings provided');
    }

    console.log(
      `🎙️ Transcribing ${participantAudios.length} participant track(s) with Groq Whisper...`
    );

    // Step 1: Transcribe all participants in parallel
    const segmentArrays = await Promise.all(
      participantAudios.map((audio) => transcribeParticipantAudio(audio))
    );

    // Step 2: Merge and sort all segments chronologically
    const allSegments: TimedSegment[] = segmentArrays
      .flat()
      .sort((a, b) => a.start - b.start);

    console.log(`✅ Transcription complete. ${allSegments.length} segments across ${participantAudios.length} speakers`);

    // Step 3: Build human-readable transcript
    const mergedTranscript = buildTranscriptText(allSegments);

    // Step 4: Build agenda time windows and assign segments
    const agendaWindows = buildAgendaWindows(
      meetingData.agenda.filter((a: any) => !a.isWaitingRoom && !a.isProcessing && !a.isSummary)
    );
    const agendaChunks = assignSegmentsToAgenda(allSegments, agendaWindows);

    console.log('🤖 Generating 3-role session reports with Groq LLM...');

    // Step 5: Generate all three summaries in parallel
    const [participantSummary, coachSummary, adminSummary] = await Promise.all([
      generateParticipantSummary(mergedTranscript, agendaChunks, meetingData),
      generateCoachSummary(mergedTranscript, agendaChunks, agendaWindows, meetingData),
      generateAdminSummary(mergedTranscript, agendaChunks, agendaWindows, meetingData),
    ]);

    console.log('✅ All session reports generated');

    return {
      participantSummary,
      coachSummary,
      adminSummary,
      fullTranscript: mergedTranscript,
    };
  },

  /**
   * Transcribe a single audio blob (convenience method for testing).
   */
  async transcribeAudio(audio: ParticipantAudio): Promise<TimedSegment[]> {
    return transcribeParticipantAudio(audio);
  },
};
