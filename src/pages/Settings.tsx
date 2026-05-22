import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings as SettingsIcon, Lock, Bell, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Settings: React.FC = () => {
  const navigate = useNavigate()
  const { user, role, logout } = useAuthStore()
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email)
    }
  }, [user])

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      logout()
      navigate('/')
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    setLoading(true)
    try {
      // Delete user data from users table
      if (user) {
        await supabase.from('users').delete().eq('id', user.id)
      }
      // Sign out and delete auth user
      await supabase.auth.signOut()
      logout()
      navigate('/')
      toast.success('Account deleted')
    } catch (error) {
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchRole = () => {
    navigate('/select-role')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-navy">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* App Role Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            App Role
          </h2>
          <p className="text-gray-600 mb-4">
            Current Role: <span className="font-semibold text-gold capitalize">{role || 'None'}</span>
          </p>
          <button
            onClick={handleSwitchRole}
            className="px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-navy transition-all font-semibold"
          >
            Switch Role
          </button>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Enable notifications</label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 text-gold rounded focus:ring-gold"
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </h2>
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Change Password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <h2 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-all font-semibold disabled:opacity-50"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
