import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Settings, Home } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, userRole, signOut } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSignIn = () => {
    navigate('/')
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowDropdown(false)
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setShowDropdown(false)
    setIsOpen(false)
  }

  return (
    <nav className="bg-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-2xl font-bold text-gold">NGPropertyHub</div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="hover:text-gold transition">
              Home
            </button>
            <button onClick={() => navigate('/properties')} className="hover:text-gold transition">
              Properties
            </button>
            <button onClick={() => navigate('/fractional')} className="hover:text-gold transition">
              Invest
            </button>
            <button onClick={() => navigate('/ngestimate')} className="hover:text-gold transition">
              Estimate
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-opacity-90 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="font-semibold">{userRole?.toUpperCase()}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-navy border border-gold rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => handleNavigate('/buyer-dashboard')}
                      className="w-full text-left px-4 py-2 hover:bg-navy-dark flex items-center space-x-2 transition"
                    >
                      <Home size={18} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('/settings')}
                      className="w-full text-left px-4 py-2 hover:bg-navy-dark flex items-center space-x-2 transition"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <hr className="border-gold" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-red-900 flex items-center space-x-2 transition text-red-400"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-dark">
          <div className="space-y-2 px-4 py-4">
            <button
              onClick={() => handleNavigate('/')}
              className="block w-full text-left py-2 hover:text-gold"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate('/properties')}
              className="block w-full text-left py-2 hover:text-gold"
            >
              Properties
            </button>
            <button
              onClick={() => handleNavigate('/fractional')}
              className="block w-full text-left py-2 hover:text-gold"
            >
              Invest
            </button>
            {user ? (
              <>
                <button
                  onClick={() => handleNavigate('/buyer-dashboard')}
                  className="block w-full text-left py-2 hover:text-gold"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigate('/settings')}
                  className="block w-full text-left py-2 hover:text-gold"
                >
                  Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="block w-full text-left py-2 text-gold font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}