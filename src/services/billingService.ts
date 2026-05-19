import { supabase } from "../lib/supabase";

export const billingService = {
  async getAll() {
    const { data, error } = await supabase
      .from("billing")
      .select(
        `
        *,
        appointments (
          id,
          appointment_date,
          appointment_time,
          status,
          patient:profiles!appointments_patient_id_fkey (
            id,
            name,
            phone
          ),
          doctor:profiles!appointments_doctor_id_fkey (
            id,
            name
          )
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },

  async create(payload: Partial<Billing>) {
    const { data, error } = await supabase
      .from("billing")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(id: string, payload: Partial<Billing>) {
    const { data, error } = await supabase
      .from("billing")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async markAsPaid(id: string, paymentMethod: string) {
    const { data, error } = await supabase
      .from("billing")
      .update({
        payment_status: "paid",
        payment_method: paymentMethod,
        paid_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async getBillingByAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from("billing")
      .select("*")
      .eq("appointment_id", appointmentId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  async deleteBilling(id: string) {
    const { error } = await supabase.from("billing").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return true;
  },

  async getBillingSummary() {
    const { data, error } = await supabase.from("billing").select("*");

    if (error) throw new Error(error.message);

    const totalRevenue = data
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + Number(b.total), 0);

    const unpaidAmount = data
      .filter((b) => b.payment_status === "unpaid")
      .reduce((sum, b) => sum + Number(b.total), 0);

    return {
      totalBills: data.length,
      totalRevenue,
      unpaidAmount,
      paidBills: data.filter((b) => b.payment_status === "paid").length,
      unpaidBills: data.filter((b) => b.payment_status === "unpaid").length,
    };
  },
};
