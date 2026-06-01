import { supabase } from "../lib/supabase";

export const profileService = {
  async getMyProfile(): Promise<Profile | null> {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.warn("Failed to get user:", userError?.message);
        return null;
      }

      console.log("Fetching profile for user ID:", userData.user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", userData.user.id)
        .single();

      // If profile doesn't exist, return null (don't throw)
      if (error?.code === "PGRST116") {
        console.warn(
          "Profile not found for user, will be created on first access",
        );
        return null;
      }

      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("getMyProfile error:", error);
      // Don't rethrow - let the app continue without profile
      return null;
    }
  },

  async createProfile(payload: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  // async createProfile(payload: Partial<Profile>): Promise<Profile> {
  //   const { data, error } = await supabase.functions.invoke("create-user", {
  //     body: { ...payload, password: "Password@123" },
  //   });

  //   if (error) throw new Error(error.message);
  //   if (data?.error) throw new Error(data.error);

  //   return data;
  // },

  async updateProfile(id: string, payload: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProfilesByRole(role: Role) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .contains("roles", [role]);

    if (error) throw error;

    return data;
  },

  async approveProfile(id: string) {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) throw error;

    const { error: fnError } = await supabase.functions.invoke(
      "create-approved-user",
      {
        body: { profileId: id },
      },
    );

    if (fnError) throw fnError;

    return true;
  },

  async getByDoctor(doctorId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", doctorId);

    if (error) throw error;

    return data;
  },

  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", patientId);

    if (error) throw error;

    return data;
  },

  async getPatientByPhoneNo(phoneNo: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("phone", phoneNo)
      .contains("roles", ["patient"]);

    if (error) throw error;

    return data;
  },

  async getPatients() {
    return await this.getProfilesByRole("patient");
  },

  async getDoctors() {
    return await this.getProfilesByRole("doctor");
  },

  async getStaffs() {
    return await this.getProfilesByRole("staff");
  },

  async getAdmins() {
    return await this.getProfilesByRole("admin");
  },
};
