import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Home, Building2, Briefcase, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const RoleSelection: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, setRole } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Browse verified homes',
      icon: Home,
      color: 'bg-blue-600',
      route: '/buyer-dashboard',
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'List your property',
      icon: Building2,
      color: 'bg-gold',
      route: '/seller-portal',
    },
    {
      id: 'agent',
      title: 'Agent',
      description: 'Manage listings',
      icon: Briefcase,
      color: 'bg-purple-600',
      route: '/seller-portal',
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'Invest from $100',
      icon: TrendingUp,
      color: 'bg-green-600',
      route: '/investor-portal',
    },
  ]

  const handleContinue = async () => {
    if (!selectedRole || !user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ app_role: selectedRole })
        .eq('id', user.id)

      if (error) throw error

      setRole(selectedRole)
      const selectedRoleObj = roles.find((r) => r.id === selectedRole)
      navigate(selectedRoleObj?.route || '/buyer-dashboard')
      toast.success('Role selected successfully')
    } catch (error) {
      toast.error('Failed to save role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Select Your Role</h1>
        <p className="text-gold text-lg">Choose how you want to use NGPropertyHub</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {roles.map((role) => {
          const IconComponent = role.icon
          const isSelected = selectedRole === role.id
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`${role.color} ${
                isSelected ? 'ring-4 ring-gold scale-105' : ''
              } p-6 rounded-lg text-white hover:opacity-90 transition-all flex flex-col items-center justify-center h-32`}
            >
              <IconComponent className="w-8 h-8 mb-2" />
              <p className="font-bold text-sm">{role.title}</p>
              <p className="text-xs mt-1 text-center">{role.description}</p>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole || loading}
        className="w-full max-w-md bg-gold text-navy font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  )
}

export default RoleSelection
