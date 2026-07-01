-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clinics table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  logo_url TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  max_patients INT DEFAULT 50,
  max_photos_per_case INT DEFAULT 4,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  medical_history TEXT,
  allergies TEXT,
  consent_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table (جلسات العلاج)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  treatment_type VARCHAR(100) NOT NULL,
  treatment_description TEXT,
  notes TEXT,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  amount_total DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cases table (الحالات قبل وبعد)
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  case_title VARCHAR(255),
  case_type VARCHAR(100),
  description TEXT,
  before_after_status VARCHAR(50) DEFAULT 'before',
  is_public BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  photo_url TEXT NOT NULL,
  cloudinary_id VARCHAR(255),
  photo_type VARCHAR(50),
  is_before BOOLEAN,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Design Templates table
CREATE TABLE design_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  platform VARCHAR(50),
  width INT,
  height INT,
  html_template TEXT,
  css_template TEXT,
  json_config TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated Designs table
CREATE TABLE generated_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES design_templates(id) ON DELETE CASCADE,
  design_url TEXT,
  cloudinary_id VARCHAR(255),
  platform VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_name VARCHAR(100),
  status VARCHAR(50),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50),
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clinics_user_id ON clinics(user_id);
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX idx_sessions_clinic_id ON sessions(clinic_id);
CREATE INDEX idx_cases_patient_id ON cases(patient_id);
CREATE INDEX idx_cases_clinic_id ON cases(clinic_id);
CREATE INDEX idx_photos_case_id ON photos(case_id);
CREATE INDEX idx_subscriptions_clinic_id ON subscriptions(clinic_id);

-- Row Level Security (RLS)
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clinics - Users can view their own clinic"
  ON clinics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Clinics - Users can update their own clinic"
  ON clinics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Patients - View own clinic patients"
  ON patients FOR SELECT
  USING (
    clinic_id IN (
      SELECT id FROM clinics WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Cases - View own clinic cases or public cases"
  ON cases FOR SELECT
  USING (
    clinic_id IN (SELECT id FROM clinics WHERE user_id = auth.uid())
    OR is_public = TRUE
  );

CREATE POLICY "Photos - View own clinic photos or public"
  ON photos FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases 
      WHERE clinic_id IN (SELECT id FROM clinics WHERE user_id = auth.uid())
      OR is_public = TRUE
    )
  );
