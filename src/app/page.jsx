// src/pages/index.jsx
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import GuidedBoardingIntro from '../../components/GuidedBoardingIntro';
import LifeScorePreview from '../../components/LifeScorePreview';
import AIAssistantDemo from '../../components/AIAssistantDemo';
import SessionBookingPreview from '../../components/SessionBookingPreview';
import CommunitySnapshot from '../../components/CommunitySnapshot';
import { motion } from "framer-motion"; 



export default function Home() {
  return (
    <div className="bg-brand-white text-brand-navy">
      <Head>
        <title>WANAC Coaching Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center px-6 text-center bg-brand-navy text-white transition-opacity duration-1000 ease-in-out animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
          Empowering Veterans Through Coaching and Community Support
        </h1>
        <p className="text-lg mt-4 max-w-xl">
          Personalized coaching, smart AI tools, and an empowering community to help you thrive after service.
        </p>
        <div className="mt-6 space-x-4">
          <Link href="/signup" className="bg-brand-orange px-6 py-3 rounded-xl text-white font-semibold hover:bg-orange-500 transition-all">
            Free Strategy Session
          </Link>
          <Link href="/donate" className="border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-brand-navy transition-all">
            Donate
          </Link>
        </div>
      </section>

      {/* Guided Boarding Intro + Life Score Preview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-16">
        <GuidedBoardingIntro />
        <LifeScorePreview />
      </section>

      {/* How We Help */}
      <section id="how-we-help" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">How We Help</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[{
            title: 'Phase 1',
            desc: 'Promise Land Transition Coaching Program'
          }, {
            title: 'Phase 2',
            desc: 'High Performance Coaching Sessions'
          }, {
            title: 'Phase 3',
            desc: 'Coaching Business Academy for Veterans'
          }].map(({ title, desc }) => (
            <div key={title} className="bg-white shadow rounded-xl p-6 transition-transform transform hover:scale-105 duration-300">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Session Booking Preview + AI Assistant Demo */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-16">
        <SessionBookingPreview />
        <AIAssistantDemo />
      </section>

      {/* Community Snapshot + Testimonials */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-16">
        <CommunitySnapshot />
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Veteran Voices</h2>
          <blockquote className="italic text-gray-800">
            “WANAC helped me rediscover my strength and purpose after leaving the military. The coaching was transformative.”
            <footer className="mt-4 font-semibold">— U.S. Army Veteran</footer>
          </blockquote>
        </div>
      </section>

    {/* Community CTA Section */}
<section id="community" className="px-6 py-16 bg-[#f9f9f9]">
    <h2 className="text-3xl font-semibold mb-4">Join Our Community of Veterans</h2>
    <p className="mb-6 text-sm text-gray-200">
      Support our mission to empower veterans through coaching, resources, and community engagement.
    </p>
    
    <div className="flex justify-center space-x-4">
      <button className="bg-white text-brand-navy font-medium px-5 py-2 rounded-full hover:bg-gray-200 transition">
        Sign Up
      </button>
      <button className="bg-white text-brand-navy font-medium px-5 py-2 rounded-full hover:bg-gray-200 transition">
        Donate
      </button>
    </div>
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
