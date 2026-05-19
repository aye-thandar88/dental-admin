import { supabase } from "../lib/supabase";

export const appointmentService = {
  async getAll(filters?: {
    appointment_date?: string;
    patient_id?: string;
    doctor_id?: string;
  }) {
    let query = supabase.from("appointments").select(`
      *,
      patient:patient_id(id, name, phone),
      doctor:doctor_id(id, name, phone)
    `);

    if (filters?.appointment_date) {
      query = query.eq("appointment_date", filters.appointment_date);
    }

    if (filters?.patient_id) {
      query = query.eq("patient_id", filters.patient_id);
    }

    if (filters?.doctor_id) {
      query = query.eq("doctor_id", filters.doctor_id);
    }

    const { data, error } = await query.order("appointment_date", {
      ascending: false,
    });

    if (error) throw error;

    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patient:patient_id(*),
        doctor:doctor_id(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async create(payload: any) {
    const { data, error } = await supabase
      .from("appointments")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(id: string, payload: any) {
    const { data, error } = await supabase
      .from("appointments")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateStatus(id: string, status: string, reviewedBy?: string) {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) throw error;
  },

  async getByDoctor(doctorId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
      *,
      patient:patient_id(id, name, phone),
      doctor:doctor_id(id, name, phone)`,
      )
      .eq("doctor_id", doctorId);

    if (error) throw error;

    return data;
  },

  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
      *,
      patient:patient_id(id, name, phone),
      doctor:doctor_id(id, name, phone)`,
      )
      .eq("patient_id", patientId);

    if (error) throw error;

    return data;
  },
};
