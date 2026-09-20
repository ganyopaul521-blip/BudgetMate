import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import accraSkyline from '../assets/images/accra-skyline.jpg'
import AIChatWidget from './AIChatWidget'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="bm-app relative flex min-h-screen overflow-hidden">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] overflow-hidden" aria-hidden="true">
      <img src={accraSkyline} alt="" className="absolute right-0 top-0 h-full w-full max-w-5xl object-cover object-[65%_30%] opacity-[0.85] dark:opacity-[0.65]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bm-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--bm-bg)]" />
    </div>
    <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)}/><div className="relative flex min-w-0 flex-1 flex-col"><Navbar onMenuClick={()=>setSidebarOpen(true)}/><main className="bm-main mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6 lg:px-8"><Outlet/></main></div><AIChatWidget/></div>
}
