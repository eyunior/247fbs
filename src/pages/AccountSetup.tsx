import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import type { UserType, EquipmentType } from '../types/profile'

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

const AccountSetup = () => {
  const { user } = useAuth()
  const { createProfile } = useProfile()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Common fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [emailField, setEmailField] = useState(user?.email || '')
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

  const totalSteps = userType === 'carrier' ? 4 : (userType === 'shipper' ? 2 : 1)

  const toggleEquipment = (eq: EquipmentType) => {
    setEquipmentTypes(prev => prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq])
  }

  const toggleState = (st: string) => {
    setPreferredStates(prev => prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st])
  }

  const handleNext = () => {
    setError(null)
    if (step === 1) {
      if (!userType) { setError('Please select your account type.'); return }
      setStep(2)
    } else if (step === 2) {
      if (userType === 'carrier') {
        if (!firstName.trim() || !lastName.trim() || !phone.trim() || !companyName.trim() || !emailField.trim()) {
          setError('Please fill in all required fields.'); return
        }
        if (!mcNumber.trim() || !dotNumber.trim() || !interstatePermit.trim()) {
          setError('MC#, DOT#, and Interstate Permit are required.'); return
        }
        if (!einSsnW9.trim()) { setError('EIN / SSN / W9 is required.'); return }
        if (!insuranceCompany.trim() || !insuranceContactName.trim() || !insurancePhone.trim()) {
          setError('Insurance information is required.'); return
        }
        if (!factoringCompany.trim() || !factoringContactName.trim() || !factoringPhone.trim()) {
          setError('Factoring company information is required.'); return
        }
        setStep(3)
      } else {
        // Shipper step 2
        if (!companyName.trim() || !shipperContactName.trim() || !shipperContactPhone.trim() || !shipperContactEmail.trim()) {
          setError('Please fill in all required fields.'); return
        }
        handleSubmit()
      }
    } else if (step === 3) {
      if (equipmentTypes.length === 0) { setError('Please select at least one equipment type.'); return }
      if (preferredStates.length === 0) { setError('Please select at least one preferred state.'); return }
      setStep(4)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    const profileData = userType === 'carrier' ? {
      user_type: userType,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      email: emailField.trim(),
      company_name: companyName.trim(),
      city: city.trim(),
      mc_number: mcNumber.trim(),
      dot_number: dotNumber.trim(),
      interstate_permit: interstatePermit.trim(),
      ein_ssn_w9: einSsnW9.trim(),
      dba: dba.trim(),
      insurance_company: insuranceCompany.trim(),
      insurance_contact_name: insuranceContactName.trim(),
      insurance_phone: insurancePhone.trim(),
      factoring_company: factoringCompany.trim(),
      factoring_contact_name: factoringContactName.trim(),
      factoring_phone: factoringPhone.trim(),
      num_drivers: numDrivers,
      num_trucks: numTrucks,
      equipment_types: equipmentTypes,
      preferred_states: preferredStates,
      share_location: shareLocation,
      notify_email: notifyEmail,
      notify_sms: notifySms,
      notify_push: notifyPush,
    } : {
      user_type: userType,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      email: emailField.trim(),
      company_name: companyName.trim(),
      city: city.trim(),
      shipper_contact_name: shipperContactName.trim(),
      shipper_contact_phone: shipperContactPhone.trim(),
      shipper_contact_email: shipperContactEmail.trim(),
    }
    const { error: err } = await createProfile(profileData)
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const inputClass = "w-full px-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background-alt text-sm"
  const labelClass = "block text-sm font-semibold mb-1.5 text-heading-color"
  const reqStar = <span className="text-red-500 ml-0.5">*</span>

  return (
    <div className="min-h-screen bg-background-alt flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary">24/7 FBS</Link>
          <h2 className="mt-4 text-2xl font-bold text-heading-color">Complete Your Profile</h2>
          <p className="mt-2 text-foreground">Welcome, {user?.email}! Let's set up your account.</p>
        </div>

        {/* Progress Bar */}
        {totalSteps > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  i + 1 <= step ? 'bg-primary text-white shadow-glow-primary' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1 < step ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-12 h-1 rounded-full transition-all duration-300 ${i + 1 < step ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-card animate-fade-in">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
          )}

          {/* ===== STEP 1: Account Type Selection ===== */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in-up">
              <h3 className="text-lg font-bold text-heading-color mb-1">Account Type</h3>
              <p className="text-sm text-foreground mb-4">How will you be using 24/7 FBS?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setUserType('shipper')}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-card ${
                    userType === 'shipper' ? 'border-primary bg-primary/5 shadow-card' : 'border-border-color hover:border-primary/40'}`}>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <p className="font-bold text-heading-color">Shipper</p>
                  <p className="text-sm text-foreground mt-1">I need to ship freight</p>
                </button>
                <button onClick={() => setUserType('carrier')}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-card ${
                    userType === 'carrier' ? 'border-primary bg-primary/5 shadow-card' : 'border-border-color hover:border-primary/40'}`}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </div>
                  <p className="font-bold text-heading-color">Carrier</p>
                  <p className="text-sm text-foreground mt-1">I transport freight</p>
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2 (CARRIER): Company & Personal Info ===== */}
          {step === 2 && userType === 'carrier' && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-lg font-bold text-heading-color">Carrier Information</h3>

              {/* Authorities Section */}
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Authorities & Permits
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>MC #{reqStar}</label><input type="text" value={mcNumber} onChange={e => setMcNumber(e.target.value)} className={inputClass} placeholder="MC-123456" /></div>
                  <div><label className={labelClass}>DOT #{reqStar}</label><input type="text" value={dotNumber} onChange={e => setDotNumber(e.target.value)} className={inputClass} placeholder="DOT-789012" /></div>
                  <div><label className={labelClass}>Interstate Permit{reqStar}</label><input type="text" value={interstatePermit} onChange={e => setInterstatePermit(e.target.value)} className={inputClass} placeholder="Permit #" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>EIN / SSN / W9{reqStar}</label><input type="text" value={einSsnW9} onChange={e => setEinSsnW9(e.target.value)} className={inputClass} placeholder="XX-XXXXXXX" /></div>
                  <div><label className={labelClass}>MC-DOT Authorities (file)</label><input type="file" className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" /></div>
                </div>
              </div>

              {/* Company Info */}
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Company Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Company Name{reqStar}</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} placeholder="ABC Trucking LLC" /></div>
                  <div><label className={labelClass}>DBA</label><input type="text" value={dba} onChange={e => setDba(e.target.value)} className={inputClass} placeholder="Doing Business As" /></div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Contact Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>First Name{reqStar}</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="John" /></div>
                  <div><label className={labelClass}>Last Name{reqStar}</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Doe" /></div>
                  <div><label className={labelClass}>Phone{reqStar}</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="(555) 123-4567" /></div>
                  <div><label className={labelClass}>Email Address{reqStar}</label><input type="email" value={emailField} onChange={e => setEmailField(e.target.value)} className={inputClass} placeholder="john@example.com" /></div>
                  <div><label className={labelClass}>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Miami" /></div>
                </div>
              </div>

              {/* Insurance Info */}
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Insurance Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Insurance Company{reqStar}</label><input type="text" value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} className={inputClass} placeholder="Insurance Co." /></div>
                  <div><label className={labelClass}>Contact Name{reqStar}</label><input type="text" value={insuranceContactName} onChange={e => setInsuranceContactName(e.target.value)} className={inputClass} placeholder="Jane Smith" /></div>
                  <div><label className={labelClass}>Phone Number{reqStar}</label><input type="tel" value={insurancePhone} onChange={e => setInsurancePhone(e.target.value)} className={inputClass} placeholder="(555) 987-6543" /></div>
                </div>
              </div>

              {/* Factoring Info */}
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Factoring Company
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Company Name{reqStar}</label><input type="text" value={factoringCompany} onChange={e => setFactoringCompany(e.target.value)} className={inputClass} placeholder="Factoring Co." /></div>
                  <div><label className={labelClass}>Contact Name{reqStar}</label><input type="text" value={factoringContactName} onChange={e => setFactoringContactName(e.target.value)} className={inputClass} placeholder="Bob Johnson" /></div>
                  <div><label className={labelClass}>Phone Number{reqStar}</label><input type="tel" value={factoringPhone} onChange={e => setFactoringPhone(e.target.value)} className={inputClass} placeholder="(555) 456-7890" /></div>
                </div>
              </div>

              {/* Fleet Info */}
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  Fleet Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>How Many Drivers{reqStar}</label>
                    <input type="number" min={1} max={99999} value={numDrivers} onChange={e => setNumDrivers(Number(e.target.value))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>How Many Trucks{reqStar}</label>
                    <input type="number" min={1} max={99999} value={numTrucks} onChange={e => setNumTrucks(Number(e.target.value))} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 2 (SHIPPER): Company Info ===== */}
          {step === 2 && userType === 'shipper' && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-lg font-bold text-heading-color">Shipper Information</h3>
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm">Company Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className={labelClass}>Company Name{reqStar}</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} placeholder="Acme Corp" /></div>
                  <div><label className={labelClass}>First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="John" /></div>
                  <div><label className={labelClass}>Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Doe" /></div>
                  <div><label className={labelClass}>Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="(555) 123-4567" /></div>
                  <div><label className={labelClass}>Email</label><input type="email" value={emailField} onChange={e => setEmailField(e.target.value)} className={inputClass} placeholder="john@acme.com" /></div>
                  <div><label className={labelClass}>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="New York" /></div>
                </div>
              </div>
              <div className="border border-border-color rounded-xl p-5 space-y-4">
                <p className="font-bold text-heading-color text-sm">Primary Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Contact Name{reqStar}</label><input type="text" value={shipperContactName} onChange={e => setShipperContactName(e.target.value)} className={inputClass} placeholder="Jane Smith" /></div>
                  <div><label className={labelClass}>Contact Phone{reqStar}</label><input type="tel" value={shipperContactPhone} onChange={e => setShipperContactPhone(e.target.value)} className={inputClass} placeholder="(555) 987-6543" /></div>
                  <div><label className={labelClass}>Contact Email{reqStar}</label><input type="email" value={shipperContactEmail} onChange={e => setShipperContactEmail(e.target.value)} className={inputClass} placeholder="jane@acme.com" /></div>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 3 (CARRIER): Equipment & States ===== */}
          {step === 3 && userType === 'carrier' && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-lg font-bold text-heading-color">Equipment & Preferences</h3>

              {/* Equipment Types */}
              <div>
                <label className={labelClass}>Type of Equipment{reqStar}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {EQUIPMENT_OPTIONS.map(eq => (
                    <button key={eq.value} type="button" onClick={() => toggleEquipment(eq.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        equipmentTypes.includes(eq.value) ? 'border-primary bg-primary/10 text-primary' : 'border-border-color text-foreground hover:border-primary/40'
                      }`}>
                      {eq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred States */}
              <div>
                <label className={labelClass}>What States You Prefer to Drive{reqStar}</label>
                <p className="text-xs text-foreground mb-2">Select all that apply</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-2">
                  {US_STATES.map(st => (
                    <button key={st} type="button" onClick={() => toggleState(st)}
                      className={`px-2 py-2 rounded-lg border text-xs font-bold transition-all duration-150 ${
                        preferredStates.includes(st) ? 'border-primary bg-primary text-white' : 'border-border-color text-foreground hover:border-primary/40'
                      }`}>
                      {st}
                    </button>
                  ))}
                </div>
                {preferredStates.length > 0 && (
                  <p className="text-xs text-primary mt-2 font-semibold">{preferredStates.length} state{preferredStates.length > 1 ? 's' : ''} selected</p>
                )}
              </div>
            </div>
          )}

          {/* ===== STEP 4 (CARRIER): Location & Notifications ===== */}
          {step === 4 && userType === 'carrier' && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-lg font-bold text-heading-color">Location & Notifications</h3>
              <p className="text-sm text-foreground">Help us connect you with nearby loads.</p>

              <div className="p-5 rounded-xl border-2 border-border-color hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-heading-color">Share My Location</p>
                      <button type="button" onClick={() => setShareLocation(!shareLocation)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${shareLocation ? 'bg-primary' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${shareLocation ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>
                    <p className="text-sm text-foreground mt-1">Receive load notifications based on your current location.</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-heading-color mb-3">How would you like to be notified?</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 rounded-xl border border-border-color hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1"><p className="font-semibold text-heading-color text-sm">Email Notifications</p><p className="text-xs text-foreground">Receive load alerts via email</p></div>
                    <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                  </label>
                  <label className="flex items-center gap-4 p-4 rounded-xl border border-border-color hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1"><p className="font-semibold text-heading-color text-sm">SMS / Text Messages</p><p className="text-xs text-foreground">Get text alerts to your phone</p></div>
                    <input type="checkbox" checked={notifySms} onChange={e => setNotifySms(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                  </label>
                  <label className="flex items-center gap-4 p-4 rounded-xl border border-border-color hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <div className="flex-1"><p className="font-semibold text-heading-color text-sm">Push Notifications</p><p className="text-xs text-foreground">Browser & mobile push alerts</p></div>
                    <input type="checkbox" checked={notifyPush} onChange={e => setNotifyPush(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button onClick={() => { setStep(step - 1); setError(null) }}
              className="px-6 py-3 rounded-xl border border-border-color text-foreground font-semibold hover:bg-white transition-all">
              ← Back
            </button>
          ) : <div />}
          <button onClick={handleNext} disabled={loading}
            className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : step === totalSteps ? 'Complete Setup' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSetup

