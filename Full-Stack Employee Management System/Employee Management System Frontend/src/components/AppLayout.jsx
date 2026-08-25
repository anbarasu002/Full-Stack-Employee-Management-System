import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AppLayout.css'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="app-main">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      {mobileNavOpen && (
        <div className="app-scrim" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
      )}
    </div>
  )
}
