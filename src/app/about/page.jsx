import React from "react";

const OurStory = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className=" text-white py-10 text-center">
        <h1 className="text-4xl text-[#002147] font-bold">Our Story</h1>
      </header>

      {/* Main Content */}
<main className="px-6 md:px-16 py-10 space-y-12">
  {/* Intro Section */}
  <section className="bg-gray-50 p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
      About Warrior Rising
    </h2>
    <p className="mb-4 text-gray-700 text-lg leading-relaxed">
      <span className="font-semibold">Founded in 2015</span>, Warrior Rising is a 
      <span className="text-blue-600 font-medium"> nonprofit started by Veterans, for Veterans</span>. 
      Our mission is simple but powerful: 
      <span className="italic">transform Veterans into Vetrepreneurs</span>—veteran entrepreneurs.
    </p>
    <p className="text-gray-700 text-lg leading-relaxed">
      What began as a local initiative has now 
      <span className="font-semibold text-blue-600"> grown into a nationally recognized organization</span>, 
      helping veterans transition from the 
      <span className="italic">battlefield to the boardroom</span>.
    </p>
  </section>

        {/* Origins Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Origins</h2>
          <p className="italic mb-2">Warrior Rising is a Family</p>
          <p>
            Our mission began with the belief that Veterans are uniquely equipped to succeed in
            entrepreneurship. We empower them by sharing stories of resilience, purpose, and
            leadership.
          </p>
        </section>

        {/* Founder Section */}
        <section className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://www.warriorrising.org/wp-content/uploads/2020/01/Jason-Van-Camp.jpg"
            alt="Jason B.A. Van Camp, Founder of Warrior Rising"
            className="w-64 rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-1">Our Founder</h2>
            <h3 className="text-lg font-medium mb-3">Jason B.A. Van Camp</h3>
            <p className="mb-2">
              Jason B.A. Van Camp is a decorated U.S. Special Forces Officer (Green Beret), West
              Point graduate, and seasoned business leader. His leadership inspired the founding of
              Warrior Rising as a platform to uplift his fellow veterans.
            </p>
            <a
              href="https://www.warriorrising.org/our-story/"
              className="text-blue-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              Read Founder’s Full Bio
            </a>
          </div>
        </section>

        {/* Decade Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Celebrating a Decade</h2>
          <p>
            After 10 years of impact, Warrior Rising continues to support military veterans in their
            journeys toward becoming business leaders. We've built a community where purpose meets
            opportunity.
          </p>
        </section>

        {/* Donate Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Empowering Veterans</h2>
          <p className="mb-2">
            We believe in equipping Veterans with the tools, knowledge, and mentorship needed to
            thrive in the business world.
          </p>
          <a
            href="https://www.warriorrising.org/donate/"
            className="inline-block bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            target="_blank"
            rel="noreferrer"
          >
            Donate Today
          </a>
        </section>
      </main>

  
    </div>
  );
};

export default OurStory;
