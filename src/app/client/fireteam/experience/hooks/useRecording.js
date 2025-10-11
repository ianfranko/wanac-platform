import { useState, useRef } from 'react';
import axios from 'axios';
import { openaiService } from '../../../../../services/api/openai.service';

/**
 * Custom hook to manage meeting recording and AI processing
 */
export function useRecording(jitsiApiRef, jitsiReady) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [processingRecording, setProcessingRecording] = useState(false);
  const [meetingSummaries, setMeetingSummaries] = useState(null);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  /**
   * Toggle recording on/off
   */
  const toggleRecording = async () => {
    if (!jitsiApiRef?.current || !jitsiReady) return;

    try {
      if (isRecording) {
        // STOP RECORDING
        console.log('🛑 Stopping recording...');

        // Stop Jitsi recording if available
        try {
          jitsiApiRef.current.executeCommand('stopRecording', 'file');
        } catch (err) {
          console.warn('Could not stop Jitsi recording:', err);
        }

        // Stop local media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }

        setIsRecording(false);
        console.log('✅ Recording stopped');
      } else {
        // START RECORDING
        console.log('🔴 Starting recording...');

        // Start Jitsi recording if available
        try {
          jitsiApiRef.current.executeCommand('startRecording', {
            mode: 'file',
            shouldShare: false,
          });
        } catch (err) {
          console.warn('Could not start Jitsi recording:', err);
        }

        // Start local media recorder as backup
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          recordedChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
            setRecordingBlob(blob);
            console.log('✅ Recording saved, size:', blob.size);

            // Stop all tracks
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorder.start();
          console.log('✅ Local media recorder started');
        } catch (err) {
          console.error('❌ Failed to start local recorder:', err);
        }

        setIsRecording(true);

        // Generate a temporary recording ID
        const tempRecordingId = `rec_${Date.now()}`;
        setCurrentRecordingId(tempRecordingId);
        console.log('✅ Recording started with ID:', tempRecordingId);
      }
    } catch (err) {
      console.error('❌ Failed to toggle recording:', err);
      throw new Error('Failed to toggle recording: ' + err.message);
    }
  };

  /**
   * Process recording with AI transcription and summaries
   */
  const processRecording = async (meetingData, searchParams) => {
    if (!recordingBlob || !currentRecordingId) {
      throw new Error('No recording available to process');
    }

    setProcessingRecording(true);

    try {
      const userId = localStorage.getItem('user_id') || 'unknown';
      const userName = localStorage.getItem('user_name') || 'Participant';
      const expId = searchParams?.get('id');
      const ftId = searchParams?.get('fireteamId');

      console.log('🎙️ Starting transcription...');

      // Step 1: Transcribe audio using OpenAI Whisper
      const transcriptionResult = await openaiService.transcribeAudio(recordingBlob);
      const transcript = transcriptionResult.text;

      console.log('✅ Transcription complete, length:', transcript.length);
      console.log('🤖 Generating AI summaries...');

      // Step 2: Generate all 3 summaries in parallel
      const summaries = await openaiService.generateMeetingSummaries(transcript, meetingData);

      console.log('✅ AI summaries generated');
      console.log('📤 Uploading to backend...');

      // Step 3: Upload recording file with metadata to backend
      const formData = new FormData();
      formData.append('file', recordingBlob, 'meeting-recording.webm');
      formData.append('fire_team_id', ftId);

      // Add metadata as JSON string in the form data
      const metadata = {
        experience_id: expId,
        transcript: transcript,
        summaries: summaries,
        participants: meetingData.attendanceLog || [],
        start_time: meetingData.startTime || new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration: meetingData.duration || '0 mins',
        user_id: userId,
        user_name: userName,
      };

      formData.append('metadata', JSON.stringify(metadata));

      // Upload to backend API
      const response = await axios.post(
        'https://wanac-api.kuzasports.com/api/v1/fireteams/recordings/add',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('✅ Recording uploaded successfully:', response.data);

      // Set summaries for modal display
      setMeetingSummaries(summaries);

      return summaries;
    } catch (error) {
      console.error('❌ Failed to process recording:', error);
      throw new Error(
        'Failed to process recording: ' + (error.response?.data?.message || error.message)
      );
    } finally {
      setProcessingRecording(false);
    }
  };

  return {
    isRecording,
    recordingBlob,
    processingRecording,
    meetingSummaries,
    toggleRecording,
    processRecording,
    setMeetingSummaries,
  };
}

