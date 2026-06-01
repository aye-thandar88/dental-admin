export {};

declare global {
  interface AppointmentBooking {
    date: string;
    time: string;
    patientName: string;
    reason: string;
  }

  interface AppointmentDetails {
    date: string;
    time: string;
    patient: string;
    treatment: string;
    doctor: string;
    chair: string;
    status: Status;
  }

  type Status = "Completed" | "In Treatment" | "Checked-in" | "Scheduled";

  interface AppointmentStatusItem {
    title: string;
    count: number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }

  interface Dentist {
    id: number;
    name: string;
    phone: string;
    specialty: string;
    avatar: string;
    status: DentistStatus;
    pending: number;
    completed: number;
  }

  type DentistStatus = "Available" | "In Treatment";

  interface PatientInfo {
    id: number;
    name: string;
    phone: string;
    gender: string;
    address?: string;
    lastVisit: string;
  }

  interface Treatment {
    id: number;
    name: string;
    date: string;
    dentist: string;
  }
  type GenderType = "male" | "female" | "other";

  type Role = "doctor" | "staff" | "patient" | "admin";

  type ProfileStatus = "pending" | "approved" | "rejected";

  interface Profile {
    id: string;
    auth_user_id: string | null;
    name: string;
    phone: string;
    gender?: GenderType;
    date_of_birth?: string;
    address?: string;
    profile_photo?: string;
    roles: Role[];
    status: ProfileStatus;
    created_at: string;
    updated_at: string;
  }

  interface CreateUserPayload {
    name: string;
    phone: string;
    password: string;
    roles?: Role[];
    gender?: GenderType;
    date_of_birth?: string;
    address?: string;
    profile_photo?: string;
    status?: ProfileStatus;
  }

  interface MedicalRecord {
    id: string;
    patientId: string;
    doctorId: string;
    patientName: string;
    doctorName: string;
    diagnosis: string;
    treatment: string;
    toothNumber?: string;
    prescription?: string;
    nextVisitDate?: string;
    notes?: string;
    appointmentId?: string;
    createdAt: string;
  }

  type PaymentStatus = "unpaid" | "paid";

  interface Billing {
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
    appointments?: {
      id: string;
      appointment_date: string;
      appointment_time: string;
      patient?: {
        name: string;
        phone: string;
      };
      doctor?: {
        name: string;
      };
    };
  }

  interface DoctorAvailability {
    id?: string;
    doctor_id: string;
    day: string;
    slot_start: string;
    slot_end: string;
    is_active: boolean;
  }
}
