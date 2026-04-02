import { apiClient } from './config';
// NOTE: AI processing (transcription + summaries) is handled by groq.service.ts
// via useRecording.js. This service manages the recording lifecycle on the backend only.
import type { MeetingSummary } from './groq.service';

export interface RecordingMetadata {
  experienceId: string | number;
  fireteamId: string | number;
  userId: string;
  userName: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  participants: Array<{ id: string; name: string; joinedAt: string; leftAt?: string }>;
}

export interface MeetingRecording {
  id?: string | number;
  experienceId: string | number;
  fireteamId: string | number;
  recordingUrl?: string;
  transcriptUrl?: string;
  transcript?: string;
  metadata: RecordingMetadata;
  summaries?: MeetingSummary;
  status: 'recording' | 'processing' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

function unwrapItem(payload: any): any {
  if (payload?.data && typeof payload.data === 'object') return payload.data;
  return payload;
}

export const recordingService = {
  /**
   * Save recording metadata when recording starts
   */
  async startRecording(metadata: RecordingMetadata): Promise<MeetingRecording> {
    try {
      const response = await apiClient.post('/api/v1/recordings/start', {
        experience_id: metadata.experienceId,
        fireteam_id: metadata.fireteamId,
        user_id: metadata.userId,
        user_name: metadata.userName,
        start_time: metadata.startTime,
        participants: metadata.participants,
        status: 'recording',
      });
      return unwrapItem(response.data);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      throw error;
    }
  },

  /**
   * Update recording when it ends
   */
  async endRecording(
    recordingId: string | number,
    endTime: string,
    duration: string
  ): Promise<MeetingRecording> {
    try {
      const response = await apiClient.put(`/api/v1/recordings/${recordingId}/end`, {
        end_time: endTime,
        duration,
        status: 'processing',
      });
      return unwrapItem(response.data);
    } catch (error: any) {
      console.error('Error ending recording:', error);
      throw error;
    }
  },

  /**
   * Upload recording file (audio/video)
   */
  async uploadRecording(recordingId: string | number, file: File | Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('recording', file);
      formData.append('recording_id', recordingId.toString());

      const response = await apiClient.post(`/api/v1/recordings/${recordingId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = unwrapItem(response.data);
      return data.recordingUrl || data.recording_url || data.url;
    } catch (error: any) {
      console.error('Error uploading recording:', error);
      throw error;
    }
  },

  /**
   * @deprecated AI processing is now handled client-side by groq.service.ts
   * via the useRecording hook. Use meetingService.uploadRecording() instead,
   * which accepts pre-generated summaries + transcript in the metadata payload.
   *
   * This method is kept only for any legacy callers and will be removed.
   */
  async processRecording(
    _recordingId: string | number,
    _audioFile: File | Blob,
    _meetingData: unknown
  ): Promise<{ transcript: string; summaries: MeetingSummary }> {
    throw new Error(
      'recordingService.processRecording() is deprecated. ' +
      'Use groqService.generateSessionReport() + meetingService.uploadRecording() instead.'
    );
  },

  /**
   * Get recording by ID
   */
  async getRecording(recordingId: string | number): Promise<MeetingRecording> {
    try {
      const response = await apiClient.get(`/api/v1/recordings/${recordingId}`);
      return unwrapItem(response.data);
    } catch (error: any) {
      console.error('Error fetching recording:', error);
      throw error;
    }
  },

  /**
   * Get all recordings for an experience
   */
  async getExperienceRecordings(experienceId: string | number): Promise<MeetingRecording[]> {
    try {
      const response = await apiClient.get(`/api/v1/recordings/experience/${experienceId}`);
      const data = unwrapItem(response.data);
      return Array.isArray(data) ? data : data.recordings || [];
    } catch (error: any) {
      console.error('Error fetching experience recordings:', error);
      return [];
    }
  },

  /**
   * Get all recordings for a fireteam
   */
  async getFireteamRecordings(fireteamId: string | number): Promise<MeetingRecording[]> {
    try {
      const response = await apiClient.get(`/api/v1/recordings/fireteam/${fireteamId}`);
      const data = unwrapItem(response.data);
      return Array.isArray(data) ? data : data.recordings || [];
    } catch (error: any) {
      console.error('Error fetching fireteam recordings:', error);
      return [];
    }
  },

  /**
   * Get user's summary for a recording
   */
  async getUserSummary(recordingId: string | number, userId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/recordings/${recordingId}/summary/user/${userId}`);
      return unwrapItem(response.data);
    } catch (error: any) {
      console.error('Error fetching user summary:', error);
      throw error;
    }
  },

  /**
   * Get coach summary for a recording
   */
  async getCoachSummary(recordingId: string | number): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/recordings/${recordingId}/summary/coach`);
      return unwrapItem(response.data);
    } catch (error: any) {
      console.error('Error fetching coach summary:', error);
      throw error;
    }
  },

  /**
   * Get admin summary for a recording
   */
  async getAdminSummary(recordingId: string | number): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/recordings/${recordingId}/summary/admin`);
      return unwrapItem(response.data);
    } catch (error: any) {
      console.error('Error fetching admin summary:', error);
      throw error;
    }
  },

  /**
   * Delete a recording
   */
  async deleteRecording(recordingId: string | number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/recordings/${recordingId}`);
    } catch (error: any) {
      console.error('Error deleting recording:', error);
      throw error;
    }
  },
};
