'use client';

import { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaPenFancy,
  FaRobot,
  FaChartLine,
  FaUsers,
} from 'react-icons/fa';
import Sidebar from '../../../../../components/dashboardcomponents/sidebar'
import ClientTopbar from '../../../../../components/dashboardcomponents/clienttopbar';

// Simple Notifications Widget
function NotificationsWidget() {
  // Mock notifications
  const notifications = [
    { id: 1, text: 'Your session with Coach Smith is tomorrow at 10:00 AM.' },
    { id: 2, text: 'New message from Coach Smith.' },
    { id: 3, text: 'Community event: Virtual coffee meetup this Friday.' },
  ];
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <h3 className="text-lg font-semibold text-brand-navy mb-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" /> Notifications
      </h3>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n.id} className="text-sm text-gray-700 border-b pb-2 last:border-0 last:pb-0">{n.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ClientDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      date: '2024-03-25',
      time: '10:00 AM',
      coach: 'Coach Smith',
      type: 'One-on-One Session',
    },
    {
      id: 2,
      date: '2024-03-27',
      time: '2:00 PM',
      coach: 'Coach Smith',
      type: 'Goal Review',
    },
  ]);

  const [lifeScore, setLifeScore] = useState({
    career: 7,
    relationships: 8,
    health: 6,
    finances: 5,
    personal: 7,
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  return (
    <div
      className="h-screen flex bg-white font-body text-foreground"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Sidebar */}
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-2 md:px-8 py-6 bg-muted">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 space-y-8">
                {/* Welcome Section */}
                <section className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md animate-fadeIn">
                  <div>
                    <h2
                      className="text-2xl md:text-3xl font-bold mb-1 tracking-tight text-heading"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Welcome Back{user?.name ? `, ${user.name}` : ''}!
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg">Your coaching journey starts here.</p>
                  </div>
                  <img
                    src="/dashboard-illustration.svg"
                    alt="Dashboard"
                    className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block drop-shadow-lg"
                  />
                </section>

                {/* Quick Actions Row */}
                <section className="flex flex-col md:flex-row gap-4">
                  <QuickActionCard
                    icon={FaCalendar}
                    title="Schedule Session"
                    description="Book your next coaching session"
                    href="/pages/client/session"
                    color="primary"
                  />
                  <QuickActionCard
                    icon={FaPenFancy}
                    title="New Journal Entry"
                    description="Record your thoughts and progress"
                    href="/pages/client/journal"
                    color="secondary"
                  />
                  <QuickActionCard
                    icon={FaRobot}
                    title="AI Assistant"
                    description="Get instant guidance and support"
                    href="/pages/client/aichatbot"
                    color="accent"
                  />
                  <QuickActionCard
                    icon={FaChartLine}
                    title="Track Progress"
                    description="View your life score metrics"
                    href="/pages/client/lifescore"
                    color="warning"
                  />
                  <QuickActionCard
                    icon={FaUsers}
                    title="Breakout Room"
                    description="Group discussion and collaboration"
                    href="/pages/client/breakoutroom"
                    color="primary"
                  />
                </section>

                {/* Content Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Upcoming Sessions */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md animate-fadeIn">
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center gap-2 text-heading"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      <FaCalendar className="text-primary" />
                      Upcoming Sessions
                    </h3>
                    <div className="space-y-4">
                      {upcomingSessions.length === 0 ? (
                        <p className="text-gray-500 text-sm">No sessions scheduled yet.</p>
                      ) : (
                        upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-gray-800">{session.type}</p>
                                <p className="text-sm text-gray-600">with {session.coach}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-800">{session.date}</p>
                                <p className="text-sm text-gray-600">{session.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button className="mt-4 text-primary hover:underline text-sm font-medium transition-colors duration-150">
                      View All Sessions →
                    </button>
                  </div>

                  {/* Life Score */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md animate-fadeIn">
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center gap-2 text-warning"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      <FaChartLine className="text-warning" />
                      Life Score Overview
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(lifeScore).map(([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between">
                            <span className="capitalize font-medium text-gray-700">{category}</span>
                            <span className="text-gray-600">{score}/10</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-warning rounded-full transition-all duration-300"
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 text-warning hover:underline text-sm font-medium transition-colors duration-150">
                      View Detailed Analysis →
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Quick Action Card
function QuickActionCard({ icon: Icon, title, description, href, color }) {
  // Use brand color classes from Tailwind config
  const colorClasses = {
    primary: 'bg-[#002147]/10 text-[#002147] border-[#002147]/20 hover:bg-[#002147]/20',
    secondary: 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200',
    accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
  };

  return (
    <a
      href={href}
      className={`flex-1 min-w-[160px] p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex flex-col items-start gap-2 ${colorClasses[color]}`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <Icon className="text-2xl mb-1" />
      <h3 className="text-base font-semibold mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
      <p className="text-xs opacity-80">{description}</p>
    </a>
  );
}
