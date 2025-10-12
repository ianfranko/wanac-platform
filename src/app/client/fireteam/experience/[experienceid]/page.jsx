"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";

// Custom Hooks
import { useJitsiMeeting } from "../hooks/useJitsiMeeting";
import { useRecording } from "../hooks/useRecording";
import { useMeetingData } from "../hooks/useMeetingData";
import { useToast } from "../hooks/useToast";

// UI Components
import MeetingTopBar from "../components/MeetingTopBar";
import JitsiVideoContainer from "../components/JitsiVideoContainer";
import MeetingFooter from "../components/MeetingFooter";
import { ToastContainer } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

// Existing Components
import EnhancedAgendaSidebar from "../../components/EnhancedAgendaSidebar";
import Slide from "../../components/SlideComponent";
import WanacControlBar from "../../components/WanacControlBar";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar.jsx";
import AdminSidebar from "../../../../../../components/dashboardcomponents/adminsidebar";
import MeetingSummaryModal from "../../components/MeetingSummaryModal";

export default function FireteamExperienceMeeting() {
  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  const searchParams = useSearchParams();
  const isAdmin = searchParams?.get("admin") === "true";

  // UI State
  const [currentStep, setCurrentStep] = useState(0);
  const [showSlide, setShowSlide] = useState(false); // Start with video view to show Jitsi UI
  const [collapsed, setCollapsed] = useState(true); // Start collapsed by default
  const [chatMessages, setChatMessages] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jitsiContainerId] = useState(
    () => `jitsi-container-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}`
  );

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(isAdmin ? 'wanacAdminSidebarCollapsed' : 'wanacSidebarCollapsed');
      if (stored !== null) {
        setCollapsed(stored === 'true');
      }
    }
  }, [isAdmin]);

  // Toast notifications
  const toast = useToast();

  // Custom Hooks
  const {
    experience,
    fireteam,
    agenda,
    exhibits,
    loading: dataLoading,
    calculateTotalTime,
  } = useMeetingData(searchParams);

  const {
    jitsiApiRef,
    jitsiReady,
    participants,
    meetingStartTime,
    attendanceLog,
    loading: jitsiLoading,
    error: jitsiError,
    initializeMeeting,
    leaveMeeting,
  } = useJitsiMeeting(jitsiContainerId);

  const {
    isRecording,
    recordingBlob,
    processingRecording,
    meetingSummaries,
    toggleRecording,
    processRecording,
    setMeetingSummaries,
  } = useRecording(jitsiApiRef, jitsiReady);

  // ============================================================================
  // MEETING INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const expId = searchParams?.get("id");
    const ftId = searchParams?.get("fireteamId");
    const linkParam = searchParams?.get("link");

    console.log("🔄 Experience changed - Experience ID:", expId, "Fireteam ID:", ftId);

    async function init() {
      try {
        // First, dispose of any existing Jitsi instance
        if (jitsiApiRef.current) {
          console.log("🧹 Cleaning up previous Jitsi instance...");
          try {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
          } catch (err) {
            console.warn("⚠️ Error disposing Jitsi instance:", err);
          }
        }

        // Reset state for new experience
        setChatMessages([]);
        setCurrentStep(0);
        setShowSummaryModal(false);

        let meetingLink = null;

        if (linkParam) {
          meetingLink = decodeURIComponent(linkParam);
          console.log("✅ Using link from URL params for experience", expId, ":", meetingLink);
        } else if (expId) {
          meetingLink = `https://meet.jit.si/fireteam-exp-${expId}`;
          console.log("🆕 Generated meeting link for experience", expId, ":", meetingLink);
        } else if (ftId) {
          meetingLink = `https://meet.jit.si/fireteam-${ftId}`;
          console.log("🆕 Generated meeting link for fireteam", ftId, ":", meetingLink);
        } else {
          meetingLink = `https://meet.jit.si/fireteam-default-${Date.now()}`;
          console.log("🆕 Using fallback meeting link:", meetingLink);
        }

        // Parse meeting URL
        const urlObj = new URL(meetingLink);
        const domain = urlObj.hostname;
        const parts = urlObj.pathname.split("/").filter(Boolean);
        const roomName = parts[parts.length - 1] || "";

        console.log("🔍 Parsed for experience", expId, "- Domain:", domain, "Room:", roomName);

        // Show video view to ensure container is rendered
        setShowSlide(false);

        // Initialize Jitsi meeting with a small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 300));
        await initializeMeeting(domain, roomName);
      } catch (err) {
        console.error("❌ Meeting initialization error:", err);
      }
    }

    init();

    // Cleanup function to dispose Jitsi when component unmounts or experience changes
    return () => {
      if (jitsiApiRef.current) {
        console.log("🧹 Cleaning up Jitsi on unmount/experience change...");
        try {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        } catch (err) {
          console.warn("⚠️ Error disposing Jitsi instance:", err);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("id"), searchParams?.get("fireteamId"), searchParams?.get("link")]);

  // ============================================================================
  // VISIBILITY TOGGLE (Slide vs Video) - Now handled by CSS classes in render
  // ============================================================================

  useEffect(() => {
    console.log("🔄 View mode changed:", showSlide ? "SLIDES" : "VIDEO");
  }, [showSlide]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleNext = useCallback(() => {
    if (currentStep < agenda.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowSlide(true); // Auto-switch to slide view when navigating
    }
  }, [currentStep, agenda.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowSlide(true); // Auto-switch to slide view when navigating
    }
  }, [currentStep]);

  const handleSendChatMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: message,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleToggleRecording = useCallback(async () => {
    try {
      await toggleRecording();
      toast.success(isRecording ? "Recording stopped" : "Recording started");
    } catch (err) {
      toast.error(err.message || "Failed to toggle recording");
    }
  }, [toggleRecording, isRecording, toast]);

  const handleProcessRecording = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id") || "unknown";
      const userName = localStorage.getItem("user_name") || "Participant";

      const meetingData = {
        experienceTitle: experience?.title || "Fireteam Experience",
        experienceDescription: experience?.description || experience?.experience || "",
        agenda: agenda
          .filter((a) => !a.isWaitingRoom)
          .map((a) => ({
            title: a.title,
            duration: a.duration,
          })),
        participants: participants.map((p) => ({
          id: p.id,
          name: p.name,
        })),
        duration: calculateTotalTime(),
        userId,
        userName,
        attendanceLog,
        startTime: meetingStartTime ? meetingStartTime.toISOString() : new Date().toISOString(),
      };

      toast.info("Processing recording... This may take a minute.");
      const summaries = await processRecording(meetingData, searchParams);
      setShowSummaryModal(true);
      toast.success("AI summary generated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to process recording");
    }
  }, [experience, agenda, participants, calculateTotalTime, attendanceLog, meetingStartTime, processRecording, searchParams, toast]);

  const handleLeaveMeeting = useCallback(async () => {
    // Stop recording if active
    if (isRecording) {
      await handleToggleRecording();
    }

    // Prompt to process recording if available
    if (recordingBlob && !processingRecording) {
      setShowConfirmDialog(true);
      return;
    }

    // Leave meeting
    leaveMeeting();

    // Redirect to fireteam page
    window.location.href = "/client/fireteam";
  }, [isRecording, recordingBlob, processingRecording, handleToggleRecording, leaveMeeting]);

  const handleConfirmProcessRecording = useCallback(async () => {
    setShowConfirmDialog(false);
    await handleProcessRecording();
    leaveMeeting();
    window.location.href = "/client/fireteam";
  }, [handleProcessRecording, leaveMeeting]);

  const handleCancelProcessRecording = useCallback(() => {
    setShowConfirmDialog(false);
    leaveMeeting();
    window.location.href = "/client/fireteam";
  }, [leaveMeeting]);

  const handleTimerComplete = useCallback(() => {
    console.log("⏰ Timer completed for step:", currentStep);
    toast.info(`Step "${agenda[currentStep]?.title}" time is up!`);
  }, [currentStep, agenda, toast]);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const agendaArray = useMemo(
    () => agenda.map(({ title, duration }) => [title, duration]),
    [agenda]
  );

  const currentStepDuration = useMemo(
    () => agenda[currentStep]?.duration,
    [agenda, currentStep]
  );

  const participantsForSidebar = useMemo(
    () => participants.map((p) => ({ id: p.id, name: p.name })),
    [participants]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="h-screen flex bg-gray-50" role="main">
      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onRemoveToast={toast.removeToast} />

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          title="Generate AI Summary?"
          message="Would you like to generate an AI summary of this meeting? This may take a minute."
          confirmText="Generate Summary"
          cancelText="Skip"
          onConfirm={handleConfirmProcessRecording}
          onCancel={handleCancelProcessRecording}
        />
      )}

      {/* Sidebar - Admin or Regular */}
      {isAdmin ? (
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      ) : (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      {/* Main Content - Adjust margin based on sidebar collapsed state */}
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-56"
        }`}
      >
        {/* Top Bar */}
        <MeetingTopBar
          isAdmin={isAdmin}
          experienceTitle={experience?.title}
          currentStep={currentStep}
          totalSteps={agenda.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          duration={currentStepDuration}
          onTimerComplete={handleTimerComplete}
          controlBarComponent={
            <WanacControlBar
              showSlide={showSlide}
              onToggleView={() => setShowSlide(!showSlide)}
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              onLeaveMeeting={handleLeaveMeeting}
              recordingBlob={recordingBlob}
              processingRecording={processingRecording}
              onProcessRecording={handleProcessRecording}
            />
          }
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Middle content area */}
          <section 
            className="flex-1 flex flex-col justify-center items-center p-8 relative bg-gray-100"
            aria-label="Meeting content area"
          >
            {/* Jitsi Video Container - Visibility controlled by CSS classes */}
            <div 
              className={`w-full h-full ${
                showSlide 
                  ? 'invisible absolute opacity-0 pointer-events-none' 
                  : 'visible relative opacity-100 pointer-events-auto'
              }`}
            >
              <JitsiVideoContainer
                jitsiContainerId={jitsiContainerId}
                showSlide={showSlide}
                loading={jitsiLoading}
                error={jitsiError}
              />
            </div>

            {/* Slide content */}
            {showSlide && (
              <div 
                className="w-full h-full flex items-center justify-center p-8"
                role="region"
                aria-label={`Slide ${currentStep + 1}: ${agenda[currentStep]?.title}`}
              >
                <Slide
                  step={agenda[currentStep]}
                  participants={participants}
                  experienceTitle={experience?.title || ""}
                />
              </div>
            )}
          </section>

          {/* Agenda Sidebar */}
          <EnhancedAgendaSidebar
            agenda={agendaArray}
            moduleTitle={experience?.title || "Customer Discovery"}
            moduleDescription={
              experience?.description ||
              experience?.experience ||
              "In this module, you will explore key concepts and engage with your fireteam."
            }
            currentStep={currentStep}
            onStepClick={(step) => {
              setCurrentStep(step);
              setShowSlide(true); // Show slide when clicking agenda item
            }}
            peers={participantsForSidebar}
            exhibits={exhibits}
            chatMessages={chatMessages}
            onSendMessage={handleSendChatMessage}
          />
        </div>

        {/* Footer */}
        <MeetingFooter
          currentStep={currentStep}
          agenda={agenda}
          totalTime={calculateTotalTime()}
        />
      </div>

      {/* Meeting Summary Modal */}
      {showSummaryModal && meetingSummaries && (
        <MeetingSummaryModal
          summaries={meetingSummaries}
          onClose={() => setShowSummaryModal(false)}
          userRole={isAdmin ? "admin" : "participant"}
        />
      )}
    </div>
  );
}
