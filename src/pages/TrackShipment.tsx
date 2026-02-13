import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Shipment, ShipmentStatus } from '../types/profile'

const statusConfig: Record<ShipmentStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  picked_up: { label: 'Picked Up', color: 'text-blue-700', bg: 'bg-blue-100' },
  in_transit: { label: 'In Transit', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100' },
  delayed: { label: 'Delayed', color: 'text-red-700', bg: 'bg-red-100' },
  cancelled: { label: 'Cancelled', color: 'text-gray-700', bg: 'bg-gray-200' },
}

const equipLabels: Record<string, string> = {
  dry_van: 'Dry Van', reefer: 'Reefer', flatbed: 'Flatbed', step_deck: 'Step Deck',
}

const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Shipment | null>(null)
  const [recent, setRecent] = useState<Shipment[]>([])

  // Load recent shipments on mount
  useEffect(() => {
    supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setRecent(data as Shipment[]) })
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = trackingId.trim()
    if (!q) return
    setLoading(true)
    setSearched(true)
    setResult(null)

    const { data } = await supabase
      .from('shipments')
      .select('*')
      .or(`tracking_number.ilike.%${q}%,bol_number.ilike.%${q}%`)
      .limit(1)
      .single()

    setResult(data as Shipment | null)
    setLoading(false)
  }

  const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
    const c = statusConfig[status] ?? statusConfig.pending
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.color} ${c.bg}`}>{c.label}</span>
  }

  return (
    <div className="min-h-screen bg-background-alt">
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
          <h1 className="text-3xl font-extrabold text-heading-color">Track Shipment</h1>
          <p className="mt-2 text-foreground">Enter your tracking number or BOL to see real-time shipment status.</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="card p-6 mb-8 animate-fade-in-up animate-delay-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={trackingId} onChange={(e) => { setTrackingId(e.target.value); setSearched(false); setResult(null) }}
                className="w-full pl-12 pr-4 py-3.5 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-meta-color text-sm"
                placeholder="Enter Tracking # or BOL # (e.g. FBS-2026-001)" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary text-sm px-8 py-3.5 rounded-xl whitespace-nowrap disabled:opacity-50">
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Search result — found */}
        {searched && result && (
          <div className="card p-0 overflow-hidden mb-8 animate-fade-in-up">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Tracking Number</p>
                <p className="text-white text-lg font-bold">{result.tracking_number}</p>
                {result.shipper_name && (
                  <p className="text-white/80 text-sm mt-0.5">{result.shipper_name}</p>
                )}
              </div>
              <StatusBadge status={result.status} />
            </div>

            <div className="p-6 space-y-6">
              {/* Route */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-foreground font-medium uppercase tracking-wider mb-1">Origin</p>
                  <p className="font-semibold text-heading-color">{result.origin}</p>
                </div>
                <svg className="w-6 h-6 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                <div className="flex-1 text-right">
                  <p className="text-xs text-foreground font-medium uppercase tracking-wider mb-1">Destination</p>
                  <p className="font-semibold text-heading-color">{result.destination}</p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'BOL #', value: result.bol_number || '—' },
                  { label: 'Equipment', value: equipLabels[result.equipment_type] || result.equipment_type },
                  { label: 'Weight', value: result.weight ? `${result.weight.toLocaleString()} lbs` : '—' },
                  { label: 'Commodity', value: result.commodity || '—' },
                  { label: 'Carrier', value: result.carrier_name || '—' },
                  { label: 'Shipper', value: result.shipper_name || '—' },
                  { label: 'Pickup', value: fmt(result.pickup_date) },
                  { label: result.status === 'delivered' ? 'Delivered' : 'Est. Arrival', value: fmt(result.status === 'delivered' ? result.delivery_date : result.estimated_arrival) },
                ].map((d) => (
                  <div key={d.label} className="bg-background-alt rounded-xl p-3">
                    <p className="text-[10px] text-foreground font-semibold uppercase tracking-wider mb-0.5">{d.label}</p>
                    <p className="text-sm font-medium text-heading-color">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {result.notes && (
                <div className="bg-background-alt rounded-xl p-4">
                  <p className="text-xs text-foreground font-semibold uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-heading-color">{result.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search result — not found */}
        {searched && !loading && !result && (
          <div className="card p-8 animate-fade-in-up">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <h2 className="text-xl font-bold text-heading-color mb-2">No Shipment Found</h2>
              <p className="text-foreground text-sm max-w-md">
                We couldn't find a shipment matching <strong className="text-heading-color">"{trackingId}"</strong>. Please double-check the tracking number or contact support.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setTrackingId(''); setSearched(false) }} className="btn-outline text-sm px-5 py-2">Clear</button>
                <Link to="/support" className="btn-primary text-sm px-5 py-2">Contact Support</Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Shipments */}
        <div className="card p-6 animate-fade-in-up animate-delay-200">
          <h2 className="text-lg font-bold text-heading-color mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Recent Shipments
          </h2>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-background-alt flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <p className="text-foreground font-medium">No shipments yet</p>
              <p className="text-sm text-foreground/60 mt-1">Your tracked shipments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setTrackingId(s.tracking_number); setSearched(true); setResult(s) }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border-color hover:border-transparent hover:shadow-card transition-all duration-200 text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-heading-color text-sm">{s.tracking_number}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    {s.shipper_name && <p className="text-xs font-medium text-heading-color/70 truncate">{s.shipper_name}</p>}
                    <p className="text-xs text-foreground truncate">{s.origin} → {s.destination}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-foreground">{equipLabels[s.equipment_type] || s.equipment_type}</p>
                    <p className="text-[10px] text-foreground/60">{fmt(s.pickup_date)}</p>
                  </div>
                  <svg className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TrackShipment

