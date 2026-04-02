import React, { useState } from 'react';

// ── Small helpers ─────────────────────────────────────────────────────────────

function EngagementBadge({ level }) {
  const colours =
    level === 'high'
      ? 'bg-green-100 text-green-800'
      : level === 'medium'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${colours}`}>
      {level} Engagement
    </span>
  );
}

function SectionCard({ title, colour = 'blue', children }) {
  const bg = {
    blue: 'bg-blue-50',
    purple: 'bg-purple-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
  }[colour] || 'bg-gray-50';
  return (
    <div className={`${bg} p-4 rounded-lg`}>
      {title && <h4 className="font-semibold mb-2 text-gray-800">{title}</h4>}
      {children}
    </div>
  );
}

function BulletList({ items, colour }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-gray-700 text-sm">{item}</li>
      ))}
    </ul>
  );
}

// ── Agenda coverage pill ───────────────────────────────────────────────────────

function AgendaCoverageRow({ item }) {
  return (
    <div className="border rounded-lg p-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm text-gray-800">{item.agendaItem}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {item.timeSpent} / {item.plannedTime}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              item.covered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {item.covered ? 'Covered' : 'Not covered'}
          </span>
        </div>
      </div>
      {item.keyPoints && item.keyPoints.length > 0 && (
        <ul className="list-disc list-inside pl-1 space-y-0.5">
          {item.keyPoints.map((p, i) => (
            <li key={i} className="text-xs text-gray-600">{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Role renderers ─────────────────────────────────────────────────────────────

function ParticipantView({ summary }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Your Session Report</h3>
        <EngagementBadge level={summary.engagementLevel} />
      </div>

      <SectionCard title="Overall Summary" colour="blue">
        <p className="text-gray-700 text-sm">{summary.overallSummary}</p>
      </SectionCard>

      {/* Per-agenda contributions — NEW */}
      {summary.agendaContributions && summary.agendaContributions.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Your Contributions by Agenda Item</h4>
          <div className="space-y-2">
            {summary.agendaContributions.map((ac, idx) => (
              <div key={idx} className="border-l-4 border-blue-400 pl-3 py-1">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">
                  {ac.agendaItem}
                </p>
                <p className="text-sm text-gray-700">{ac.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.keyContributions && summary.keyContributions.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Key Contributions</h4>
          <BulletList items={summary.keyContributions} />
        </div>
      )}

      {summary.actionItems && summary.actionItems.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Your Action Items</h4>
          <ul className="space-y-2">
            {summary.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        {summary.speakingTime && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Speaking Time</p>
            <p className="font-semibold text-gray-800">{summary.speakingTime}</p>
          </div>
        )}
        {summary.questionsAsked !== undefined && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Questions Asked</p>
            <p className="font-semibold text-gray-800">{summary.questionsAsked}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CoachView({ summary, fullTranscript }) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold">Coach Report</h3>

      <SectionCard title="Overall Engagement" colour="purple">
        <p className="text-gray-700 text-sm">{summary.overallEngagement}</p>
      </SectionCard>

      {/* Agenda coverage — NEW */}
      {summary.agendaCoverage && summary.agendaCoverage.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Agenda Coverage</h4>
          <div className="space-y-2">
            {summary.agendaCoverage.map((item, idx) => (
              <AgendaCoverageRow key={idx} item={item} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-3 text-gray-800">Participant Insights</h4>
        <div className="space-y-3">
          {(summary.participantInsights || []).map((p, idx) => (
            <div key={idx} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{p.userName}</span>
                <EngagementBadge level={p.engagementLevel} />
              </div>
              <p className="text-xs text-gray-600">{p.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Key Takeaways</h4>
          <BulletList items={summary.keyTakeaways} />
        </div>
      )}

      {summary.areasOfConcern && summary.areasOfConcern.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-orange-700">Areas of Concern</h4>
          <BulletList items={summary.areasOfConcern} />
        </div>
      )}

      {summary.recommendations && summary.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Recommendations</h4>
          <BulletList items={summary.recommendations} />
        </div>
      )}

      {/* Full transcript accordion — coaches can review exact quotes */}
      {fullTranscript && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
          >
            <span>Full Session Transcript (speaker-labeled)</span>
            <span>{showTranscript ? '▲' : '▼'}</span>
          </button>
          {showTranscript && (
            <pre className="p-4 text-xs text-gray-600 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto bg-white">
              {fullTranscript}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function AdminView({ summary, fullTranscript }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const sm = summary.sessionMetrics || {};

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold">Admin Report</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Participants</p>
          <p className="text-2xl font-bold text-gray-800">{sm.totalParticipants}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Engagement</p>
          <p className="text-2xl font-bold text-gray-800 capitalize">{sm.averageEngagement}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-800">{sm.completionRate}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Technical Issues</p>
          <p className="text-2xl font-bold text-gray-800">
            {Array.isArray(sm.technicalIssues) ? sm.technicalIssues.length : 0}
          </p>
        </div>
      </div>

      {summary.agendaAdherence && (
        <SectionCard title="Agenda Adherence" colour="blue">
          <p className="text-sm text-gray-700">{summary.agendaAdherence}</p>
        </SectionCard>
      )}

      <div>
        <h4 className="font-semibold mb-2 text-gray-800">Facilitator Performance</h4>
        <p className="text-sm text-gray-700">{summary.facilitatorPerformance}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-gray-800">Content Effectiveness</h4>
        <p className="text-sm text-gray-700">{summary.contentEffectiveness}</p>
      </div>

      {summary.systemRecommendations && summary.systemRecommendations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">System Recommendations</h4>
          <BulletList items={summary.systemRecommendations} />
        </div>
      )}

      {summary.nextSteps && summary.nextSteps.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Next Steps</h4>
          <BulletList items={summary.nextSteps} />
        </div>
      )}

      {fullTranscript && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
          >
            <span>Full Session Transcript</span>
            <span>{showTranscript ? '▲' : '▼'}</span>
          </button>
          {showTranscript && (
            <pre className="p-4 text-xs text-gray-600 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto bg-white">
              {fullTranscript}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MeetingSummaryModal({
  summaries,
  onClose,
  userRole = 'participant',
  fullTranscript,
}) {
  if (!summaries) return null;

  const handleDownload = () => {
    const payload = { ...summaries, fullTranscript };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fireteam-session-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">Session Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {userRole === 'participant' && (
            <ParticipantView summary={summaries.participantSummary} />
          )}
          {userRole === 'coach' && (
            <CoachView
              summary={summaries.coachSummary}
              fullTranscript={fullTranscript}
            />
          )}
          {userRole === 'admin' && (
            <AdminView
              summary={summaries.adminSummary}
              fullTranscript={fullTranscript}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#003366] text-sm"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
