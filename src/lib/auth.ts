import { supabase } from './supabase'

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getUserProfile(userId: string) {
  return supabase.from('users').select('*').eq('id', userId).single()
}

export async function updateUserRole(userId: string, role: string) {
  return supabase.from('users').update({ app_role: role }).eq('id', userId)
}
