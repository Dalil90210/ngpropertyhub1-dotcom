export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  beds: number
  baths: number
  sqft: number
  image_url: string
  agent_id: string
  created_at: string
}

export interface User {
  id: string
  email: string
  app_role: 'buyer' | 'seller' | 'agent' | 'investor'
  created_at: string
}

export interface Offer {
  id: string
  property_id: string
  buyer_id: string
  offer_amount: number
  financing_type: 'cash' | 'conventional' | 'fha' | 'va'
  closing_date: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export interface Showing {
  id: string
  property_id: string
  buyer_id: string
  agent_id: string
  scheduled_date: string
  scheduled_time: string
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

export interface Inquiry {
  id: string
  property_id: string
  agent_id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  message: string
  status: 'new' | 'responded' | 'closed'
  created_at: string
}
