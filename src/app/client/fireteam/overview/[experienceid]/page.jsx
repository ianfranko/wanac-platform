"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar";
import { fireteamService } from "../../../../../services/api/fireteam.service";
import { experienceService } from "../../../../../services/api/experience.service";

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons
   ───────────────────────────────────────────────────────────────────────────── */
function ChevronRight({ cls = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={cls}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ChevronDown({ cls = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={cls}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ size = 14 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChatBubble() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* Avatar with initials */
function Avatar({ name, color = "bg-orange-300", size = "w-8 h-8" }) {
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`${size} rounded-full ${color} flex items-center justify-center
                     text-xs font-bold text-white border-2 border-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

const avatarColors = ["bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400", "bg-teal-400"];

/* ─────────────────────────────────────────────────────────────────────────────
   Session countdown hook
   ───────────────────────────────────────────────────────────────────────────── */
function useCountdown(sessionDate, sessionTime) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!sessionDate) return;

    function compute() {
      try {
        const dateStr = sessionDate.includes("T") ? sessionDate : `${sessionDate}T${sessionTime || "00:00"}:00`;
        const target = new Date(dateStr);
        if (isNaN(target.getTime())) return;

        const now = Date.now();
        const diff = target.getTime() - now;

        // "Live" window: from start until 3 hours after
        if (diff <= 0 && diff > -3 * 60 * 60 * 1000) {
          setIsLive(true);
          setTimeLeft(null);
          return;
        }
        if (diff <= -3 * 60 * 60 * 1000) {
          setIsLive(false);
          setTimeLeft(null); // session passed
          return;
        }

        setIsLive(false);
        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        setTimeLeft({ days, hours, mins, secs, totalSecs });
      } catch (_) {}
    }

    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [sessionDate, sessionTime]);

  return { timeLeft, isLive };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Session Countdown Display
   ───────────────────────────────────────────────────────────────────────────── */
function CountdownBanner({ timeLeft, isLive }) {
  if (isLive) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl mb-4">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-bold text-green-700">Session is Live Now!</span>
      </div>
    );
  }

  if (!timeLeft) return null;

  // More than 2 days — show a compact single-line
  if (timeLeft.days > 2) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl mb-4">
        <ClockIcon />
        <span className="text-sm text-blue-700">
          Session starts in <strong>{timeLeft.days} days</strong>
          {timeLeft.hours > 0 && <>, {timeLeft.hours} hrs</>}
        </span>
      </div>
    );
  }

  // 2 days or less — show live countdown blocks
  return (
    <div className="mb-4">
      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider text-center mb-2">
        Session Starts In
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { val: timeLeft.days, label: "Days" },
          { val: timeLeft.hours, label: "Hrs" },
          { val: timeLeft.mins, label: "Min" },
          { val: timeLeft.secs, label: "Sec" },
        ].map(({ val, label }) => (
          <div key={label} className="bg-gray-900 rounded-lg py-2 text-center">
            <div className="text-white font-bold text-lg leading-none tabular-nums">
              {String(val).padStart(2, "0")}
            </div>
            <div className="text-gray-400 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Agenda item row
   ───────────────────────────────────────────────────────────────────────────── */
function AgendaRow({ item, index }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold
                      flex items-center justify-center flex-shrink-0 mt-0.5">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium leading-snug">{item.title}</p>
        {item.description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.description}</p>
        )}
      </div>
      {item.duration && (
        <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1 mt-0.5">
          <ClockIcon /> {item.duration}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Exhibit / material row
   ───────────────────────────────────────────────────────────────────────────── */
function ExhibitRow({ exhibit }) {
  const isVideo = exhibit.type?.toLowerCase().includes("video");
  const Icon = isVideo ? VideoIcon : exhibit.link ? LinkIcon : FileIcon;

  const inner = (
    <div className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group">
      <span className="text-blue-500"><Icon /></span>
      <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{exhibit.name}</span>
      {exhibit.link && (
        <ChevronRight cls="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
      )}
    </div>
  );

  if (exhibit.link) {
    return (
      <a href={exhibit.link} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Status Badge
   ───────────────────────────────────────────────────────────────────────────── */
function StatusBadge({ status, isLive }) {
  if (isLive) return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Live Now
    </div>
  );
  if (status === "completed") return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-green-600">
      <CheckIcon size={12} /> Completed
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-600">
      Upcoming
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Overview Page
   ───────────────────────────────────────────────────────────────────────────── */
export default function ExperienceOverviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const experienceId = params?.experienceid;
  const fireteamId = searchParams?.get("fireteamId");
  const meetingLink = searchParams?.get("link");

  const [collapsed, setCollapsed] = useState(true);
  const [experience, setExperience] = useState(null);
  const [fireteam, setFireteam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agendaOpen, setAgendaOpen] = useState(true);
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Fetch experience + fireteam + members
  useEffect(() => {
    if (!experienceId || !fireteamId) return;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // Run fetches in parallel; getExperience doesn't exist — use getExperiences list
        const [experiences, ft, mems] = await Promise.all([
          experienceService.getExperiences(fireteamId).catch(() => []),
          fireteamService.getFireteam?.(fireteamId).catch(() => null),
          fireteamService.getFireteamMembers?.(fireteamId).catch(() => []),
        ]);

        // Find this experience in the list
        const exp = Array.isArray(experiences)
          ? experiences.find(e => String(e.id) === String(experienceId))
          : null;

        setExperience(exp ?? null);
        setFireteam(ft ?? null);
        setMembers(mems ?? []);
      } catch (e) {
        setError("Failed to load experience details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [experienceId, fireteamId]);

  const sessionDate = experience?.session_date ?? fireteam?.date ?? null;
  const sessionTime = experience?.session_time ?? fireteam?.time ?? "00:00";
  const { timeLeft, isLive } = useCountdown(sessionDate, sessionTime);

  /* Navigation helpers */
  const goToSession = () => {
    const link = meetingLink || experience?.link || fireteam?.link || "";
    let url = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}`;
    if (link) url += `&link=${encodeURIComponent(link)}`;
    router.push(url);
  };

  const goToResults = () => {
    router.push(
      `/client/fireteam/experience/${experienceId}/evaluation?experienceId=${experienceId}&fireteamId=${fireteamId}`
    );
  };

  const isCompleted = experience?.status === "completed";
  const expTitle = experience?.title ?? "Experience";
  const ftTitle = fireteam?.title ?? "FireTeam";
  const coachName = fireteam?.coach_name ?? experience?.coach_name ?? null;

  // Agenda items — API may use different field names, try them all
  const rawAgenda =
    experience?.agenda ??
    experience?.agenda_steps ??
    experience?.agendaSteps ??
    experience?.agenda_items ??
    experience?.agendaItems ??
    [];
  const agenda = Array.isArray(rawAgenda)
    ? [...rawAgenda].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  // Exhibits / materials
  const exhibits = Array.isArray(experience?.exhibits) ? experience.exhibits : [];

  // Visible members
  const MEMBER_LIMIT = 4;
  const visibleMembers = showAllMembers ? members : members.slice(0, MEMBER_LIMIT);
  const hiddenCount = members.length - MEMBER_LIMIT;

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8">

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3" />
            <p className="text-sm">Loading…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <button onClick={() => router.back()} className="text-sm text-gray-500 underline">Go back</button>
          </div>
        ) : (
          <>
            {/* ── Breadcrumb ── */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
              <button onClick={() => router.push("/client/fireteam")} className="hover:text-gray-700 transition-colors">
                Home
              </button>
              <ChevronRight />
              <span className="text-gray-600 font-medium truncate max-w-xs">{expTitle}</span>
            </nav>

            {/* ── Page title + status badge ── */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight max-w-2xl">
                {expTitle}
              </h1>
              <StatusBadge status={experience?.status} isLive={isLive} />
            </div>

            {/* ── Two-column layout ── */}
            <div className="flex gap-5 items-start">

              {/* ── LEFT: agenda (hero) + description + materials ── */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">

                {/* ── AGENDA CARD — always shown, this is the main pre-session info ── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Stacked-lines icon */}
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6" />
                          <line x1="8" y1="12" x2="21" y2="12" />
                          <line x1="8" y1="18" x2="21" y2="18" />
                          <line x1="3" y1="6" x2="3.01" y2="6" />
                          <line x1="3" y1="12" x2="3.01" y2="12" />
                          <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-base leading-tight">
                          What you&apos;ll cover in this session
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {agenda.length > 0
                            ? `${agenda.length} agenda item${agenda.length !== 1 ? "s" : ""}${experience?.duration_mins ? ` · ${experience.duration_mins} min total` : ""}`
                            : "Session agenda"}
                        </p>
                      </div>
                    </div>
                    {agenda.length > 0 && (
                      <button
                        onClick={() => setAgendaOpen(o => !o)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={agendaOpen ? "Collapse agenda" : "Expand agenda"}
                      >
                        <ChevronDown cls={`text-gray-400 transition-transform ${agendaOpen ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {/* Agenda items */}
                  {agenda.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p className="text-sm text-gray-400">No agenda items have been set for this session yet.</p>
                    </div>
                  ) : agendaOpen ? (
                    <div className="divide-y divide-gray-50">
                      {agenda.map((item, i) => (
                        <div key={item.id ?? i} className="flex items-start gap-4 px-6 py-4">
                          {/* Step number */}
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold
                                          flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                            {(item.description ?? item.details) && (
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {item.description ?? item.details}
                              </p>
                            )}
                          </div>
                          {/* Duration chip */}
                          {item.duration && (
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400
                                             bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg flex-shrink-0 mt-0.5">
                              <ClockIcon /> {item.duration}
                            </span>
                          )}
                        </div>
                      ))}
                      {/* Total duration footer */}
                      {experience?.duration_mins && (
                        <div className="px-6 py-3 bg-gray-50 flex items-center gap-2 text-xs text-gray-500">
                          <ClockIcon />
                          <span>Total session time: <strong className="text-gray-700">{experience.duration_mins} minutes</strong></span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-6 py-3 text-xs text-gray-400 flex items-center gap-1">
                      <span>{agenda.length} agenda item{agenda.length !== 1 ? "s" : ""} — click to expand</span>
                    </div>
                  )}
                </div>

                {/* Description card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Card header */}
                  <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-base font-bold text-blue-500">
                      {expTitle[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="font-bold text-base text-gray-900 truncate">{ftTitle}</h2>
                        {experience?.duration_mins && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ClockIcon />
                            <span>{experience.duration_mins} min session</span>
                          </div>
                        )}
                      </div>
                      {coachName && (
                        <p className="text-sm text-gray-500 mt-0.5">Coach: {coachName}</p>
                      )}
                    </div>
                  </div>

                  {/* Description body */}
                  <div className="px-6 py-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      About This Experience
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {experience?.description
                        ?? "In this experience, you'll collaborate with your FireTeam to discuss key concepts, share insights, and grow together through structured discussion and guided learning."}
                    </p>
                  </div>

                  {/* Dates footer */}
                  {(experience?.available_from || experience?.due_date) && (
                    <div className="border-t border-gray-100 px-6 py-4 flex gap-6 flex-wrap">
                      {experience?.available_from && (
                        <p className="text-sm text-gray-500">
                          Available From:{" "}
                          <strong className="text-gray-800">
                            {new Date(experience.available_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </strong>
                        </p>
                      )}
                      {experience?.due_date && (
                        <p className="text-sm text-gray-500">
                          Due Date:{" "}
                          <strong className="text-gray-800">
                            {new Date(experience.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </strong>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Course materials card */}
                {exhibits.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">Course Materials</p>
                    </div>
                    <div className="px-3 py-3">
                      {exhibits.map((ex, i) => (
                        <ExhibitRow key={ex.id ?? i} exhibit={ex} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty materials fallback (no exhibits) */}
                {exhibits.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Course Materials</p>
                    <button className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                      View Details <ChevronRight />
                    </button>
                  </div>
                )}
              </div>

              {/* ── RIGHT: group info + countdown + actions ── */}
              <div className="w-72 flex-shrink-0 flex flex-col gap-4">

                {/* Session info + countdown card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  {/* Session date/time header */}
                  {sessionDate && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Session Date
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(sessionDate).toLocaleDateString("en-US", {
                          weekday: "long", month: "long", day: "numeric", year: "numeric",
                        })}
                      </p>
                      {sessionTime && (
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                          <ClockIcon /> {sessionTime}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Countdown */}
                  {!isCompleted && (
                    <CountdownBanner timeLeft={timeLeft} isLive={isLive} />
                  )}

                  {/* Experience status line */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                    {isLive ? (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </span>
                    ) : isCompleted ? (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                        <CheckIcon size={11} /> Completed
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-blue-600">Upcoming</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={goToSession}
                      className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-center transition-colors
                        ${isLive
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : isCompleted
                          ? "bg-gray-900 hover:bg-gray-800 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {isCompleted ? "View Experience" : isLive ? "Join Session →" : "Join Session"}
                    </button>
                    {isCompleted && (
                      <button
                        onClick={goToResults}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                                   text-gray-700 hover:bg-gray-50 transition-colors text-center"
                      >
                        View Session Results
                      </button>
                    )}
                  </div>
                </div>

                {/* Quiz results card */}
                {isCompleted && experience?.quiz_score != null && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quiz Score</p>
                    <p className="text-5xl font-black text-gray-900 leading-none mb-1">
                      {experience.quiz_score}%
                    </p>
                    <button
                      onClick={goToResults}
                      className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mx-auto transition-colors mt-2"
                    >
                      View Details <ChevronRight />
                    </button>
                  </div>
                )}

                {/* Members card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UsersIcon />
                      <span className="text-sm font-semibold text-gray-900">Team Members</span>
                    </div>
                    {members.length > 0 && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {members.length}
                      </span>
                    )}
                  </div>

                  <div className="px-5 py-4">
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2">No members yet</p>
                    ) : (
                      <>
                        {/* Stacked avatar row */}
                        <div className="flex -space-x-2 mb-4">
                          {members.slice(0, 6).map((m, i) => (
                            <Avatar
                              key={m.id ?? i}
                              name={m.name ?? m.first_name ?? "?"}
                              color={avatarColors[i % avatarColors.length]}
                            />
                          ))}
                          {members.length > 6 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white">
                              +{members.length - 6}
                            </div>
                          )}
                        </div>

                        {/* Member name list */}
                        <div className="space-y-2">
                          {visibleMembers.map((m, i) => {
                            const name = m.name ?? (`${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "Member");
                            return (
                              <div key={m.id ?? i} className="flex items-center gap-2.5">
                                <Avatar
                                  name={name}
                                  color={avatarColors[i % avatarColors.length]}
                                  size="w-7 h-7"
                                />
                                <span className="text-sm text-gray-700 truncate">{name}</span>
                              </div>
                            );
                          })}
                          {!showAllMembers && hiddenCount > 0 && (
                            <button
                              onClick={() => setShowAllMembers(true)}
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors mt-1"
                            >
                              + {hiddenCount} more member{hiddenCount > 1 ? "s" : ""}
                            </button>
                          )}
                        </div>

                        {/* Chat button */}
                        <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl
                                           text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center">
                          <ChatBubble /> Chat with Team
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
