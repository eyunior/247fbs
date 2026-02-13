import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { supabase } from '../lib/supabaseClient'
import type { Shipment, ShipmentStatus } from '../types/profile'

const statusCfg: Record<ShipmentStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  picked_up: { label: 'Picked Up', color: 'text-blue-700', bg: 'bg-blue-100' },
  in_transit: { label: 'In Transit', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100' },
  delayed: { label: 'Delayed', color: 'text-red-700', bg: 'bg-red-100' },
  cancelled: { label: 'Cancelled', color: 'text-gray-700', bg: 'bg-gray-200' },
}

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([])

  useEffect(() => {
    supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setRecentShipments(data as Shipment[]) })
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user?.email?.split('@')[0] ?? 'User'

  const initials = profile?.first_name
    ? `${profile.first_name[0]}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase()

  const isCarrier = profile?.user_type === 'carrier'
  const isShipper = profile?.user_type === 'shipper'

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-background-alt">
      {/* ─── Dashboard Header ─── */}
      <header className="relative bg-gradient-to-r from-primary via-primary-light to-primary shadow-lg">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-white group-hover:text-secondary-light transition-colors">24/7</span>
                <span className="text-secondary group-hover:text-secondary-light transition-colors ml-1">FBS</span>
              </span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to="/settings"
                className="hidden sm:flex items-center gap-1.5 text-sm text-white/80 hover:text-white font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-white/80 hover:text-white font-medium transition-colors px-4 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 hover:border-white/40"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Welcome section */}
          <div className="flex items-center gap-5 py-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg ring-4 ring-white/20">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-primary" title="Online" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-sm font-medium">{greeting()}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate">{displayName}</h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {profile?.user_type && (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isCarrier
                      ? 'bg-secondary/20 text-secondary-light'
                      : 'bg-blue-400/20 text-blue-200'
                  }`}>
                    {isCarrier ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0a2 2 0 104 0m-4 0a2 2 0 114 0m6-6v6m0 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    )}
                    {isCarrier ? 'Carrier' : 'Shipper'}
                  </span>
                )}
                {profile?.company_name && (
                  <span className="text-white/60 text-sm truncate">{profile.company_name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Active Quotes', value: 0, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'primary', bg: 'from-primary/10 to-primary/5' },
            { label: 'Shipments', value: 0, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'secondary', bg: 'from-secondary/10 to-secondary/5' },
            { label: 'Delivered', value: 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'green-600', bg: 'from-green-100 to-green-50' },
            { label: isCarrier ? 'Available Loads' : 'Carriers', value: 0, icon: isCarrier ? 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' : 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'blue-600', bg: 'from-blue-100 to-blue-50' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`card p-6 animate-fade-in-up ${
                i === 1 ? 'animate-delay-100' : i === 2 ? 'animate-delay-200' : i === 3 ? 'animate-delay-300' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <svg className={`w-6 h-6 text-${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-heading-color">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 animate-fade-in-up animate-delay-200">
          <h2 className="text-lg font-bold text-heading-color mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Request Quote', desc: 'Get a freight quote', to: '/quote', icon: 'M12 4v16m8-8H4', iconColor: 'text-primary', bgHover: 'group-hover:bg-primary/5' },
              { title: 'Track Shipment', desc: 'Track your freight', to: '/track', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', iconColor: 'text-secondary', bgHover: 'group-hover:bg-secondary/5' },
              { title: 'Contact Support', desc: '24/7 assistance', to: '/support', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', iconColor: 'text-green-600', bgHover: 'group-hover:bg-green-50' },
              ...(profile?.is_admin ? [{ title: 'Admin Panel', desc: 'Manage shipments', to: '/admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', iconColor: 'text-purple-600', bgHover: 'group-hover:bg-purple-50' }] : []),
            ].map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className={`group flex items-center gap-4 p-4 rounded-xl border border-border-color hover:border-transparent hover:shadow-card transition-all duration-300 ${action.bgHover}`}
              >
                <div className="w-10 h-10 rounded-lg bg-background-alt flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className={`w-5 h-5 ${action.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-heading-color text-sm">{action.title}</p>
                  <p className="text-xs text-foreground">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Two-column layout: Profile Info + Account ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Carrier-specific Section */}
            {isCarrier && (
              <div className="card p-6 animate-fade-in-up animate-delay-300">
                <h2 className="text-lg font-bold text-heading-color mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0a2 2 0 104 0m-4 0a2 2 0 114 0m6-6v6m0 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                  Carrier Details
                </h2>

                {/* Authority badges */}
                <div className="flex flex-wrap gap-3 mb-5">
                  {profile?.mc_number && (
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-semibold px-3 py-1.5 rounded-lg">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      MC# {profile.mc_number}
                    </span>
                  )}
                  {profile?.dot_number && (
                    <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary-dark text-sm font-semibold px-3 py-1.5 rounded-lg">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      DOT# {profile.dot_number}
                    </span>
                  )}
                  {profile?.interstate_permit && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-lg">
                      Interstate: {profile.interstate_permit}
                    </span>
                  )}
                </div>

                {/* Fleet & Equipment */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  <div className="bg-background-alt rounded-xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-primary">{profile?.num_drivers ?? 0}</p>
                    <p className="text-xs text-foreground font-medium mt-1">Drivers</p>
                  </div>
                  <div className="bg-background-alt rounded-xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-secondary">{profile?.num_trucks ?? 0}</p>
                    <p className="text-xs text-foreground font-medium mt-1">Trucks</p>
                  </div>
                  <div className="bg-background-alt rounded-xl p-4 text-center col-span-2">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {(Array.isArray(profile?.equipment_types)
                        ? profile.equipment_types
                        : []
                      ).map((eq) => (
                        <span key={eq} className="inline-block bg-white text-heading-color text-xs font-semibold px-2 py-1 rounded-md shadow-sm capitalize">
                          {eq.replace('_', ' ')}
                        </span>
                      ))}
                      {(!profile?.equipment_types || (Array.isArray(profile?.equipment_types) && profile.equipment_types.length === 0)) && (
                        <span className="text-xs text-foreground">No equipment listed</span>
                      )}
                    </div>
                    <p className="text-xs text-foreground font-medium mt-2">Equipment</p>
                  </div>
                </div>

                {/* Preferred States */}
                {Array.isArray(profile?.preferred_states) && profile.preferred_states.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-heading-color mb-2">Preferred States</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.preferred_states.map((st) => (
                        <span key={st} className="bg-primary/5 text-primary text-xs font-medium px-2 py-1 rounded-md">{st}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shipper-specific Section */}
            {isShipper && (
              <div className="card p-6 animate-fade-in-up animate-delay-300">
                <h2 className="text-lg font-bold text-heading-color mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Shipper Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Company', value: profile?.company_name },
                    { label: 'Contact', value: profile?.shipper_contact_name },
                    { label: 'Phone', value: profile?.shipper_contact_phone },
                    { label: 'Email', value: profile?.shipper_contact_email },
                  ].map((item) => (
                    <div key={item.label} className="bg-background-alt rounded-xl p-4">
                      <p className="text-xs text-foreground font-medium uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-heading-color mt-1 truncate">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity — real shipment data */}
            <div className="card p-6 animate-fade-in-up animate-delay-400">
              <h2 className="text-lg font-bold text-heading-color mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recent Shipments
              </h2>
              {recentShipments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-background-alt flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-foreground font-medium">No recent activity</p>
                  <p className="text-sm text-foreground/60 mt-1">Your shipments and quotes will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentShipments.map((s) => {
                    const sc = statusCfg[s.status] ?? statusCfg.pending
                    return (
                      <Link key={s.id} to="/track" className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-alt transition-colors group">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.bg.replace('bg-', 'bg-').replace('100', '500').replace('200', '500')}`} style={{ backgroundColor: sc.color === 'text-green-700' ? '#15803d' : sc.color === 'text-yellow-700' ? '#a16207' : sc.color === 'text-indigo-700' ? '#4338ca' : sc.color === 'text-blue-700' ? '#1d4ed8' : sc.color === 'text-red-700' ? '#b91c1c' : '#6b7280' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-heading-color">{s.tracking_number}</p>
                          <p className="text-xs text-foreground truncate">{s.origin} → {s.destination}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color} ${sc.bg}`}>{sc.label}</span>
                      </Link>
                    )
                  })}
                  <Link to="/track" className="block text-center text-sm text-primary font-semibold hover:text-primary-light transition-colors pt-2">
                    View All Shipments →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right column – Account Info (1/3 width) */}
          <div className="space-y-6">
            {/* Account Card */}
            <div className="card p-6 animate-fade-in-up animate-delay-300">
              <h2 className="text-lg font-bold text-heading-color mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Account
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Email', value: user?.email ?? '—' },
                  { label: 'Phone', value: profile?.phone || '—' },
                  { label: 'City', value: profile?.city || '—' },
                  { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-border-color last:border-0">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <span className="text-sm font-semibold text-heading-color truncate max-w-[55%] text-right">{item.value}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/settings"
                className="mt-5 w-full btn-outline text-sm py-2.5 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Profile
              </Link>
            </div>

            {/* Notification Preferences mini-card */}
            <div className="card p-6 animate-fade-in-up animate-delay-400">
              <h2 className="text-lg font-bold text-heading-color mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Notifications
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Email', active: profile?.notify_email },
                  { label: 'SMS', active: profile?.notify_sms },
                  { label: 'Push', active: profile?.notify_push },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{n.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${n.active ? 'bg-green-400' : 'bg-gray-300'}`} />
                  </div>
                ))}
              </div>
              {isCarrier && (
                <div className="mt-4 pt-4 border-t border-border-color flex items-center justify-between">
                  <span className="text-sm text-foreground">Location Sharing</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${profile?.share_location ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {profile?.share_location ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard