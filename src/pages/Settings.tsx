import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import type { EquipmentType } from '../types/profile'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
]

const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string }[] = [
  { value: 'dry_van', label: 'Dry Van' },
  { value: 'reefer', label: 'Reefer' },
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'step_deck', label: 'Step Deck' },
]

const Settings = () => {
  const { user, signOut } = useAuth()
  const { profile, profileLoading, updateProfile } = useProfile()

  // Common fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [emailField, setEmailField] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [city, setCity] = useState('')

  // Carrier fields
  const [mcNumber, setMcNumber] = useState('')
  const [dotNumber, setDotNumber] = useState('')
  const [interstatePermit, setInterstatePermit] = useState('')
  const [einSsnW9, setEinSsnW9] = useState('')
  const [dba, setDba] = useState('')
  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [insuranceContactName, setInsuranceContactName] = useState('')
  const [insurancePhone, setInsurancePhone] = useState('')
  const [factoringCompany, setFactoringCompany] = useState('')
  const [factoringContactName, setFactoringContactName] = useState('')
  const [factoringPhone, setFactoringPhone] = useState('')
  const [numDrivers, setNumDrivers] = useState(1)
  const [numTrucks, setNumTrucks] = useState(1)
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([])
  const [preferredStates, setPreferredStates] = useState<string[]>([])

  // Shipper fields
  const [shipperContactName, setShipperContactName] = useState('')
  const [shipperContactPhone, setShipperContactPhone] = useState('')
  const [shipperContactEmail, setShipperContactEmail] = useState('')

  // Notification preferences
  const [shareLocation, setShareLocation] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)
  const [notifyPush, setNotifyPush] = useState(false)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '')
      setLastName(profile.last_name || '')
      setPhone(profile.phone || '')
      setEmailField(profile.email || '')
      setCompanyName(profile.company_name || '')
      setCity(profile.city || '')
      setMcNumber(profile.mc_number || '')
      setDotNumber(profile.dot_number || '')
      setInterstatePermit(profile.interstate_permit || '')
      setEinSsnW9(profile.ein_ssn_w9 || '')
      setDba(profile.dba || '')
      setInsuranceCompany(profile.insurance_company || '')
      setInsuranceContactName(profile.insurance_contact_name || '')
      setInsurancePhone(profile.insurance_phone || '')
      setFactoringCompany(profile.factoring_company || '')
      setFactoringContactName(profile.factoring_contact_name || '')
      setFactoringPhone(profile.factoring_phone || '')
      setNumDrivers(profile.num_drivers || 1)
      setNumTrucks(profile.num_trucks || 1)
      // Parse arrays - they may come as JSON strings from Supabase
      const eqTypes = profile.equipment_types
      setEquipmentTypes(typeof eqTypes === 'string' ? JSON.parse(eqTypes) : (eqTypes || []))
      const prefStates = profile.preferred_states
      setPreferredStates(typeof prefStates === 'string' ? JSON.parse(prefStates) : (prefStates || []))
      setShipperContactName(profile.shipper_contact_name || '')
      setShipperContactPhone(profile.shipper_contact_phone || '')
      setShipperContactEmail(profile.shipper_contact_email || '')
      setShareLocation(profile.share_location ?? false)
      setNotifyEmail(profile.notify_email ?? true)
      setNotifySms(profile.notify_sms ?? false)
      setNotifyPush(profile.notify_push ?? false)
    }
  }, [profile])

  const toggleEquipment = (eq: EquipmentType) => {
    setEquipmentTypes(prev => prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq])
  }
  const toggleState = (st: string) => {
    setPreferredStates(prev => prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st])
  }

  const handleSaveProfile = async () => {
    setSaving(true); setError(null); setSuccess(null)
    const updates = isCarrier ? {
      first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim(),
      email: emailField.trim(), company_name: companyName.trim(), city: city.trim(),
      mc_number: mcNumber.trim(), dot_number: dotNumber.trim(), interstate_permit: interstatePermit.trim(),
      ein_ssn_w9: einSsnW9.trim(), dba: dba.trim(),
      insurance_company: insuranceCompany.trim(), insurance_contact_name: insuranceContactName.trim(), insurance_phone: insurancePhone.trim(),
      factoring_company: factoringCompany.trim(), factoring_contact_name: factoringContactName.trim(), factoring_phone: factoringPhone.trim(),
      num_drivers: numDrivers, num_trucks: numTrucks,
      equipment_types: equipmentTypes, preferred_states: preferredStates,
    } : {
      first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim(),
      email: emailField.trim(), company_name: companyName.trim(), city: city.trim(),
      shipper_contact_name: shipperContactName.trim(), shipper_contact_phone: shipperContactPhone.trim(), shipper_contact_email: shipperContactEmail.trim(),
    }
    const { error: err } = await updateProfile(updates)
    setSaving(false)
    if (err) setError(err.message); else setSuccess('Profile updated successfully!')
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleSaveNotifications = async () => {
    setSaving(true); setError(null); setSuccess(null)
    const { error: err } = await updateProfile({ share_location: shareLocation, notify_email: notifyEmail, notify_sms: notifySms, notify_push: notifyPush })
    setSaving(false)
    if (err) setError(err.message); else setSuccess('Notification preferences saved!')
    setTimeout(() => setSuccess(null), 3000)
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-alt">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const isCarrier = profile?.user_type === 'carrier'
  const isShipper = profile?.user_type === 'shipper'
  const inputClass = "w-full px-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background-alt text-sm"
  const labelClass = "block text-sm font-semibold mb-1.5 text-heading-color"

  return (
    <div className="min-h-screen bg-background-alt">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-primary">24/7 FBS</Link>
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm text-primary font-semibold hover:text-primary-light transition-colors">← Dashboard</Link>
              <span className="text-sm text-foreground hidden sm:block">{user?.email}</span>
              <button onClick={signOut} className="bg-secondary text-white px-4 py-2 rounded-xl text-sm hover:bg-secondary-light transition-all">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-heading-color mb-2">Settings</h1>
        <p className="text-foreground mb-8">Manage your profile and notification preferences.</p>

        {/* Alerts */}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm animate-fade-in">{success}</div>}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-fade-in">{error}</div>}

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-heading-color mb-1 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile Information
          </h2>
          <p className="text-xs text-foreground mb-6 ml-7">Account Type: <span className="font-bold capitalize text-heading-color">{profile?.user_type || 'Not set'}</span></p>

          {/* Contact Info (all users) */}
          <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
            <p className="font-bold text-heading-color text-sm">Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Email</label><input type="email" value={emailField} onChange={e => setEmailField(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass} /></div>
            </div>
          </div>

          {/* Carrier-specific fields */}
          {isCarrier && (
            <>
              <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
                <p className="font-bold text-heading-color text-sm">Authorities & Permits</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>MC #</label><input type="text" value={mcNumber} onChange={e => setMcNumber(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>DOT #</label><input type="text" value={dotNumber} onChange={e => setDotNumber(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Interstate Permit</label><input type="text" value={interstatePermit} onChange={e => setInterstatePermit(e.target.value)} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>EIN / SSN / W9</label><input type="text" value={einSsnW9} onChange={e => setEinSsnW9(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>DBA</label><input type="text" value={dba} onChange={e => setDba(e.target.value)} className={inputClass} /></div>
                </div>
              </div>

              <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
                <p className="font-bold text-heading-color text-sm">Insurance Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Insurance Company</label><input type="text" value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Contact Name</label><input type="text" value={insuranceContactName} onChange={e => setInsuranceContactName(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Phone Number</label><input type="tel" value={insurancePhone} onChange={e => setInsurancePhone(e.target.value)} className={inputClass} /></div>
                </div>
              </div>

              <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
                <p className="font-bold text-heading-color text-sm">Factoring Company</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Company Name</label><input type="text" value={factoringCompany} onChange={e => setFactoringCompany(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Contact Name</label><input type="text" value={factoringContactName} onChange={e => setFactoringContactName(e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Phone Number</label><input type="tel" value={factoringPhone} onChange={e => setFactoringPhone(e.target.value)} className={inputClass} /></div>
                </div>
              </div>

              <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
                <p className="font-bold text-heading-color text-sm">Fleet Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>How Many Drivers</label><input type="number" min={1} value={numDrivers} onChange={e => setNumDrivers(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>How Many Trucks</label><input type="number" min={1} value={numTrucks} onChange={e => setNumTrucks(Number(e.target.value))} className={inputClass} /></div>
                </div>
              </div>

              <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
                <p className="font-bold text-heading-color text-sm">Equipment Types</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EQUIPMENT_OPTIONS.map(eq => (
                    <button key={eq.value} type="button" onClick={() => toggleEquipment(eq.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        equipmentTypes.includes(eq.value) ? 'border-primary bg-primary/10 text-primary' : 'border-border-color text-foreground hover:border-primary/40'
                      }`}>{eq.label}</button>
                  ))}
                </div>
              </div>

              <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
                <p className="font-bold text-heading-color text-sm">Preferred States</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {US_STATES.map(st => (
                    <button key={st} type="button" onClick={() => toggleState(st)}
                      className={`px-2 py-2 rounded-lg border text-xs font-bold transition-all duration-150 ${
                        preferredStates.includes(st) ? 'border-primary bg-primary text-white' : 'border-border-color text-foreground hover:border-primary/40'
                      }`}>{st}</button>
                  ))}
                </div>
                {preferredStates.length > 0 && (
                  <p className="text-xs text-primary font-semibold">{preferredStates.length} state{preferredStates.length > 1 ? 's' : ''} selected</p>
                )}
              </div>
            </>
          )}

          {/* Shipper-specific fields */}
          {isShipper && (
            <div className="border border-border-color rounded-xl p-5 space-y-4 mb-5">
              <p className="font-bold text-heading-color text-sm">Primary Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className={labelClass}>Contact Name</label><input type="text" value={shipperContactName} onChange={e => setShipperContactName(e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Contact Phone</label><input type="tel" value={shipperContactPhone} onChange={e => setShipperContactPhone(e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Contact Email</label><input type="email" value={shipperContactEmail} onChange={e => setShipperContactEmail(e.target.value)} className={inputClass} /></div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button onClick={handleSaveProfile} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-light transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Notification Section */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-heading-color mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            Notification Preferences
          </h2>

          {/* Location Sharing (carrier only) */}
          {isCarrier && (
            <div className="p-5 rounded-xl border border-border-color mb-5 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-heading-color text-sm">Share My Location</p>
                    <p className="text-xs text-foreground">Get load alerts near your current location</p>
                  </div>
                </div>
                <button onClick={() => setShareLocation(!shareLocation)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${shareLocation ? 'bg-primary' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${shareLocation ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Notification Channels */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border-color hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-heading-color text-sm">Email Notifications</p>
                  <p className="text-xs text-foreground">Receive alerts via email</p>
                </div>
              </div>
              <button onClick={() => setNotifyEmail(!notifyEmail)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notifyEmail ? 'bg-primary' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifyEmail ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            {/* SMS */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border-color hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-heading-color text-sm">SMS / Text Messages</p>
                  <p className="text-xs text-foreground">Get text alerts to your phone</p>
                </div>
              </div>
              <button onClick={() => setNotifySms(!notifySms)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notifySms ? 'bg-primary' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifySms ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            {/* Push */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border-color hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-heading-color text-sm">Push Notifications</p>
                  <p className="text-xs text-foreground">Browser & mobile push alerts</p>
                </div>
              </div>
              <button onClick={() => setNotifyPush(!notifyPush)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notifyPush ? 'bg-primary' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifyPush ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={handleSaveNotifications} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-light transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Notifications'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings

