import React from "react";

export default function TopBar({ isSidebarCollapsed }) {
  return (
    <header className={`flex fixed top-0 right-0 items-start justify-between px-8 pt-5 pb-4 transition-all duration-300 z-40 ${isSidebarCollapsed ? 'left-20' : 'left-52'}`}>
      {/* Left: greeting */}
      <div>
        <h1 className="text-white text-3xl font-bold tracking-tight">
          Welcome back, Rajat.
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Your academic performance is trending 4% higher this month.
        </p>
      </div>

      {/* Right: icons + profile */}
      <div className="flex items-center gap-4 mt-1">
        {/* Chat icon */}
        <button className="text-white/40 hover:text-white/80 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Friends icon */}
        <button className="text-white/40 hover:text-white/80 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Notification icon */}
        <button className="text-white/40 hover:text-white/80 transition-colors relative">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white text-sm font-semibold leading-tight">Rajat Kapoor</p>
            <p className="text-white/40 text-xs">PHD CANDIDATE</p>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20">
            <img
              src="https://i.pravatar.cc/40?img=11"
              alt="Rajat Kapoor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
