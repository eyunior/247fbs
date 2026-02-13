import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { supabase } from '../lib/supabaseClient'

const RequestQuote = () => {
  const { user } = useAuth()
  const { profile } = useProfile()

  const [form, setForm] = useState({
    name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : '',
    origin: '',
    destination: '',
    pickupDate: '',
    deliveryDate: '',
    equipmentType: '',
    weight: '',
    commodity: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedTracking, setGeneratedTracking] = useState('')

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const inputClass =
    'w-full px-4 py-3 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-meta-color text-sm'
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-foreground mb-2'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Generate unique tracking number and BOL
    const ts = Date.now().toString(36).toUpperCase()
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const trackingNumber = `FBS-${new Date().getFullYear()}-${rand}${ts.slice(-2)}`
    const bolNumber = `BOL-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`

    // Calculate estimated arrival (3 days after pickup if no delivery date)
    const pickupMs = new Date(form.pickupDate).getTime()
    const estimatedArrival = form.deliveryDate
      ? new Date(form.deliveryDate).toISOString()
      : new Date(pickupMs + 3 * 24 * 60 * 60 * 1000).toISOString()

    const { error: insertError } = await supabase.from('shipments').insert({
      tracking_number: trackingNumber,
      bol_number: bolNumber,
      user_id: user?.id,
      status: 'pending',
      origin: form.origin,
      destination: form.destination,
      pickup_date: new Date(form.pickupDate).toISOString(),
      delivery_date: form.deliveryDate ? new Date(form.deliveryDate).toISOString() : null,
      estimated_arrival: estimatedArrival,
      equipment_type: form.equipmentType,
      weight: form.weight ? parseInt(form.weight) : null,
      commodity: form.commodity,
      carrier_name: '',
      shipper_name: form.name || profile?.company_name || '',
      notes: form.notes,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setGeneratedTracking(trackingNumber)
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background-alt">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-primary">24/7</span>
              <span className="text-secondary ml-1">FBS</span>
            </Link>
            <Link to="/dashboard" className="text-sm text-primary font-semibold hover:text-primary-light transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-heading-color">Request a Quote</h1>
          <p className="mt-2 text-foreground">Fill out the details below and we'll get back to you with a competitive rate.</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="card p-4 mb-6 border-l-4 border-red-500 bg-red-50 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="card p-10 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-heading-color mb-2">Quote Request Submitted!</h2>
            <p className="text-foreground mb-2">Your shipment has been created and is pending review.</p>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-xl px-4 py-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary/70">Tracking #</span>
              <span className="text-lg font-bold text-primary">{generatedTracking}</span>
            </div>
            <p className="text-sm text-foreground/60 mb-6">You can track your shipment using this number on the <Link to="/track" className="text-primary underline">Track Shipment</Link> page.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setSubmitted(false); setError(null); setGeneratedTracking(''); setForm({ name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : '', origin: '', destination: '', pickupDate: '', deliveryDate: '', equipmentType: '', weight: '', commodity: '', notes: '' }) }} className="btn-outline text-sm px-6 py-2.5">New Quote</button>
              <Link to="/track" className="btn-primary text-sm px-6 py-2.5">Track Shipment</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 animate-fade-in-up animate-delay-100">
            {/* Pre-filled info */}
            {profile?.company_name && (
              <div className="mb-6 p-4 bg-primary/5 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="text-sm font-medium text-primary">Quoting for <strong>{profile.company_name}</strong> — {user?.email}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="sm:col-span-2">
                <label className={labelClass}>Name *</label>
                <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="e.g. John Smith" />
              </div>
              <div>
                <label className={labelClass}>Origin City / Zip *</label>
                <input required type="text" value={form.origin} onChange={(e) => set('origin', e.target.value)} className={inputClass} placeholder="e.g. Chicago, IL 60601" />
              </div>
              <div>
                <label className={labelClass}>Destination City / Zip *</label>
                <input required type="text" value={form.destination} onChange={(e) => set('destination', e.target.value)} className={inputClass} placeholder="e.g. Dallas, TX 75201" />
              </div>
              <div>
                <label className={labelClass}>Pickup Date *</label>
                <input required type="date" value={form.pickupDate} onChange={(e) => set('pickupDate', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Delivery Date</label>
                <input type="date" value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Equipment Type *</label>
                <select required value={form.equipmentType} onChange={(e) => set('equipmentType', e.target.value)} className={inputClass}>
                  <option value="">Select type</option>
                  <option value="dry_van">Dry Van</option>
                  <option value="reefer">Reefer</option>
                  <option value="flatbed">Flatbed</option>
                  <option value="step_deck">Step Deck</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Weight (lbs)</label>
                <input type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} className={inputClass} placeholder="e.g. 40000" />
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Commodity</label>
              <input type="text" value={form.commodity} onChange={(e) => set('commodity', e.target.value)} className={inputClass} placeholder="e.g. Electronics, Produce, Building Materials" />
            </div>

            <div className="mb-8">
              <label className={labelClass}>Additional Notes</label>
              <textarea rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)} className={`${inputClass} resize-none`} placeholder="Special requirements, hazmat, oversized, etc." />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-secondary text-base py-4 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quote Request
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

export default RequestQuote

