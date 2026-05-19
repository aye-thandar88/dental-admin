import { supabase } from "../lib/supabase";

export const doctorAvailabilityService = {
  async getByDoctor(doctorId: string) {
    const { data, error } = await supabase
      .from("doctor_availability")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("is_active", true);

    if (error) throw error;

    return data;
  },

  async create(payload: any) {
    const { data, error } = await supabase
      .from("doctor_availability")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(id: string, payload: any) {
    const { data, error } = await supabase
      .from("doctor_availability")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("doctor_availability")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};