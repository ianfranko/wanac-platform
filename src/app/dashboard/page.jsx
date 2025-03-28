// Code for the Dashboard page
import Link from 'next/link';
import { FaUser, FaHome, FaCalendarCheck, FaEnvelope, FaBook, FaComments, FaCog, FaBrain, FaPenFancy, FaUsers } from 'react-icons/fa';

export default function Dashboard() {
  return (
    <section className="min-h-screen bg-[#f9f9f9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl py-8 px-6">
        <div className="flex flex-col items-start space-y-6">
          <div className="flex items-center gap-3">
            <FaUser className="text-brand-navy text-lg" />
            <span className="font-semibold text-brand-navy">Clarence</span>
          </div>

          <Link href="/minutes" className="flex items-center gap-3 text-brand-navy hover:font-bold cursor-pointer">
            <FaHome /> <span>Minutes</span>
          </Link>

          <Link href="/discover" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaHome /> <span>Discover</span>
          </Link>

          <Link href="/bookings" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaCalendarCheck /> <span>Bookings</span>
          </Link>

          <Link href="/messages" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaEnvelope /> <span>Messages</span>
          </Link>

          <Link href="/library" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaBook /> <span>Library</span>
          </Link>

          <Link href="/ai-chatbot" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaBrain /> <span>AI Chatbot</span>
          </Link>

          <Link href="/journal" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaPenFancy /> <span>Journal</span>
          </Link>

          <Link href="/community" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaUsers /> <span>Community</span>
          </Link>

          <Link href="/life-score" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaBrain /> <span>Life Scores</span>
          </Link>

          <Link href="/settings" className="flex items-center gap-3 text-gray-700 hover:text-brand-navy hover:font-bold cursor-pointer">
            <FaCog /> <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-navy mb-8">Welcome to your Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Life Score Snapshot */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-brand-navy mb-2">Life Score</h2>
              <p className="text-gray-600 text-sm">Your latest assessment results.</p>
              <div className="mt-4 text-sm text-gray-700 space-y-2">
                <p>🧠 Mental & Emotional: 7/10</p>
                <p>⚡ Energy: 4/5</p>
                <p>🎯 Mission: 6/10</p>
              </div>
              <button className="mt-4 text-brand-orange hover:underline">Take Assessment</button>
            </div>

            {/* Next Coaching Session */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-brand-navy mb-2">Next Coaching Session</h2>
              <p className="text-gray-600 text-sm">Scheduled for: Apr 3, 2025 – 10:00AM</p>
              <button className="mt-4 bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
                View Details
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-brand-navy mb-2">Quick Actions</h2>
              <ul className="space-y-2 text-sm text-brand-navy">
                <li className="hover:underline cursor-pointer">Take Life Score Assessment</li>
                <li className="hover:underline cursor-pointer">Book New Session</li>
                <li className="hover:underline cursor-pointer">Write Journal Entry</li>
              </ul>
            </div>

            {/* Eisenhower Matrix Summary */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-brand-navy mb-2">Task Overview</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded bg-red-100">Q1: Do Now – 3</div>
                <div className="p-3 rounded bg-blue-100">Q2: Schedule – 5</div>
                <div className="p-3 rounded bg-green-100">Q3: Delegate – 2</div>
                <div className="p-3 rounded bg-yellow-100">Q4: Delete – 1</div>
              </div>
              <button className="mt-4 bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
                Open Matrix
              </button>
            </div>

            {/* Journal Widget */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-brand-navy mb-2">Today’s Journal</h2>
              <p className="text-gray-600 text-sm mb-2">Morning Mindset Entry Available</p>
              <button className="bg-brand-navy text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                Write Now
              </button>
            </div>

            {/* AI Insight of the Day */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-brand-navy mb-2">AI Insight of the Day</h2>
              <p className="italic text-gray-700">
                "Today, prioritize clarity over chaos. A clear mind moves faster."
              </p>
              <button className="mt-3 text-sm text-brand-orange hover:underline">See Full Insight</button>
            </div>
          </div>

          {/* Additional section */}
          <div className="mt-10 bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold text-brand-navy mb-4">Your Progress</h2>
            <div className="h-40 bg-[#dad9d9] rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    </section>
  );
}
