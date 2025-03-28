import Link from "next/link";

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-brand-navy mb-4">About WANAC</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        WANAC (Warrior Ascension Network and Coaching) is a veteran-founded platform committed to transforming the post-service journey of military veterans through structured coaching, intelligent technology, and a vibrant support community.
      </p>

      <p className="text-gray-700 mb-6">
        Launched by U.S. veteran <strong>Clarence Narcisse</strong> and developed by a global team led by <strong>Ian Odundo</strong>, WANAC equips veterans with the tools they need to thrive. From <Link href="/coaching-programs" className="text-brand-navy underline">structured coaching programs</Link> and <Link href="/life-score" className="text-brand-navy underline">life score assessments</Link> to AI-driven journaling and an Eisenhower Matrix-powered <Link href="/task-manager" className="text-brand-navy underline">task manager</Link>, we guide users through a full-circle growth journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h2 className="text-xl font-semibold text-brand-navy mb-2">Who We Are</h2>
          <ul className="list-disc ml-5 text-gray-600 space-y-1">
            <li><Link href="/our-story" className="hover:underline">Our Story</Link></li>
            <li><Link href="/leadership" className="hover:underline">Executive Leadership Team</Link></li>
            <li><Link href="/board" className="hover:underline">Board of Directors</Link></li>
            <li><Link href="/advisory-board" className="hover:underline">Veteran Advisory Board</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-brand-navy mb-2">What We Offer</h2>
          <ul className="list-disc ml-5 text-gray-600 space-y-1">
            <li><Link href="/coaching-programs" className="hover:underline">AI-enhanced Coaching Programs</Link></li>
            <li><Link href="/life-score" className="hover:underline">Veteran Life Score Assessments</Link></li>
            <li><Link href="/task-manager" className="hover:underline">Task & Goal Management Tools</Link></li>
            <li><Link href="/community" className="hover:underline">Community, Events & Support Resources</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <Link href="/book-session">
          <button className="bg-brand-navy text-white py-3 px-6 rounded-2xl shadow hover:bg-brand-navy/90 transition">
            Book a Coaching Session
          </button>
        </Link>
        <Link href="/free-strategy-session" className="text-brand-navy underline text-sm text-center">
          Or claim your Free Strategy Session →
        </Link>
      </div>

      <div className="mt-10 text-gray-600">
        <p className="italic">
          “Veterans don’t need to walk the transition alone. At WANAC, we turn challenges into chapters of growth.”
        </p>
      </div>
    </div>
  );
}
