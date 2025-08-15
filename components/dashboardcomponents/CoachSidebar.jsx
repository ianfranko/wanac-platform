"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ChatIcon from '@mui/icons-material/Chat';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { FaLayerGroup } from 'react-icons/fa';

const coachNavItems = [
  { name: 'Dashboard', href: '/coach', icon: <DashboardIcon fontSize="small" /> },
  { name: 'Sessions', href: '/coach/sessions', icon: <CalendarMonthIcon fontSize="small" /> },
  { name: 'Clients', href: '/coach/clients', icon: <PeopleIcon fontSize="small" /> },
  { name: 'Coaching Tips', href: '/coach/coachingtips', icon: <LightbulbIcon fontSize="small" /> },
  { name: 'Progress', href: '/coach/progress', icon: <BarChartIcon fontSize="small" /> },
  { name: 'Resources', href: '/coach/resources', icon: <MenuBookIcon fontSize="small" /> },
  { name: 'Course Management', href: '/coach/coursemanagement', icon: <MenuBookIcon fontSize="small" /> },
  { name: 'Units Management', href: '/coach/unitsmanagement', icon: <FaLayerGroup size={18} style={{ marginRight: 2, marginLeft: 1 }} /> },
  { name: 'Community', href: '/client/community', icon: <GroupsIcon fontSize="small" /> },
  { name: 'Feedback', href: '/coach/feedback', icon: <FeedbackIcon fontSize="small" /> },
  { name: 'Fireteam', href: '/coach/fireteam', icon: <ChatIcon fontSize="small" /> },
  { name: 'Messages', href: '/coach/messages', icon: <MailIcon fontSize="small" /> },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  // Load sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wanacCoachSidebarCollapsed');
      if (stored !== null) {
        setCollapsed(stored === 'true');
      }
    }
  }, []);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wanacCoachSidebarCollapsed', collapsed);
    }
  }, [collapsed]);

  // Determine if sidebar should be open
  const isOpen = !collapsed || (collapsed && hovered);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wanacUser');
      localStorage.removeItem('auth_token');
    }
    router.push('/login');
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ${isOpen ? 'w-56' : 'w-16'}`}
      onMouseEnter={() => { if (collapsed) setHovered(true); }}
      onMouseLeave={() => { if (collapsed) setHovered(false); }}
    >
      <div className={`p-3 ${isOpen ? '' : 'justify-center flex'}`}>
        {isOpen ? <h1 className="text-base font-semibold text-gray-800">WANAC COACH</h1> : <span className="sr-only">WANAC COACH</span>}
      </div>
      <nav className="flex-1 p-1 space-y-1">
        {coachNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-all \
              ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${isOpen ? '' : 'justify-center'}`}
          >
            {item.icon}
            {isOpen ? item.name : null}
          </Link>
        ))}
      </nav>
      {/* Toggle button below nav items */}
      <div className={`flex justify-${isOpen ? 'end' : 'center'} px-2 pb-2`}>
        <button
          className="bg-blue-500 text-white rounded-full p-1 shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-1"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {isOpen ? <ChatIcon fontSize="small" /> : <BarChartIcon fontSize="small" />}
          {/* Material UI pin icon to indicate pinned state */}
          {!collapsed ? <PushPinIcon style={{ fontSize: 16 }} /> : <PushPinOutlinedIcon style={{ fontSize: 16 }} />}
        </button>
      </div>
      <div className="p-2 border-t flex flex-col gap-1">
        <button className={`flex items-center gap-2 px-2 py-2 text-xs text-gray-600 hover:bg-gray-100 w-full rounded-md ${isOpen ? '' : 'justify-center'}`}
          onClick={handleLogout}
        >
          <LogoutIcon fontSize="small" />
          {isOpen && 'Log Out'}
        </button>
      </div>
    </aside>
  );
} 