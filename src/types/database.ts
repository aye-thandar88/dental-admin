export type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "partial";

export type GenderType =
  | "male"
  | "female"
  | "other";

export type AccountStatus =
  | "pending"
  | "active"
  | "inactive";

export interface Profile {
  id: string;
  auth_user_id?: string;
  name: string;
  phone: string;
  gender?: GenderType;
  date_of_birth?: string;
  address?: string;
  profile_photo?: string;
  roles: string[];
  status: AccountStatus;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  chief_complaint?: string;
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment: string;
  tooth_number?: string;
  prescription?: string;
  next_visit_date?: string;
  notes?: string;
  appointment_id?: string;
  created_at: string;
}

export interface Billing {
  id: string;
  appointment_id: string;
  opd_fee: number;
  treatment_fee: number;
  medication_fee: number;
  total: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}