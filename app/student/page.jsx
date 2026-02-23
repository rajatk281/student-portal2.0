
import TopBar from '@/Components/Student/TopBar'
import DashboardContent from '@/Components/Student/DashboardContent'
import React from 'react'
import Sidebar from '@/Components/Student/Sidebar'

const page = () => {
  return (
    <div className='flex min-h-screen bg-[#0a0a0a] font-sans h-screen'>
      <Sidebar/>
      <div className='flex flex-col flex-1 min-w-0'>
        <TopBar/>
        <DashboardContent/>
      </div>
    </div>
  )
}

export default page