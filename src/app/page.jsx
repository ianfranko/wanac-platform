import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>WANAC Coaching Platform</title>
        <meta name="description" content="Empowering veterans with structured coaching and AI insights." />
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-50 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Empowering Veterans Through Coaching</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Transition with confidence. Get the support, coaching, and AI-powered tools to thrive beyond service.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">Get Started</button>
          </Link>
          <Link href="/resources">
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition">Learn More</button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          WANAC is a veteran-focused coaching platform designed to provide structured programs, coaching support, and AI-powered life tools.
        </p>
      </section>

      {/* Programs Section */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">Our Programs</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Phase 1: Promise Land Transition",
              desc: "Navigate civilian life with clarity and purpose.",
            },
            {
              title: "Phase 2: High Performance Coaching",
              desc: "One-on-one sessions backed by life score metrics.",
            },
            {
              title: "Phase 3: Coaching Business Academy",
              desc: "Become a certified coach and build a career helping others.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-6">Veteran Voices</h2>
        <blockquote className="italic text-gray-700 max-w-2xl mx-auto">
          “WANAC gave me clarity, purpose, and a path forward. This platform changed my life.”
        </blockquote>
        <p className="mt-4 font-semibold">— Marine Corps Veteran</p>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-100 py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Take the First Step?</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">Book Free Session</button>
          </Link>
          <Link href="/take-action">
            <button className="border border-green-600 text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition">Volunteer / Donate</button>
          </Link>
        </div>
      </section>
    </>
  );
}
