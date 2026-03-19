"use client"
import React, { useState } from 'react'
import Sidebar from '@/Components/Student/Sidebar'
import TopBar from '@/Components/Student/TopBar'

export default function StudentLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className='flex min-h-screen bg-[#0a0a0a] font-sans h-screen' suppressHydrationWarning>
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-52'}`}>
        <TopBar isSidebarCollapsed={isCollapsed} />
        {children}
      </div>
    </div>
  );
} 

