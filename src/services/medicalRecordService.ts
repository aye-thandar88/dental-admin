import { supabase } from "../lib/supabase";

interface GetAllParams {
  doctorId?: string;
  patientId?: string;
  appointmentId?: string;
  fromDate?: string;
  toDate?: string;
}

export const medicalRecordService = {
  async getAll(params: GetAllParams) {
    let query = supabase.from("medical_records").select(`
        *,
        patient:profiles!medical_records_patient_id_fkey(id, name, phone),
        doctor:profiles!medical_records_doctor_id_fkey(id, name, phone),
        appointment:appointments(id, appointment_date, appointment_time, status)
      `);

    if (params.appointmentId) query = query.eq("appointment_id", params.appointmentId);
    if (params.doctorId) query = query.eq("doctor_id", params.doctorId);
    if (params.patientId) query = query.eq("patient_id", params.patientId);
    if (params.fromDate) query = query.gte("created_at", params.fromDate);
    if (params.toDate) query = query.lte("created_at", params.toDate);

    const { data = [], error } = await query;

    if (error) throw error;

    return data?.map((record: any) => ({
      id: record.id,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      toothNumber: record.tooth_number || null,
      prescription: record.prescription || null,
      nextVisitDate: record.next_visit_date || null,
      notes: record.notes || null,
      createdAt: record.created_at,
      appointmentId: record.appointment?.id || null,
      appointmentDate: record.appointment?.appointment_date || null,
      appointmentTime: record.appointment?.appointment_time || null,
      appointmentStatus: record.appointment?.status || "pending",
      patientId: record.patient?.id || null,
      patientName: record.patient?.name || "Unknown",
      patientPhone: record.patient?.phone || null,
      doctorId: record.doctor?.id || null,
      doctorName: record.doctor?.name || "Unknown",
      doctorPhone: record.doctor?.phone || null,
    }));
  },

  async create(payload: any) {
    const { data, error } = await supabase
      .from("medical_records")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(id: string, payload: any) {
    const { data, error } = await supabase
      .from("medical_records")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("medical_records")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getPatientHistory(patientId: string) {
    const { data, error } = await supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },

  async getDoctorHistory(doctorId: string) {
    const { data, error } = await supabase
      .from("medical_records")
      .select(
        `*,patient:profiles!medical_records_patient_id_fkey(id, name, phone),
        doctor:profiles!medical_records_doctor_id_fkey(id, name, phone),
        appointment:appointments(id, appointment_date, appointment_time, status)`,
      )
      .eq("doctor_id", doctorId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },
};
