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
}
