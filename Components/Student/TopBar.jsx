"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import ProfileSidebar from "./ProfileSidebar";

export default function TopBar({ isSidebarCollapsed }) {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className={`flex fixed top-0 right-0 items-start justify-between px-8 pt-5 pb-4 transition-all duration-300 z-40 ${isSidebarCollapsed ? 'left-20' : 'left-52'}`}>
        {/* Left: greeting */}
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name?.split(' ')[0] || "Student"}.
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

          {/* Profile Clickable Area */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 hover:bg-white/5 p-1 px-2 rounded-xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-semibold leading-tight">
                {session?.user?.name || "Loading..."}
              </p>
              <p className="text-white/40 text-xs uppercase tracking-tighter">Student</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
              {session?.user?.image ? (
                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>
      </header>

      <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
