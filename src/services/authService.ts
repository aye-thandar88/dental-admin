import { supabase } from "../lib/supabase";

export const buildPhoneEmail = (phone: string) => `${phone}@themoon.com`;

export const authService = {
  async login(phone: string, password: string) {
    const email = buildPhoneEmail(phone);
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
  },

  onAuthStateChange(
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async createUser(payload: {
    name: string;
    phone: string;
    password: string;
    role: "patient" | "doctor" | "staff" | "admin";
  }) {
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: payload,
    });

    if (error) throw new Error(error.message);
    return data.profile;
  },
};
