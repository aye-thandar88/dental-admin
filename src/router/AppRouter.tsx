import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Appointment from "../pages/appointment/Appointment";
import Login from "../pages/login/Login";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import Schedule from "../pages/appointment/Schedule";
import Patient from "../pages/patient/Patient";
import PatientDetail from "../pages/patient/PatientDetail";
import Doctor from "../pages/doctor/Doctor";
import DoctorDetail from "../pages/doctor/DoctorDetail";
import MedicalRecord from "../pages/medicalRecord/MedicalRecord";
import Billing from "../pages/bill/Billing";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/appointment/:date" element={<Schedule />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/doctor/:id" element={<DoctorDetail />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/patient/:id" element={<PatientDetail />} />
            <Route path="/medical-record" element={<MedicalRecord />} />
            <Route path="/billing" element={<Billing  />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
