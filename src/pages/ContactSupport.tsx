import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'

const ContactSupport = () => {
  const { user } = useAuth()
  const { profile } = useProfile()

  const [form, setForm] = useState({
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const inputClass =
    'w-full px-4 py-3 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-meta-color text-sm'
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-foreground mb-2'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactCards = [
    { label: 'Phone', value: '866-736-0632', href: 'tel:866-736-0632', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Email', value: 'info@247fbs.com', href: 'mailto:info@247fbs.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Hours', value: '24/7 — Always Available', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-600', bg: 'bg-green-100' },
  ]

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
          <h1 className="text-3xl font-extrabold text-heading-color">Contact Support</h1>
          <p className="mt-2 text-foreground">We're here to help — reach out anytime, 24/7.</p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {contactCards.map((c, i) => (
            <div key={c.label} className={`card p-5 text-center animate-fade-in-up ${i === 1 ? 'animate-delay-100' : i === 2 ? 'animate-delay-200' : ''}`}>
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-3`}>
                <svg className={`w-5 h-5 ${c.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} /></svg>
              </div>
              <p className="text-xs text-foreground font-medium uppercase tracking-wide mb-1">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="font-semibold text-heading-color hover:text-primary transition-colors text-sm">{c.value}</a>
              ) : (
                <p className="font-semibold text-heading-color text-sm">{c.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Support form */}
        {submitted ? (
          <div className="card p-10 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-heading-color mb-2">Message Sent!</h2>
            <p className="text-foreground mb-6">Our support team will get back to you as soon as possible.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setSubmitted(false); setForm({ subject: '', message: '' }) }} className="btn-outline text-sm px-6 py-2.5">Send Another</button>
              <Link to="/dashboard" className="btn-primary text-sm px-6 py-2.5">Back to Dashboard</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 animate-fade-in-up animate-delay-200">
            <h2 className="text-lg font-bold text-heading-color mb-1">Send a Message</h2>
            <p className="text-sm text-foreground mb-6">Describe your issue and we'll respond within the hour.</p>

            {/* Pre-filled user info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className={labelClass}>Name</label>
                <input type="text" readOnly value={profile?.first_name ? `${profile.first_name} ${profile.last_name}`.trim() : user?.email?.split('@')[0] ?? ''} className={`${inputClass} opacity-70 cursor-not-allowed`} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" readOnly value={user?.email ?? ''} className={`${inputClass} opacity-70 cursor-not-allowed`} />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Subject *</label>
              <select required value={form.subject} onChange={(e) => set('subject', e.target.value)} className={inputClass}>
                <option value="">Select a topic</option>
                <option value="quote">Quote Inquiry</option>
                <option value="shipment">Shipment Issue</option>
                <option value="billing">Billing Question</option>
                <option value="account">Account Help</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-8">
              <label className={labelClass}>Message *</label>
              <textarea required rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} className={`${inputClass} resize-none`} placeholder="Describe your issue or question..." />
            </div>

            <button type="submit" className="w-full btn-secondary text-base py-4 rounded-xl flex items-center justify-center gap-2 group">
              Send Message
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

export default ContactSupport

