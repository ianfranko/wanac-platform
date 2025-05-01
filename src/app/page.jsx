// WANAC Coaching Platform - Home Page
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import GuidedBoardingIntro from '../../components/GuidedBoardingIntro';
import LifeScorePreview from '../../components/LifeScorePreview';
import AIAssistantDemo from '../../components/AIAssistantDemo';
import SessionBookingPreview from '../../components/SessionBookingPreview';
import CommunitySnapshot from '../../components/CommunitySnapshot';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Head>
        <title>WANAC Coaching Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 text-center bg-[#002147] text-white py-24">

        <h1 className="text-5xl font-extrabold max-w-3xl leading-tight uppercase tracking-wide text-heading">
        Empowering Service Members and Veterans through couching and community support
        </h1>
        <p className="text-lg mt-4 max-w-xl text-white">
        Personalised coaching, AI tools and community to help you thrive after Service.
        </p>
        <div className="mt-6 space-x-4">
          <Link href="/signup" className="bg-accent text-white px-6 py-3 rounded-md font-semibold uppercase tracking-wide hover:bg-hover transition-all">
            Get Started
          </Link>
          <Link href="/donate" className="border-2 border-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-background transition-all">
            Log In
          </Link>
        </div>
      </section>

      {/* How We Help */}
      <section id="how-we-help" className="py-20 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold mb-12 uppercase text-[#002147]">How We Help</h2>
      <div className="grid md:grid-cols-3 text-white gap-6 max-w-6xl mx-auto">
  {[{
    title: 'Transition Coaching',
    desc: 'Helping veterans navigate life after service with clarity and confidence.'
  }, {
    title: 'Performance Coaching',
    desc: 'Equipping veterans to thrive personally and professionally.'
  }, {
    title: 'Coaching Academy',
    desc: 'Training veterans to become certified coaches and mentors.'
  }].map(({ title, desc }) => (
    <div key={title} className="bg-[#002147] text-foreground shadow-md rounded-xl p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2 text-heading">{title}</h3>
      <p className="text-foreground/70">{desc}</p>
    </div>
  ))}
</div>

      </section>

      <section className="py-20 px-6 bg-[#002147] text-white">
  <div className="max-w-7xl mx-auto text-center">
    {/* Section Title */}
    <h2 className="text-3xl font-semibold mb-8">Key Features of Our Web App</h2>
    <p className="text-lg mb-12">Discover the powerful features that make our web app the best choice for your needs.</p>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
      {/* Feature 1 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="mb-6">
          <img src="/icons/session-booking.svg" alt="Session Booking" className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Session Booking</h3>
        <p className="text-lg text-gray-700">Easily book your sessions with a simple, intuitive interface that guarantees a smooth user experience.</p>
      </div>

      {/* Feature 2 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="mb-6">
          <img src="/icons/ai-assistant.svg" alt="AI Assistant" className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">AI Assistant</h3>
        <p className="text-lg text-gray-700">Get personalized assistance with our AI-driven assistant, designed to streamline your tasks and improve productivity.</p>
      </div>

      {/* Feature 3 */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="mb-6">
          <img src="/icons/real-time-updates.svg" alt="Real-Time Updates" className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Real-Time Updates</h3>
        <p className="text-lg text-gray-700">Stay informed with real-time notifications and updates, ensuring you're always in the loop.</p>
      </div>
    </div>
  </div>
</section>

      {/* Community and Testimonial */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <CommunitySnapshot />
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4 text-heading">Veteran Voices</h2>
            <blockquote className="italic text-foreground">
              “WANAC helped me rediscover my strength and purpose after leaving the military.”
              <footer className="mt-4 font-semibold">— U.S. Army Veteran</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section id="community" className="bg-background text-white text-center py-20 px-6">
  <h2 className="text-4xl font-bold mb-4 uppercase">Join Our Community</h2>
  <p className="mb-6 max-w-2xl mx-auto">
    Discover upcoming events, connect with fellow veterans, and make an impact.
  </p>
  <div className="flex justify-center gap-4">
    <Link href="/signup" className="bg-accent text-white px-6 py-3 rounded font-semibold hover:bg-hover transition-all">
      Sign Up
    </Link>
    <Link href="/donate" className="bg-white text-[#002147] text-heading px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-all">
      Donate
    </Link>
  </div>
</section>


      {/* Final Section */}
      <section className="py-20 px-6 text-center bg-[#002147]">
        <h2 className="text-3xl font-bold mb-6 uppercase text-[white] text-heading">Manage Your Experience</h2>
        <ul className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left text-[white] font-medium">
          <li>Update your coaching preferences</li>
          <li>Manage subscriptions and sessions</li>
          <li>Control notification settings</li>
        </ul>
      </section>
    </div>
  );
}
