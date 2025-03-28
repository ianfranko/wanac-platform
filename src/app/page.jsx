// src/pages/index.jsx
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-brand-white text-brand-navy">
      <Head>
        <title>WANAC Coaching Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center px-6 text-center bg-brand-navy text-white">
        <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
          Empowering Veterans Through Coaching and Community Support
        </h1>
        <p className="text-lg mt-4 max-w-xl">
          Personalized coaching, smart AI tools, and an empowering community to help you thrive after service.
        </p>
        <div className="mt-6 space-x-4">
          <Link href="/signup" className="bg-brand-orange px-6 py-3 rounded-xl text-white font-semibold hover:bg-orange-500">
            Free Strategy Session
          </Link>
          <Link href="/donate" className="border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-brand-navy transition">
            Donate
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-semibold mb-6">About Us</h2>
        <p className="max-w-2xl mx-auto mb-4 text-gray-700">
          WANAC is a veteran-led coaching platform dedicated to helping military personnel transition with purpose, confidence, and community.
        </p>
        <ul className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left text-gray-700">
          <li>Our Story</li>
          <li>Board of Directors</li>
          <li>Advisory Board</li>
          <li>Veteran Advisory Board</li>
          <li>Executive Staff</li>
        </ul>
      </section>

      {/* How We Help */}
      <section id="how-we-help" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">How We Help</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: 'Phase 1',
              desc: 'Promise Land Transition Coaching Program'
            },
            {
              title: 'Phase 2',
              desc: 'High Performance Coaching Sessions'
            },
            {
              title: 'Phase 3',
              desc: 'Coaching Business Academy for Veterans'
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white shadow rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Take Action */}
      <section id="take-action" className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-6">Get Involved</h2>
        <ul className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left text-gray-700">
          <li>Volunteer</li>
          <li>Corporate Partnerships</li>
          <li>Leadership Giving</li>
          <li>Ways to Support</li>
        </ul>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-6">Veteran Voices</h2>
        <blockquote className="max-w-xl mx-auto italic text-gray-800">
          “WANAC helped me rediscover my strength and purpose after leaving the military. The coaching was transformative.”
          <footer className="mt-4 font-semibold">— U.S. Army Veteran</footer>
        </blockquote>
      </section>

      {/* Resources */}
      <section id="resources" className="py-16 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold mb-6">Explore Resources</h2>
        <ul className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left text-gray-700">
          <li>Free Workshops</li>
          <li>Guides</li>
          <li>Blog</li>
          <li>Help Center</li>
        </ul>
      </section>

      {/* Dashboards Overview */}
      <section id="dashboards" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Platform Features</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
          <div>
            <h3 className="text-xl font-bold mb-2">Client Dashboard</h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>AI-Powered Life Scores</li>
              <li>Coaching Session Tracking</li>
              <li>Task Management (Eisenhower Matrix)</li>
              <li>Session Notes, Scheduling, Journaling</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Coach Dashboard</h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Next Session Prep + AI Summary</li>
              <li>Calendar Integration</li>
              <li>Resource Library</li>
              <li>Client Progress Insights</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-16 px-6 bg-brand-navy text-white text-center">
        <h2 className="text-3xl font-semibold mb-6">Community</h2>
        <ul className="list-none space-y-2">
          <li>Veteran Forum & Tier-Based Chatrooms</li>
          <li>RSVP & Host Events</li>
        </ul>
      </section>

      {/* AI Assistant */}
      <section id="ai-assistant" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">AI Assistant</h2>
        <p className="max-w-xl mx-auto text-gray-700">
          Our Smart Concierge AI helps you stay focused and organized — available based on your membership tier.
        </p>
      </section>

      {/* Account Settings */}
      <section id="account-settings" className="py-16 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold mb-4">Account Settings</h2>
        <ul className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left text-gray-700">
          <li>Update Profile</li>
          <li>Manage Subscriptions</li>
          <li>Notification Preferences</li>
        </ul>
      </section>
    </div>
  );
}
