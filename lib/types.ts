// Clinic types
export interface Clinic {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logo_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: string;
  max_patients: number;
  max_photos_per_case: number;
  created_at: string;
  updated_at: string;
}

// Patient types
export interface Patient {
  id: string;
  clinic_id: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  medical_history?: string;
  allergies?: string;
  consent_given: boolean;
  created_at: string;
  updated_at: string;
}

// Session types (جلسة العلاج)
export interface Session {
  id: string;
  patient_id: string;
  clinic_id: string;
  session_date: string;
  treatment_type: string;
  treatment_description?: string;
  notes?: string;
  amount_paid: number;
  amount_total: number;
  payment_status: 'pending' | 'paid' | 'partial';
  created_at: string;
  updated_at: string;
}

// Case types
export interface Case {
  id: string;
  patient_id: string;
  clinic_id: string;
  case_title?: string;
  case_type: string;
  description?: string;
  before_after_status: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Photo types
export interface Photo {
  id: string;
  case_id: string;
  session_id?: string;
  photo_url: string;
  cloudinary_id?: string;
  photo_type?: string;
  is_before?: boolean;
  order_index?: number;
  created_at: string;
}

// Design Template types
export interface DesignTemplate {
  id: string;
  clinic_id?: string;
  template_name: string;
  template_type: string;
  platform?: string;
  width?: number;
  height?: number;
  html_template?: string;
  css_template?: string;
  json_config?: string;
  is_default: boolean;
  created_at: string;
}

// Subscription types
export interface Subscription {
  id: string;
  clinic_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_name: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}
