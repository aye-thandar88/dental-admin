import { supabase } from "../lib/supabase";

const getTodayName = (): string =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

export const doctorAvailabilityService = {
  async getTodayAvailable() {
    const { data, error } = await supabase
      .from("doctor_availability")
      .select(`*,doctor:doctor_id(id, name, phone)`)
      .eq("day", getTodayName())
      .eq("is_active", true)
      .order("slot_start", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getTodayAvailableAll() {
    const { data, error } = await supabase
      .from("doctor_availability")
      .select(`*,doctor:doctor_id(id, name, phone)`)
      .eq("day", getTodayName())
      .order("slot_start", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

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

  async saveWeeklySchedule(doctorId: string, week: Record<string, boolean>) {
    const { error: deleteError } = await supabase
      .from("doctor_availability")
      .delete()
      .eq("doctor_id", doctorId);

    if (deleteError) throw deleteError;

    const payload = Object.entries(week).map(([day, is_active]) => ({
      doctor_id: doctorId,
      day,
      is_active,
      slot_start: "09:00:00",
      slot_end: "17:00:00",
    }));

    const { data, error } = await supabase
      .from("doctor_availability")
      .insert(payload)
      .select();

    if (error) throw error;

    return data;
  },
};
