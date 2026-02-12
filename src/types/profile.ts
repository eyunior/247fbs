export type UserType = '' | 'shipper' | 'carrier'

export type EquipmentType = 'dry_van' | 'reefer' | 'flatbed' | 'step_deck'

export interface UserProfile {
  id: string
  user_type: UserType
  profile_completed: boolean

  // Common fields
  first_name: string
  last_name: string
  phone: string
  email: string
  company_name: string
  city: string

  // Carrier-specific fields
  mc_number: string
  dot_number: string
  interstate_permit: string
  ein_ssn_w9: string
  dba: string
  mc_dot_authorities_url: string
  insurance_company: string
  insurance_contact_name: string
  insurance_phone: string
  factoring_company: string
  factoring_contact_name: string
  factoring_phone: string
  num_drivers: number
  num_trucks: number
  equipment_types: EquipmentType[]
  preferred_states: string[]

  // Shipper-specific fields
  shipper_contact_name: string
  shipper_contact_phone: string
  shipper_contact_email: string

  // Notification preferences
  share_location: boolean
  notify_email: boolean
  notify_sms: boolean
  notify_push: boolean

  created_at: string
  updated_at: string
}

export const defaultProfile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> = {
  user_type: '',
  profile_completed: false,
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  company_name: '',
  city: '',
  mc_number: '',
  dot_number: '',
  interstate_permit: '',
  ein_ssn_w9: '',
  dba: '',
  mc_dot_authorities_url: '',
  insurance_company: '',
  insurance_contact_name: '',
  insurance_phone: '',
  factoring_company: '',
  factoring_contact_name: '',
  factoring_phone: '',
  num_drivers: 1,
  num_trucks: 1,
  equipment_types: [],
  preferred_states: [],
  shipper_contact_name: '',
  shipper_contact_phone: '',
  shipper_contact_email: '',
  share_location: false,
  notify_email: true,
  notify_sms: false,
  notify_push: false,
}

