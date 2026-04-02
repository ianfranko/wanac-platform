import { useState, useEffect } from 'react';
import { meetingService } from '../../../../../../../services/api/meeting.service';
import { bloomTaxonomyColors } from '../../../../../../../types/evaluation';

/**
 * Custom hook to fetch and manage evaluation data.
 * Transforms the Groq-generated session report (stored on the backend) into the
 * EvaluationData shape consumed by ConversationMap, GroupBalanceScore, and
 * IndividualEvaluation components.
 */
export function useEvaluationData(recordingId, fireteamId, hasAI, userRole = 'client') {
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvaluationData() {
      try {
        setLoading(true);
        setError(null);

        if (hasAI && recordingId && recordingId !== 'unknown') {
          console.log('📊 Fetching session evaluation for recording:', recordingId);

          // clientId = localStorage user_id for client-role API endpoint
          const clientId =
            (typeof localStorage !== 'undefined' && localStorage.getItem('user_id')) ||
            undefined;

          const apiData = await meetingService.getRecordingSummaryByRole(
            recordingId,
            userRole,
            clientId
          );

          const transformed = transformApiDataToEvaluationFormat(apiData, userRole);
          setEvaluationData(transformed);
        } else {
          // No AI recording — show a clearly labelled empty state, never mock data
          setEvaluationData(buildEmptyEvaluationData());
        }
      } catch (err) {
        console.error('❌ Error loading evaluation data:', err);
        setError(err.message || 'Failed to load session results. Please try again.');
        setEvaluationData(null); // surface the error; do NOT silently show mock data
      } finally {
        setLoading(false);
      }
    }

    loadEvaluationData();
  }, [recordingId, fireteamId, hasAI, userRole]);

  return { evaluationData, loading, error };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function slugify(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function parseDurationToSeconds(str) {
  if (!str) return 0;
  const s = String(str);
  let total = 0;
  const h = s.match(/(\d+)\s*h/i);
  const m = s.match(/(\d+)\s*m(?:in)?/i);
  if (h) total += parseInt(h[1]) * 3600;
  if (m) total += parseInt(m[1]) * 60;
  return total;
}

const PARTICIPANT_COLORS = [
  '#FCD34D', '#3B82F6', '#10B981', '#F59E0B',
  '#6366F1', '#EC4899', '#14B8A6', '#8B5CF6',
];

/** Engagement level → estimated talk time + Bloom's taxonomy level */
const ENGAGEMENT_MAP = {
  high:   { minutes: 22, bloom: 'Analyzing',    score: 4 },
  medium: { minutes: 12, bloom: 'Understanding', score: 2 },
  low:    { minutes:  5, bloom: 'Remembering',   score: 1 },
};

// ─── Main transformer ─────────────────────────────────────────────────────────

/**
 * Convert the Groq session report into the EvaluationData shape the UI expects.
 * The backend returns whatever was stored in recording metadata.summaries.
 */
function transformApiDataToEvaluationFormat(apiData, userRole) {
  // Unwrap possible .data envelope
  const raw      = apiData?.data || apiData || {};
  const summaries = raw?.summaries || raw;

  const participant = summaries?.participantSummary || {};
  const coach       = summaries?.coachSummary       || {};
  const admin       = summaries?.adminSummary        || {};

  const sessionMetrics      = admin?.sessionMetrics     || {};
  const agendaCoverage      = coach?.agendaCoverage      || [];
  const participantInsights = coach?.participantInsights || [];

  // Session duration
  const durationSec = parseDurationToSeconds(raw?.duration || '') || 2700;

  // ── Participant list ──────────────────────────────────────────────────────
  const participants = participantInsights.map((p, i) => {
    const em = ENGAGEMENT_MAP[p.engagementLevel] || ENGAGEMENT_MAP.medium;
    return {
      id:              p.userId || slugify(p.userName) || `p_${i}`,
      name:            p.userName || `Participant ${i + 1}`,
      color:           PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length],
      talkTimeMinutes: em.minutes,
      engagementLevel: p.engagementLevel || 'medium',
    };
  });

  // Fallback: build single entry from participantSummary if no coach insights
  if (participants.length === 0 && participant?.userName) {
    const em = ENGAGEMENT_MAP[participant.engagementLevel] || ENGAGEMENT_MAP.medium;
    participants.push({
      id:              participant.userId || slugify(participant.userName) || 'user',
      name:            participant.userName,
      color:           PARTICIPANT_COLORS[0],
      talkTimeMinutes: em.minutes,
      engagementLevel: participant.engagementLevel || 'medium',
    });
  }

  const avgTalkTime = participants.length
    ? participants.reduce((s, p) => s + p.talkTimeMinutes, 0) / participants.length
    : 0;

  // ── Conversation bubbles (derived from agenda key points) ─────────────────
  const bubbles = [];
  let bubbleId = 1;

  agendaCoverage.forEach((agenda, agendaIdx) => {
    const agendaStart = Math.round((agendaIdx / Math.max(agendaCoverage.length, 1)) * durationSec);
    const agendaSpan  = Math.round(durationSec / Math.max(agendaCoverage.length, 1));

    (agenda.keyPoints || []).forEach((point, ptIdx) => {
      const speaker = participants[ptIdx % Math.max(participants.length, 1)];
      bubbles.push({
        id:                String(bubbleId++),
        participantId:     speaker?.id || 'unknown',
        timestamp:         agendaStart + Math.round((ptIdx / Math.max(agenda.keyPoints.length, 1)) * agendaSpan),
        comment:           point,
        understandingDepth: 3,
        rubric:            agenda.agendaItem,
      });
    });
  });

  // ── Individual evaluations ────────────────────────────────────────────────
  const individualEvaluations = [];

  // Current user — from participantSummary
  if (participant?.userName) {
    const insight = participantInsights.find(
      (p) => p.userName?.toLowerCase() === participant.userName?.toLowerCase()
    );
    const em    = ENGAGEMENT_MAP[insight?.engagementLevel || participant.engagementLevel] || ENGAGEMENT_MAP.medium;
    const bloom = {
      level: em.bloom,
      score: em.score,
      color: bloomTaxonomyColors[em.bloom] || '#FCD34D',
    };

    const agendaEvals = (participant.agendaContributions || []).map((ac, i) => ({
      rubricId:          `agenda-${i}`,
      rubricTitle:       ac.agendaItem,
      rubricDescription: `Discussion of "${ac.agendaItem}" during the Fireteam session.`,
      bloomLevel:        bloom,
      contributions:     [ac.contribution].filter(Boolean),
      summary:           participant.overallSummary || '',
      explanation:       insight?.notes || '',
    }));

    // Fallback to keyContributions when no per-agenda data
    if (agendaEvals.length === 0 && (participant.keyContributions || []).length > 0) {
      agendaEvals.push({
        rubricId:          'overall',
        rubricTitle:       'Session Contributions',
        rubricDescription: 'Overall contributions during the Fireteam session.',
        bloomLevel:        bloom,
        contributions:     participant.keyContributions || [],
        summary:           participant.overallSummary || '',
        explanation:       insight?.notes || '',
      });
    }

    if (agendaEvals.length > 0) {
      individualEvaluations.push({
        participantId:   participant.userId || slugify(participant.userName) || 'user',
        participantName: participant.userName,
        evaluations:     agendaEvals,
      });
    }
  }

  // Other participants — from coach insights (coach / admin view only)
  if (userRole !== 'client') {
    participantInsights.forEach((insight) => {
      if (insight.userName === participant?.userName) return; // already added above
      const em    = ENGAGEMENT_MAP[insight.engagementLevel] || ENGAGEMENT_MAP.medium;
      const bloom = {
        level: em.bloom,
        score: em.score,
        color: bloomTaxonomyColors[em.bloom] || '#FCD34D',
      };
      individualEvaluations.push({
        participantId:   insight.userId || slugify(insight.userName) || 'unknown',
        participantName: insight.userName,
        evaluations: [{
          rubricId:          'overall',
          rubricTitle:       'Session Contributions',
          rubricDescription: 'Overall contributions during the Fireteam session.',
          bloomLevel:        bloom,
          contributions:     [insight.notes].filter(Boolean),
          summary:           `${insight.userName} demonstrated ${insight.engagementLevel} engagement.`,
          explanation:       insight.notes || '',
        }],
      });
    });
  }

  return {
    conversationMap: {
      bubbles,
      timeline: {
        startTime: '0:00',
        endTime:   formatDuration(durationSec),
        duration:  durationSec,
      },
    },
    groupBalanceScore: {
      participants,
      averageTalkTime: avgTalkTime,
      isBalanced: coach?.sessionObjectivesMet || false,
      message:    coach?.overallEngagement || admin?.agendaAdherence || 'Session analysis complete.',
    },
    individualEvaluations,
    sessionInfo: {
      experienceTitle:   raw?.experience_title || 'Fireteam Session',
      duration:          formatDuration(durationSec),
      totalParticipants: sessionMetrics?.totalParticipants || participants.length,
      startTime:         raw?.start_time || new Date().toISOString(),
      endTime:           raw?.end_time   || new Date().toISOString(),
    },
  };
}

/** Shown when no AI recording ID is available for this session */
function buildEmptyEvaluationData() {
  return {
    conversationMap:       { bubbles: [], timeline: { startTime: '0:00', endTime: '0:00', duration: 0 } },
    groupBalanceScore:     { participants: [], averageTalkTime: 0, isBalanced: false, message: 'No session recording available for this session.' },
    individualEvaluations: [],
    sessionInfo: {
      experienceTitle:   'Session Results Unavailable',
      duration:          '—',
      totalParticipants: 0,
      startTime:         new Date().toISOString(),
      endTime:           new Date().toISOString(),
    },
  };
}
