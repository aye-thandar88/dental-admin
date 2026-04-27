import dayjs from "dayjs";

export const appointmentsList: AppointmentDetails[] = [
  {
    date: dayjs().format("YYYY-MM-DD"),
    time: "9:00 AM",
    patient: "Sarah Mitchell",
    treatment: "Root Canal Treatment",
    doctor: "Dr. Jane Doe",
    chair: "Chair 1",
    status: "Completed",
  },
  {
    date: dayjs().format("YYYY-MM-DD"),
    time: "9:30 AM",
    patient: "Michael Chen",
    treatment: "Dental Cleaning & Checkup",
    doctor: "Dr. Robert Smith",
    chair: "Chair 2",
    status: "In Treatment",
  },
  {
    date: dayjs().format("YYYY-MM-DD"),
    time: "10:00 AM",
    patient: "Emily Rodriguez",
    treatment: "Teeth Whitening",
    doctor: "Dr. Jane Doe",
    chair: "Chair 3",
    status: "Checked-in",
  },
  {
    date: dayjs().format("YYYY-MM-DD"),
    time: "10:30 AM",
    patient: "James Wilson",
    treatment: "Crown Fitting",
    doctor: "Dr. Robert Smith",
    chair: "Chair 1",
    status: "Scheduled",
  },
];

export const statusColor: Record<Status, string> = {
  Completed: "green",
  "In Treatment": "orange",
  "Checked-in": "blue",
  Scheduled: "default",
};

export const treatments: Treatment[] = [
  { id: 1, name: "Teeth Cleaning", date: "2026-04-20", dentist: "Dr. Smith" },
  { id: 2, name: "Filling", date: "2026-03-10", dentist: "Dr. Lee" },
];

export const initalPatients: PatientInfo[] = [
  {
    id: 1,
    name: "Michael Chen",
    phone: "12345678",
    gender: "Male",
    lastVisit: "2026-04-20",
  },
];

export const initialAppointments: AppointmentBooking[] = [
  {
    date: dayjs().format("YYYY-MM-DD"),
    time: "10:00",
    patientName: "John Doe",
    reason: "Dental Checkup",
  },
  {
    date: dayjs().format("YYYY-MM-DD"),
    time: "04:04",
    patientName: "Alice Smith",
    reason: "Dental Checkup",
  },
];

export const initialDentists: Dentist[] = [
  {
    id: 1,
    name: "Dr. Jane Doe",
    phone: "88888888",
    specialty: "General Dentistry",
    avatar: "https://i.pravatar.cc/100?img=1",
    status: "In Treatment",
    pending: 4,
    completed: 1,
  },
  {
    id: 2,
    name: "Dr. Robert Smith",
    phone: "88888888",
    specialty: "Oral Surgery",
    avatar: "https://i.pravatar.cc/100?img=2",
    status: "Available",
    pending: 4,
    completed: 0,
  },
];
