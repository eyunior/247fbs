import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Shipment, ShipmentStatus } from '../types/profile'

const statusOptions: { value: ShipmentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusCfg: Record<ShipmentStatus, { label: string; color: string; bg: string }> = {
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

const emptyForm = {
  tracking_number: '',
  bol_number: '',
  status: 'pending' as ShipmentStatus,
  origin: '',
  destination: '',
  pickup_date: '',
  delivery_date: '',
  estimated_arrival: '',
  equipment_type: '',
  weight: '',
  commodity: '',
  carrier_name: '',
  shipper_name: '',
  notes: '',
}

const Admin = () => {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Shipment | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const fetchShipments = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false })
    setShipments((data as Shipment[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchShipments() }, [fetchShipments])

  // Auto-dismiss success message
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3000)
      return () => clearTimeout(t)
    }
  }, [successMsg])

  const filtered = shipments.filter((s) => {
    const matchSearch = !search || s.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      s.bol_number.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase()) ||
      s.carrier_name.toLowerCase().includes(search.toLowerCase()) ||
      s.shipper_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const openCreate = () => {
    setEditing(null)
    const ts = Date.now().toString(36).toUpperCase()
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    setForm({
      ...emptyForm,
      tracking_number: `FBS-${new Date().getFullYear()}-${rand}${ts.slice(-2)}`,
      bol_number: `BOL-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
    })
    setError(null)
    setShowModal(true)
  }

  const openEdit = (s: Shipment) => {
    setEditing(s)
    setForm({
      tracking_number: s.tracking_number,
      bol_number: s.bol_number,
      status: s.status,
      origin: s.origin,
      destination: s.destination,
      pickup_date: s.pickup_date ? s.pickup_date.slice(0, 16) : '',
      delivery_date: s.delivery_date ? s.delivery_date.slice(0, 16) : '',
      estimated_arrival: s.estimated_arrival ? s.estimated_arrival.slice(0, 16) : '',
      equipment_type: s.equipment_type,
      weight: s.weight ? String(s.weight) : '',
      commodity: s.commodity,
      carrier_name: s.carrier_name,
      shipper_name: s.shipper_name,
      notes: s.notes,
    })
    setError(null)
    setShowModal(true)
  }

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const payload = {
      tracking_number: form.tracking_number,
      bol_number: form.bol_number,
      status: form.status,
      origin: form.origin,
      destination: form.destination,
      pickup_date: form.pickup_date ? new Date(form.pickup_date).toISOString() : null,
      delivery_date: form.delivery_date ? new Date(form.delivery_date).toISOString() : null,
      estimated_arrival: form.estimated_arrival ? new Date(form.estimated_arrival).toISOString() : null,
      equipment_type: form.equipment_type,
      weight: form.weight ? parseInt(form.weight) : null,
      commodity: form.commodity,
      carrier_name: form.carrier_name,
      shipper_name: form.shipper_name,
      notes: form.notes,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { error: e } = await supabase.from('shipments').update(payload).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSuccessMsg(`Shipment ${form.tracking_number} updated`)
    } else {
      const { error: e } = await supabase.from('shipments').insert(payload)
      if (e) { setError(e.message); setSaving(false); return }
      setSuccessMsg(`Shipment ${form.tracking_number} created`)
    }

    setSaving(false)
    setShowModal(false)
    fetchShipments()
  }

  const quickStatus = async (id: string, status: ShipmentStatus) => {
    await supabase.from('shipments').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setSuccessMsg(`Status updated to ${statusCfg[status].label}`)
    fetchShipments()
  }

  const handleDelete = async (id: string, trackNum: string) => {
    if (!confirm(`Delete shipment ${trackNum}? This cannot be undone.`)) return
    await supabase.from('shipments').delete().eq('id', id)
    setSuccessMsg(`Shipment ${trackNum} deleted`)
    fetchShipments()
  }

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  const inputClass = 'w-full px-3 py-2.5 bg-background-alt border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm'
  const labelClass = 'block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1'

  return (
    <div className="min-h-screen bg-background-alt">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-2xl font-extrabold tracking-tight">
                <span className="text-primary">24/7</span>
                <span className="text-secondary ml-1">FBS</span>
              </Link>
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-primary rounded-full px-3 py-1">Admin</span>
            </div>
            <Link to="/dashboard" className="text-sm text-primary font-semibold hover:text-primary-light transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success banner */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-fade-in-up">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-sm text-green-700 font-medium">{successMsg}</span>
          </div>
        )}

        {/* Title + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-heading-color">Shipment Management</h1>
            <p className="text-sm text-foreground mt-1">{shipments.length} total shipments</p>
          </div>
          <button onClick={openCreate} className="btn-secondary text-sm px-6 py-3 rounded-xl flex items-center gap-2 self-start sm:self-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Shipment
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tracking #, BOL, origin, destination, carrier, shipper..."
              className="w-full pl-10 pr-4 py-2.5 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
            <option value="all">All Statuses</option>
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Shipment Table */}
        {loading ? (
          <div className="card p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-foreground font-medium">No shipments found</p>
            <p className="text-sm text-foreground/60 mt-1">{search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first shipment'}</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-background-alt border-b border-border-color">
                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground">Tracking #</th>
                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground">Route</th>
                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground hidden md:table-cell">Equipment</th>
                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground hidden lg:table-cell">Pickup</th>
                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground hidden lg:table-cell">Carrier</th>
                    <th className="text-right px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {filtered.map((s) => {
                    const sc = statusCfg[s.status] ?? statusCfg.pending
                    return (
                      <tr key={s.id} className="hover:bg-background-alt/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-heading-color">{s.tracking_number}</p>
                          <p className="text-[10px] text-foreground/60">{s.bol_number}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-heading-color truncate max-w-[200px]">{s.origin}</p>
                          <p className="text-foreground/60 text-xs truncate max-w-[200px]">→ {s.destination}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.color} ${sc.bg}`}>{sc.label}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-foreground">{equipLabels[s.equipment_type] || s.equipment_type || '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-foreground">{fmt(s.pickup_date)}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-foreground truncate max-w-[120px]">{s.carrier_name || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* Quick status dropdown */}
                            <select
                              value={s.status}
                              onChange={(e) => quickStatus(s.id, e.target.value as ShipmentStatus)}
                              className="text-[10px] px-2 py-1 bg-background-alt rounded-lg border-0 focus:ring-1 focus:ring-primary/50 cursor-pointer"
                            >
                              {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => handleDelete(s.id, s.tracking_number)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-border-color px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-heading-color">{editing ? 'Edit Shipment' : 'Create Shipment'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-background-alt rounded-lg transition-colors">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tracking #</label>
                  <input value={form.tracking_number} onChange={(e) => set('tracking_number', e.target.value)} className={inputClass} readOnly={!!editing} />
                </div>
                <div>
                  <label className={labelClass}>BOL #</label>
                  <input value={form.bol_number} onChange={(e) => set('bol_number', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Origin *</label>
                  <input value={form.origin} onChange={(e) => set('origin', e.target.value)} className={inputClass} placeholder="City, ST ZIP" required />
                </div>
                <div>
                  <label className={labelClass}>Destination *</label>
                  <input value={form.destination} onChange={(e) => set('destination', e.target.value)} className={inputClass} placeholder="City, ST ZIP" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
                    {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Equipment Type</label>
                  <select value={form.equipment_type} onChange={(e) => set('equipment_type', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="dry_van">Dry Van</option>
                    <option value="reefer">Reefer</option>
                    <option value="flatbed">Flatbed</option>
                    <option value="step_deck">Step Deck</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Weight (lbs)</label>
                  <input type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Pickup Date</label>
                  <input type="datetime-local" value={form.pickup_date} onChange={(e) => set('pickup_date', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Delivery Date</label>
                  <input type="datetime-local" value={form.delivery_date} onChange={(e) => set('delivery_date', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Est. Arrival</label>
                  <input type="datetime-local" value={form.estimated_arrival} onChange={(e) => set('estimated_arrival', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Carrier Name</label>
                  <input value={form.carrier_name} onChange={(e) => set('carrier_name', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Shipper Name</label>
                  <input value={form.shipper_name} onChange={(e) => set('shipper_name', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Commodity</label>
                <input value={form.commodity} onChange={(e) => set('commodity', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} className={`${inputClass} resize-none`} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-border-color px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-outline text-sm px-5 py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.origin || !form.destination} className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50 flex items-center gap-2">
                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {editing ? 'Save Changes' : 'Create Shipment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin