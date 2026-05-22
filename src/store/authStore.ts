import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface AuthState {
  userId: string | null
  email: string | null
  role: string | null
  loading: boolean
  setAuth: (userId: string | null, email: string | null) => void
  setRole: (role: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  role: null,
  loading: true,
  setAuth: (userId, email) => set({ userId, email }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ userId: null, email: null, role: null }),
  initAuth: async () => {
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        set({ userId: data.session.user.id, email: data.session.user.email })
        
        // Fetch user role
        const { data: profileData } = await supabase
          .from('users')
          .select('app_role')
          .eq('id', data.session.user.id)
          .single()
        
        if (profileData?.app_role) {
          set({ role: profileData.app_role })
        }
      }
    } catch (error) {
      console.error('Auth init error:', error)
    } finally {
      set({ loading: false })
    }
  },
}))
