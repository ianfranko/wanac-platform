"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CoachSidebar from '../../../../../components/dashboardcomponents/CoachSidebar';
import ClientTopbar from '../../../../../components/dashboardcomponents/clienttopbar';
import { FaCalendar, FaVideo, FaMicrophone, FaUpload, FaRobot, FaBookOpen, FaInfoCircle } from 'react-icons/fa';
import SessionRecorder from "../../client/session/SessionRecorder";
import FileUpload from "../../client/session/FileUpload";
import { sessionsService } from '../../../../services/api/sessions.service';

export default function CoachSessionsPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [liveSession, setLiveSession] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  // Ensure user is always defined
  const [user, setUser] = useState({ name: "Coach" });
  const [showBooking, setShowBooking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: "Coach" });
      }
    } else {
      setUser({ name: "Coach" });
    }
    
    // Set min date for booking form (client only)
    setMinDate(new Date().toISOString().split('T')[0]);
    // Fetch existing sessions
    const fetchSessions = async () => {
      try {
        const sessions = await sessionsService.getSessions();
        setUpcomingSessions(sessions.map(session => {
          // Use fixed formatting for date/time
          const d = new Date(session.date);
          const pad = n => n.toString().padStart(2, '0');
          const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
          const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
          return {
            ...session,
            time,
            date,
            link: session.meeting_link || '',
            resources: session.resources || '',
            notes: session.description || '',
            status: session.status || 'Scheduled'
          };
        }));
      } catch (error) {
        console.error('Error fetching sessions:', error);
    }
    };
    fetchSessions();
  }, []);

  const handleBookSession = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const notes = form.notes.value;
    const date = form.date.value;
    const formatted = date.toLocaleString('sv-SE', { hour12: false }).replace(' ', 'T');


    try {
      // Generate a unique Jitsi meeting link using the session title
      const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') .replace(/(^-|-$)/g, '') : 'session';
      const randomString = Math.random().toString(36).substring(2, 8);
      // Combine date and time into ISO string for scheduled_at
      const scheduled_at = formatted;

      const sessionData = {
        title: title || `Session`,
        description: notes || '',
        scheduled_at,

      };

      const newSession = await sessionsService.addSession(sessionData);

      setUpcomingSessions([...upcomingSessions, {
        ...newSession,
        title: title || `Session`,
        notes,
        status: "Scheduled"
      }]);

      setShowBooking(false);
      setSuccessMessage("Session scheduled successfully!");
      form.reset();

      // Clear the success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      // After 1 second, navigate to the session detail/edit page
      setTimeout(() => {
        if (newSession.id) {
          router.push(`/pages/coach/sessions/${newSession.id}`);
        }
      }, 1000);
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 font-serif">
      {/* Sidebar */}
      <CoachSidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user || { name: "Coach" }} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-2 md:px-8 py-6 bg-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Welcome & Instructions */}
            <section className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
              <FaInfoCircle className="text-primary text-2xl" />
              <div>
                <h1 className="text-xl font-bold mb-1">Welcome to Your Coaching Sessions Dashboard</h1>
                <p className="text-gray-600 text-sm">Manage, book, join, record, and review your coaching sessions. Upload recordings to get AI-powered transcripts, summaries, and actionable insights for your clients.</p>
              </div>
            </section>

            {/* All Scheduled Meetings */}
            <section className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendar className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">All Scheduled Meetings</h2>
              </div>
              {upcomingSessions.length === 0 ? (
                <p className="text-gray-500 text-sm">No meetings scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {(upcomingSessions.slice(0, 3)).map((session) => (
                    <div
                      key={session.id}
                      className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded cursor-pointer hover:bg-primary/10 transition"
                      onClick={() => router.push(`/pages/coach/sessions/fullviewsession/${session.id}`)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{session.title}</p>
                          <p className="text-sm text-gray-600">Status: {session.status}</p>
                          {session.link && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Meeting Link</label>
                              <input
                                type="text"
                                value={session.link}
                                readOnly
                                className="block w-full text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 mt-1 text-blue-700 cursor-pointer focus:outline-none"
                                onFocus={e => e.target.select()}
                                onClick={e => e.target.select()}
                              />
                              <a
                                href={session.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs mt-1 inline-block"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                          {session.resources && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Resources</label>
                              <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 mt-1 break-words">{session.resources}</div>
                            </div>
                          )}
                          {session.notes && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Notes</label>
                              <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 mt-1 break-words">{session.notes}</div>
                            </div>
                          )}
                          {session.files && session.files.length > 0 && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Files</label>
                              <ul className="text-xs mt-1">
                                {session.files.map((file, idx) => (
                                  <li key={idx}>
                                    <a href={file.url} download={file.name} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{file.name}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">{session.date}</p>
                          <p className="text-sm text-gray-600">{session.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions.length > 3 && (
                    <div className="text-right mt-2">
                      <button
                        className="text-blue-600 underline text-sm font-medium hover:text-blue-800"
                        onClick={() => router.push("/pages/coach/sessions/all")}
                      >
                        View More
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaBookOpen className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">Schedule a Session</h2>
              </div>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors w-max"
                onClick={() => {
                  setShowBooking(!showBooking);
                  if (!showBooking) setSuccessMessage(""); // Clear success message when opening form
                }}
              >
                {showBooking ? "Cancel" : "Schedule a Session"}
              </button>
              {successMessage && !showBooking && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded">
                  {successMessage}
                </div>
              )}
              {showBooking && (
                <form
                  onSubmit={handleBookSession}
                  className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                      <input
                        name="title"
                        placeholder="Session title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                      <textarea
                        name="notes"
                        placeholder="Session description (optional)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                        rows={2}
                      />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                      <input
                        name="date"
                        type="datetime-local"
                        required
                        min={minDate}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
              
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              )}
            </section>
            {/* Live Video Meeting (navigates to separate screen) */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaVideo className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">Live One-on-One Video Meeting</h2>
              </div>
              <button
                onClick={() => router.push("/pages/coach/sessions/live-session")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors w-max mb-4"
              >
                Start Live Video Meeting
              </button>
            </section>

            {/* AI Results Placeholder */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaRobot className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">AI Results</h2>
              </div>
              <div className="text-gray-500 text-sm">
                After uploading your session, AI-generated transcript, summary, and insights will appear here.
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
