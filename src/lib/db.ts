import { supabase } from './supabase'

// User profile operations
export const updateUserRole = async (userId: string, role: 'buyer' | 'seller' | 'agent' | 'investor') => {
  const { data, error } = await supabase
    .from('users')
    .update({ app_role: role })
    .eq('id', userId)
  if (error) throw error
  return data
}

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('app_role')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data?.app_role
}

// Offers
export const createOffer = async (offer: {
  property_id: string
  buyer_id: string
  offer_amount: number
  financing_type: string
  closing_date: string
  message: string
}) => {
  const { data, error } = await supabase
    .from('offers')
    .insert([{ ...offer, status: 'pending', created_at: new Date() }])
  if (error) throw error
  return data
}

// Showings
export const createShowing = async (showing: {
  property_id: string
  buyer_id: string
  agent_id: string
  scheduled_date: string
  scheduled_time: string
  notes: string
}) => {
  const { data, error } = await supabase
    .from('showings')
    .insert([{ ...showing, status: 'pending' }])
  if (error) throw error
  return data
}

// Inquiries
export const createInquiry = async (inquiry: {
  property_id: string
  agent_id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  message: string
}) => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{ ...inquiry, status: 'new', created_at: new Date() }])
  if (error) throw error
  return data
}

// Property follows (saved properties)
export const saveProperty = async (userId: string, propertyId: string) => {
  const { data, error } = await supabase
    .from('property_follows')
    .insert([{ user_id: userId, property_id: propertyId }])
  if (error) throw error
  return data
}

export const unsaveProperty = async (userId: string, propertyId: string) => {
  const { error } = await supabase
    .from('property_follows')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)
  if (error) throw error
}

export const isPropertySaved = async (userId: string, propertyId: string) => {
  const { data, error } = await supabase
    .from('property_follows')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

export const getSavedPropertiesCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('property_follows')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw error
  return count || 0
}

// Bank accounts for payouts
export const updateBankAccount = async (userId: string, account: {
  bank_name: string
  account_holder_name: string
  account_number: string
  routing_number: string
  account_type: 'checking' | 'savings'
}) => {
  const lastFour = account.account_number.slice(-4)
  const { data, error } = await supabase
    .from('bank_accounts')
    .upsert([{
      user_id: userId,
      bank_name: account.bank_name,
      account_holder_name: account.account_holder_name,
      account_number_last_four: lastFour,
      routing_number: account.routing_number,
      account_type: account.account_type,
      updated_at: new Date()
    }], { onConflict: 'user_id' })
  if (error) throw error
  return data
}

export const getBankAccount = async (userId: string) => {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}