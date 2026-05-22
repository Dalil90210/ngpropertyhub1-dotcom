import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Share2, MapPin, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  sqft: number
  image?: string
  agent_id?: string
}

interface PropertyDetailProps {
  property?: Property
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [showShowingModal, setShowShowingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [saved, setSaved] = useState(false)

  // Make Offer
  const [offerAmount, setOfferAmount] = useState('')
  const [financingType, setFinancingType] = useState('conventional')
  const [closingDate, setClosingDate] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [offerLoading, setOfferLoading] = useState(false)

  const handleMakeOffer = async () => {
    if (!user) {
      toast.error('Please sign in to make an offer')
      return
    }

    if (!offerAmount || !closingDate) {
      toast.error('Please fill all fields')
      return
    }

    setOfferLoading(true)
    try {
      const { error } = await supabase.from('offers').insert([
        {
          property_id: property?.id,
          buyer_id: user.id,
          offer_amount: parseFloat(offerAmount),
          financing_type: financingType,
          closing_date: closingDate,
          message: offerMessage,
          status: 'pending',
          created_at: new Date(),
        },
      ])

      if (error) throw error

      toast.success('Your offer has been submitted')
      setShowOfferModal(false)
      setOfferAmount('')
      setFinancingType('conventional')
      setClosingDate('')
      setOfferMessage('')
    } catch (error) {
      toast.error('Failed to submit offer')
    } finally {
      setOfferLoading(false)
    }
  }

  // Book Showing
  const [showingDate, setShowingDate] = useState('')
  const [showingTime, setShowingTime] = useState('')
  const [showingNotes, setShowingNotes] = useState('')
  const [showingLoading, setShowingLoading] = useState(false)

  const handleBookShowing = async () => {
    if (!user) {
      toast.error('Please sign in to book a showing')
      return
    }

    if (!showingDate || !showingTime) {
      toast.error('Please select date and time')
      return
    }

    setShowingLoading(true)
    try {
      const { error } = await supabase.from('showings').insert([
        {
          property_id: property?.id,
          buyer_id: user.id,
          agent_id: property?.agent_id,
          scheduled_date: showingDate,
          scheduled_time: showingTime,
          notes: showingNotes,
          status: 'pending',
          created_at: new Date(),
        },
      ])

      if (error) throw error

      toast.success('Showing request sent')
      setShowShowingModal(false)
      setShowingDate('')
      setShowingTime('')
      setShowingNotes('')
    } catch (error) {
      toast.error('Failed to book showing')
    } finally {
      setShowingLoading(false)
    }
  }

  // Contact Agent
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactLoading, setContactLoading] = useState(false)

  const handleContactAgent = async () => {
    if (!contactName || !contactEmail || !contactPhone || !contactMessage) {
      toast.error('Please fill all fields')
      return
    }

    setContactLoading(true)
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          property_id: property?.id,
          agent_id: property?.agent_id,
          buyer_name: contactName,
          buyer_email: contactEmail,
          buyer_phone: contactPhone,
          message: contactMessage,
          status: 'new',
          created_at: new Date(),
        },
      ])

      if (error) throw error

      toast.success('Message sent to agent')
      setShowContactModal(false)
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setContactMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setContactLoading(false)
    }
  }

  // Save Property
  const handleSaveProperty = async () => {
    if (!user) {
      toast.error('Please sign in to save')
      return
    }

    try {
      if (saved) {
        const { error } = await supabase
          .from('property_follows')
          .delete()
          .eq('property_id', property?.id)
          .eq('user_id', user.id)

        if (error) throw error
        setSaved(false)
      } else {
        const { error } = await supabase.from('property_follows').insert([
          {
            property_id: property?.id,
            user_id: user.id,
            created_at: new Date(),
          },
        ])

        if (error) throw error
        setSaved(true)
      }
    } catch (error) {
      toast.error('Failed to save property')
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="text-white">Property not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="bg-navy p-4">
        <button
          onClick={() => navigate('/properties')}
          className="text-gold hover:text-white transition-colors"
        >
          ← Back to Properties
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Image */}
        {property.image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-400">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-gold mb-2">
              ${property.price.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProperty}
                className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
              <button className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
                <Share2 className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-800 p-6 rounded-lg">
          <div>
            <p className="text-gray-400 mb-1">Bedrooms</p>
            <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Bathrooms</p>
            <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Sq Ft</p>
            <p className="text-2xl font-bold text-white">{property.sqft.toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowOfferModal(true)}
            className="bg-gold text-navy font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Make Offer
          </button>
          <button
            onClick={() => setShowShowingModal(true)}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Book Showing
          </button>
          <button
            onClick={() => setShowContactModal(true)}
            className="bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all"
          >
            Contact Agent
          </button>
        </div>
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Make an Offer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Offer Amount</label>
                <div className="flex items-center">
                  <span className="text-gold text-xl mr-2">$</span>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Financing Type</label>
                <select
                  value={financingType}
                  onChange={(e) => setFinancingType(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                >
                  <option value="cash">Cash</option>
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Closing Date</label>
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Personal Message</label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  rows={3}
                  placeholder="Tell the seller about yourself..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakeOffer}
                  disabled={offerLoading}
                  className="flex-1 bg-gold text-navy font-bold py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
                >
                  {offerLoading ? 'Submitting...' : 'Submit Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Showing Modal */}
      {showShowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Book a Showing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={showingDate}
                  onChange={(e) => setShowingDate(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Time Slot</label>
                <select
                  value={showingTime}
                  onChange={(e) => setShowingTime(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Notes</label>
                <textarea
                  value={showingNotes}
                  onChange={(e) => setShowingNotes(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  rows={3}
                  placeholder="Any special requests?"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowShowingModal(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookShowing}
                  disabled={showingLoading}
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {showingLoading ? 'Booking...' : 'Confirm Showing'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Agent Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Agent</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  rows={4}
                  placeholder="Your message..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactAgent}
                  disabled={contactLoading}
                  className="flex-1 bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail
