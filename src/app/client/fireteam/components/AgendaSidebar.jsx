import React, { useState } from "react";

export default function AgendaSidebar({ agenda, moduleTitle, moduleDescription, peers = [], onStepClick, currentStep }) {
  const [activeTab, setActiveTab] = useState("Agenda");
  const [showPeersModal, setShowPeersModal] = useState(false);
  const tabs = ["Peers", "Exhibits", "Chat", "Agenda"];

  return (
    <aside className="w-80 border-l p-6 overflow-y-auto">
      <div className="flex justify-between mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`text-sm font-semibold px-2 ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Agenda" && (
        <>
          {/* Module Title */}
          <div className="mb-4">
            <h3 className="font-semibold">{moduleTitle}</h3>
            <p className="text-xs text-gray-500">{moduleDescription}</p>
          </div>
          <ul className="space-y-2 text-sm text-gray-800">
            {agenda.map(([label, time], i) => (
              <li
                key={i}
                className={`flex justify-between items-center cursor-pointer rounded px-2 py-1 ${currentStep === i ? "bg-yellow-200 font-bold" : "hover:bg-yellow-100"}`}
                onClick={onStepClick ? () => onStepClick(i) : undefined}
              >
                <div className="flex items-center gap-2">
                  {/* <span className="w-2 h-2 bg-gray-400 rounded-full"></span> */}
                  <span>{label}</span>
                </div>
                <span className="text-xs text-gray-500">{time}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {activeTab === "Peers" && (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">Peers ({peers.length})</span>
            {peers.length > 0 && (
              <button
                className="text-xs px-2 py-1 border rounded hover:bg-gray-200"
                onClick={() => setShowPeersModal(true)}
              >
                Expand
              </button>
            )}
          </div>
          {peers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No participants yet</p>
              <p className="text-xs mt-2">Waiting for others to join...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {peers.map((peer, idx) => (
                <div
                  key={peer.id || peer.name || idx}
                  className={`flex flex-col items-center rounded-xl bg-gray-100 p-2 shadow-sm border-2 ${
                    peer.speaking ? "border-green-400" : "border-transparent"
                  }`}
                >
                  {/* Avatar or fallback */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 mb-2 flex items-center justify-center">
                    {peer.avatarUrl ? (
                      <img src={peer.avatarUrl} alt={peer.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {peer.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow text-xs">
                    <span className="inline-block">
                      <svg width="16" height="16" fill="currentColor" className="text-black"><path d="M12 7V5a4 4 0 1 0-8 0v2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2v1a3 3 0 0 0 6 0v-1h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-6-2a2 2 0 1 1 4 0v2H6V5zm4 8a1 1 0 0 1-2 0v-1h2v1zm3-3a1 1 0 0 1-1 1h-1V8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1z"/></svg>
                    </span>
                    <span className="truncate max-w-[80px]">{peer.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Modal for expanded peers view */}
          {showPeersModal && peers.length > 0 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
                  onClick={() => setShowPeersModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Peers ({peers.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {peers.map((peer, idx) => (
                    <div
                      key={peer.id || peer.name || idx}
                      className={`flex flex-col items-center rounded-xl bg-gray-100 p-4 shadow-sm border-2 ${
                        peer.speaking ? "border-green-400" : "border-transparent"
                      }`}
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 mb-2 flex items-center justify-center">
                        {peer.avatarUrl ? (
                          <img src={peer.avatarUrl} alt={peer.name} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-white text-3xl font-bold">
                            {peer.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow text-sm">
                        <span className="inline-block">
                          <svg width="16" height="16" fill="currentColor" className="text-black"><path d="M12 7V5a4 4 0 1 0-8 0v2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2v1a3 3 0 0 0 6 0v-1h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-6-2a2 2 0 1 1 4 0v2H6V5zm4 8a1 1 0 0 1-2 0v-1h2v1zm3-3a1 1 0 0 1-1 1h-1V8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1z"/></svg>
                        </span>
                        <span className="truncate max-w-[100px]">{peer.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === "Exhibits" && (
        <div className="text-center text-gray-500">Exhibits content goes here</div>
      )}
      {activeTab === "Chat" && (
        <div className="text-center text-gray-500">Chat content goes here</div>
      )}
    </aside>
  );
}