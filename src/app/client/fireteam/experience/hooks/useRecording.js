import { useState, useRef, useCallback } from 'react';
import { Track } from 'livekit-client';
import { groqService } from '../../../../../services/api/groq.service';
import { meetingService } from '../../../../../services/api/meeting.service';

/**
 * useRecording — per-participant audio recording + Groq-powered session reports
 * ─────────────────────────────────────────────────────────────────────────────
 * Records each LiveKit participant's audio on a separate MediaRecorder track
 * so that Groq Whisper can transcribe each person independently and attribute
 * every spoken line to the correct speaker name.
 *
 * After stopping, call processRecording(meetingData, searchParams) to:
 *   1. Transcribe each participant's audio with Groq Whisper (whisper-large-v3)
 *   2. Merge transcripts into a speaker-labeled, timestamped timeline
 *   3. Align speech to agenda items by time window
 *   4. Generate participant / coach / admin reports via Groq LLM (llama-3.3-70b)
 *
 * @param {React.MutableRefObject} meetingRef  — ref to the LiveKit Room object
 * @param {boolean}                meetingReady — true once the room is connected
 */
export function useRecording(meetingRef, meetingReady) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState(null);
  const [participantAudios, setParticipantAudios] = useState([]); // [{name, identity, blob, offsetSeconds}]
  const [processingRecording, setProcessingRecording] = useState(false);
  const [meetingSummaries, setMeetingSummaries] = useState(null);

  // Map of identity → { recorder: MediaRecorder, chunks: Blob[], name: string, startedAt: number }
  const trackRecordersRef = useRef({});
  // ms timestamp when recording began — used to compute per-participant offsets
  const recordingStartRef = useRef(null);
  // Keep a ref to the local mic stream so we can stop its tracks on cleanup
  const localMicStreamRef = useRef(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Create and start a MediaRecorder for a single MediaStreamTrack.
   */
  function startTrackRecorder(mediaStreamTrack, identity, name) {
    try {
      const stream = new MediaStream([mediaStreamTrack]);
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.start(1000); // collect a chunk every 1 s
      console.log(`🔴 Recording started: ${name} (${identity})`);

      trackRecordersRef.current[identity] = {
        recorder,
        chunks,
        name,
        startedAt: Date.now(),
      };
    } catch (err) {
      console.warn(`⚠️ Could not start recorder for ${name}:`, err.message);
    }
  }

  /**
   * Stop one participant's recorder and return their audio blob + time offset.
   */
  function stopTrackRecorder(identity) {
    return new Promise((resolve) => {
      const entry = trackRecordersRef.current[identity];
      if (!entry) return resolve(null);

      const { recorder, chunks, name, startedAt } = entry;
      const offsetSeconds = Math.max(
        0,
        (startedAt - (recordingStartRef.current || startedAt)) / 1000
      );

      if (recorder.state === 'inactive') {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        resolve({ identity, name, blob, offsetSeconds });
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        console.log(`✅ Audio saved — ${name}: ${(blob.size / 1024).toFixed(0)} KB`);
        resolve({ identity, name, blob, offsetSeconds });
      };

      recorder.stop();
    });
  }

  // ─── Toggle recording ────────────────────────────────────────────────────────

  const toggleRecording = useCallback(async () => {
    if (!meetingRef?.current || !meetingReady) {
      console.warn('⚠️ Meeting not ready for recording');
      throw new Error('The meeting is not ready. Please wait a moment and try again.');
    }

    const room = meetingRef.current;

    // ── STOP ──────────────────────────────────────────────────────────────────
    if (isRecording) {
      console.log('🛑 Stopping all participant recordings...');

      const identities = Object.keys(trackRecordersRef.current);
      const results = await Promise.all(identities.map(stopTrackRecorder));

      const validAudios = results.filter(
        (r) => r !== null && r.blob && r.blob.size > 0
      );

      // Release local mic stream
      if (localMicStreamRef.current) {
        localMicStreamRef.current.getTracks().forEach((t) => t.stop());
        localMicStreamRef.current = null;
      }

      setParticipantAudios(validAudios);
      trackRecordersRef.current = {};
      setIsRecording(false);

      console.log(`✅ Recording stopped. ${validAudios.length} participant track(s) saved.`);
      return;
    }

    // ── START ─────────────────────────────────────────────────────────────────
    console.log('🔴 Starting per-participant recording...');
    trackRecordersRef.current = {};
    recordingStartRef.current = Date.now();
    setParticipantAudios([]);

    let trackCount = 0;

    // 1. Local participant — our own microphone
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localMicStreamRef.current = localStream;

      const localTrack = localStream.getAudioTracks()[0];
      if (localTrack) {
        const localIdentity = room.localParticipant?.identity || 'local';
        const localName =
          room.localParticipant?.name ||
          room.localParticipant?.identity ||
          (typeof localStorage !== 'undefined' && localStorage.getItem('user_name')) ||
          'You';
        startTrackRecorder(localTrack, localIdentity, localName);
        trackCount++;
      }
    } catch (err) {
      // Surface the specific reason to the caller so the UI can show it
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error(
          'Microphone access was denied. Please allow microphone permissions in your browser settings and try again.'
        );
      }
      if (err.name === 'NotFoundError') {
        throw new Error(
          'No microphone was found. Please connect a microphone and try again.'
        );
      }
      throw new Error('Could not access microphone: ' + err.message);
    }

    // 2. Remote participants — tap each person's subscribed audio track
    let skippedParticipants = 0;

    if (room.remoteParticipants) {
      for (const [, participant] of room.remoteParticipants) {
        const pub = participant.getTrackPublication(Track.Source.Microphone);
        const audioTrack = pub?.track;
        const mediaStreamTrack = audioTrack?.mediaStreamTrack;

        if (mediaStreamTrack && mediaStreamTrack.readyState !== 'ended') {
          startTrackRecorder(
            mediaStreamTrack,
            participant.identity,
            participant.name || participant.identity || 'Participant'
          );
          trackCount++;
        } else {
          skippedParticipants++;
          console.warn(
            `⚠️ Skipping audio track for "${participant.name || participant.identity}":`,
            !pub ? 'no microphone publication found'
              : !audioTrack ? 'track not yet subscribed'
              : `track state is "${mediaStreamTrack?.readyState}"`
          );
        }
      }
    } else {
      console.warn('⚠️ room.remoteParticipants is not available — only local mic will be recorded');
    }

    if (skippedParticipants > 0) {
      console.warn(
        `⚠️ ${skippedParticipants} participant(s) could not be recorded (muted or not yet subscribed). ` +
        'Their speech will not appear in the transcript.'
      );
    }

    if (trackCount === 0) {
      throw new Error(
        'No audio tracks could be captured. Please check microphone permissions and try again.'
      );
    }

    setIsRecording(true);
    const tempId = `rec_${Date.now()}`;
    setCurrentRecordingId(tempId);
    console.log(`✅ Recording started for ${trackCount} participant(s). ID: ${tempId}`);
  }, [meetingRef, meetingReady, isRecording]);

  // ─── Process recording ───────────────────────────────────────────────────────

  const processRecording = useCallback(
    async (meetingData, searchParams) => {
      if (!participantAudios || participantAudios.length === 0) {
        throw new Error('No participant audio recordings available to process.');
      }

      setProcessingRecording(true);

      try {
        const userId =
          (typeof localStorage !== 'undefined' && localStorage.getItem('user_id')) ||
          'unknown';
        const expId = searchParams?.get('id');
        const ftId = searchParams?.get('fireteamId');

        console.log(`🎙️ Processing ${participantAudios.length} participant track(s) with Groq...`);

        // Step 1: Transcribe all tracks + generate 3-role reports via Groq
        const summaries = await groqService.generateSessionReport(
          participantAudios,
          meetingData
        );

        console.log('✅ Session reports generated');
        console.log('📤 Uploading metadata to backend...');

        // Step 2: Upload to backend — send the local participant's audio as primary file
        const primaryAudio =
          participantAudios.find((a) => a.identity === (meetingData.userId || 'local')) ||
          participantAudios[0];

        const metadata = {
          transcript: summaries.fullTranscript,
          summaries: {
            participantSummary: summaries.participantSummary,
            coachSummary: summaries.coachSummary,
            adminSummary: summaries.adminSummary,
          },
          participants: meetingData.attendanceLog || [],
          start_time: meetingData.startTime || new Date().toISOString(),
          end_time: new Date().toISOString(),
          duration: meetingData.duration || '0 mins',
          user_id: userId,
          user_name: meetingData.userName,
          attendance_log: meetingData.attendanceLog || [],
          speaker_count: participantAudios.length,
        };

        await meetingService.uploadRecording(ftId, expId, primaryAudio.blob, metadata);

        console.log('✅ Recording metadata uploaded successfully');

        // Step 3: Surface summaries in the existing MeetingSummaryModal format
        const modalSummaries = {
          participantSummary: summaries.participantSummary,
          coachSummary: summaries.coachSummary,
          adminSummary: summaries.adminSummary,
        };

        setMeetingSummaries(modalSummaries);

        return {
          summaries: modalSummaries,
          recordingId: currentRecordingId,
          fullTranscript: summaries.fullTranscript,
        };
      } catch (error) {
        console.error('❌ Failed to process recording:', error);
        throw new Error(
          'Failed to process recording: ' +
            (error?.response?.data?.message || error.message)
        );
      } finally {
        setProcessingRecording(false);
      }
    },
    [participantAudios, currentRecordingId]
  );

  // ─── Public API ──────────────────────────────────────────────────────────────

  return {
    isRecording,
    /** One entry per participant: { name, identity, blob, offsetSeconds } */
    participantAudios,
    /** True while Groq is transcribing + generating reports */
    processingRecording,
    meetingSummaries,
    toggleRecording,
    processRecording,
    setMeetingSummaries,
    // Backward-compat alias — points to first participant's blob
    recordingBlob: participantAudios[0]?.blob ?? null,
  };
}

