import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Building2, Briefcase, TrendingUp, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const SplashScreen: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Browse verified homes',
      icon: Home,
      color: 'bg-blue-600',
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'List your property',
      icon: Building2,
      color: 'bg-gold',
    },
    {
      id: 'agent',
      title: 'Agent',
      description: 'Manage listings',
      icon: Briefcase,
      color: 'bg-purple-600',
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'Invest from $100',
      icon: TrendingUp,
      color: 'bg-green-600',
    },
  ]

  const handleSignIn = async (role: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/select-role?role=${role}`,
        },
      })
      if (error) throw error
    } catch (error) {
      toast.error('Sign in failed')
      setLoading(false)
    }
  }

  const handleGuestBrowse = () => {
    navigate('/properties')
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4">
      {/* Logo and Header */}
      <div className="text-center mb-12 mt-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-2xl">
            <Lock className="w-12 h-12 text-navy" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">NGPropertyHub</h1>
        <p className="text-xl text-white font-light mb-2">New Guard Property Hub</p>
        <p className="text-lg text-gold font-semibold">The #1 U.S. Real Estate Platform</p>
        <div className="flex justify-center mt-4">
          <div className="bg-gold px-4 py-2 rounded-full">
            <p className="text-navy font-bold text-sm">✓ Trust-First Real Estate</p>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {roles.map((role) => {
          const IconComponent = role.icon
          return (
            <button
              key={role.id}
              onClick={() => handleSignIn(role.id)}
              disabled={loading}
              className={`${role.color} p-6 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex flex-col items-center justify-center h-32`}
            >
              <IconComponent className="w-8 h-8 mb-2" />
              <p className="font-bold text-sm">{role.title}</p>
              <p className="text-xs mt-1 text-center">{role.description}</p>
            </button>
          )
        })}
      </div>

      {/* Sign In Button */}
      <button
        onClick={() => handleSignIn('buyer')}
        disabled={loading}
        className="w-full max-w-md bg-gold text-navy font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all mb-4 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In or Create Account'}
      </button>

      {/* Guest Browse Link */}
      <button
        onClick={handleGuestBrowse}
        className="text-gold hover:text-white transition-colors font-semibold"
      >
        Browse as Guest
      </button>
    </div>
  )
}

export default SplashScreen
