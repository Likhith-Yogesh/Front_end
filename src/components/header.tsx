import { LogOut, ChevronDown, User } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  application?: string   // Name of the application to display
  userName?: string      // Name of the user to display
  onLogout?: () => void  // Logout handler
  onExit?: () => void    // Exit handler
  showUserMenu?: boolean // Whether to show the user menu
}

export default function Header({
  application,
  userName = 'User',
  onLogout,
  onExit,
  showUserMenu = true
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="border-b border-slate-700 px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#171E22' }}>
      {/* Left side - Application name */}
      <div className="flex items-center">
        {application ? (
          <h1 className="text-white text-xl font-bold">{application}</h1>
        ) : (
          <h1 className="text-white text-xl font-bold">Application</h1>
        )}
      </div>

      {/* Right side - User Menu */}
      {showUserMenu && (
        <div className="flex items-center gap-4">
          <div 
            className="relative"
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button
              onMouseEnter={() => setUserMenuOpen(true)}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              <span className="text-white text-lg font-medium">{userName}</span>
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                {onExit && (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      onExit()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    <span>Exit</span>
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      onLogout()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
