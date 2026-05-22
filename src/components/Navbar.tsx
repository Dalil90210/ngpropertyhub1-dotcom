import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/select-role`,
        },
      })
      if (error) throw error
    } catch (error) {
      toast.error('Sign in failed')
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/')
      toast.success('Signed out')
    } catch (error) {
      toast.error('Sign out failed')
    }
  }

  return (
    <nav className="bg-navy-dark border-b border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-gold">NGPropertyHub</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <button
                onClick={handleSignIn}
                className="bg-gold text-navy px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90"
              >
                Sign In
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-navy font-semibold hover:bg-opacity-90"
                >
                  <User className="w-4 h-4" />
                  Menu
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                    <button
                      onClick={() => {
                        navigate('/buyer-dashboard')
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-navy hover:bg-gold hover:bg-opacity-20"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-navy hover:bg-gold hover:bg-opacity-20"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gold"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gold hover:text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gold">
            {!user ? (
              <button
                onClick={() => {
                  handleSignIn()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-gold text-navy px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 mt-4"
              >
                Sign In
              </button>
            ) : (
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => {
                    navigate('/buyer-dashboard')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-gold hover:bg-navy"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/settings')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-gold hover:bg-navy"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-navy"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
