import Sidebar from '@/Components/Student/Sidebar'
import TopBar from '@/Components/Student/TopBar'

export const metadata = {
  title: "Student Portal",
  description: "Student Portal Dashboard",
};

export default function StudentLayout({ children }) {
  return (
    <div className='flex min-h-screen bg-[#0a0a0a] font-sans h-screen'>
      <Sidebar />
      <div className='flex flex-col flex-1 min-w-0'>
        <TopBar />
        {children}
      </div>
    </div>
  );
}
