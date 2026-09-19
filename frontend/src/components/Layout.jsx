import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AIChatWidget from './AIChatWidget'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="bm-app flex min-h-screen"><Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)}/><div className="flex min-w-0 flex-1 flex-col"><Navbar onMenuClick={()=>setSidebarOpen(true)}/><main className="bm-main mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6 lg:px-8"><Outlet/></main></div><AIChatWidget/></div>
}
