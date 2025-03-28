// src/components/CommunitySnapshot.jsx
export default function CommunitySnapshot() {
    return (
      <section className="py-16 px-6 text-center bg-brand-navy text-white">
        <h2 className="text-3xl font-semibold mb-4 animate-fade-in">Community Snapshot</h2>
        <p className="max-w-xl mx-auto mb-6 text-white/80 animate-fade-in delay-100">
          Join 2,300+ veterans already building growth, accountability and friendships inside WANAC.
        </p>
        <div className="flex justify-center gap-4 text-sm animate-fade-in delay-200">
          <div className="bg-white text-brand-navy px-4 py-2 rounded-lg shadow">✅ Weekly Forums</div>
          <div className="bg-white text-brand-navy px-4 py-2 rounded-lg shadow">🎙️ Live Events</div>
          <div className="bg-white text-brand-navy px-4 py-2 rounded-lg shadow">💬 Tier-Based Chat</div>
        </div>
      </section>
    );
  }
  