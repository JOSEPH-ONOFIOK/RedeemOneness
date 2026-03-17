"use server";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { createServiceClient } from "./service";

// ── LOGIN ────────────────────────────────────────────────────
export async function login(formData: FormData) {
  const supabase = await createClient();
  const db = createServiceClient();

  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  const dashboards: Record<string, string> = {
    member: "/member", business: "/business", mentor: "/mentor", admin: "/admin",
  };

  redirect(dashboards[profile?.role ?? "member"]);
}

// ── LOGOUT ───────────────────────────────────────────────────
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ── FORGOT PASSWORD ───────────────────────────────────────────
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = formData.get("origin") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  });
  if (error) return { error: error.message };
  return { success: true };
}

// ── RESET PASSWORD ────────────────────────────────────────────
export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/login");
}

// ── MEMBER SIGNUP ────────────────────────────────────────────
export async function memberSignup(formData: FormData) {
  const supabase = await createClient();
  const db = createServiceClient();

  const email      = formData.get("email")            as string;
  const password   = formData.get("password")         as string;
  const fullName   = formData.get("full_name")        as string;
  const phone      = formData.get("phone")            as string;
  const location   = formData.get("location")         as string;
  const branchCode = formData.get("branch_code")      as string;
  const skills     = (formData.get("skills") as string || "").split(",").map(s => s.trim()).filter(Boolean);
  const sectors    = (formData.get("sector_interests") as string || "").split(",").map(s => s.trim()).filter(Boolean);
  const jobCats    = (formData.get("job_categories") as string || "").split(",").map(s => s.trim()).filter(Boolean);

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError || !user) return { error: signUpError?.message ?? "Signup failed" };

  const { error: profileError } = await db.from("profiles").insert({
    id: user.id, role: "member" as const, full_name: fullName, email, phone, location,
  });
  if (profileError) return { error: profileError.message };

  const { data: branch } = await db
    .from("branches").select("id").eq("code", branchCode).single();

  const { error: memberError } = await db.from("members").insert({
    id: user.id,
    branch_id: branch?.id ?? undefined,
    branch_code: branchCode,
    skills,
    sector_interests: sectors,
    job_categories: jobCats,
  });
  if (memberError) return { error: memberError.message };

  redirect("/member");
}

// ── BUSINESS SIGNUP ──────────────────────────────────────────
export async function businessSignup(formData: FormData) {
  const supabase = await createClient();
  const db = createServiceClient();

  const email       = formData.get("email")        as string;
  const password    = formData.get("password")     as string;
  const companyName = formData.get("company_name") as string;
  const industry    = formData.get("industry")     as string;
  const description = formData.get("description")  as string;
  const location    = formData.get("location")     as string;
  const website     = formData.get("website")      as string;

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError || !user) return { error: signUpError?.message ?? "Signup failed" };

  await db.from("profiles").insert({
    id: user.id, role: "business" as const, full_name: companyName, email, location,
  });

  const { error } = await db.from("businesses").insert({
    id: user.id, company_name: companyName, industry, description, website,
  });
  if (error) return { error: error.message };

  redirect("/business");
}

// ── MENTOR SIGNUP ────────────────────────────────────────────
export async function mentorSignup(formData: FormData) {
  const supabase = await createClient();
  const db = createServiceClient();

  const email            = formData.get("email")             as string;
  const password         = formData.get("password")          as string;
  const fullName         = formData.get("full_name")         as string;
  const phone            = formData.get("phone")             as string;
  const location         = formData.get("location")          as string;
  const sectorExpertise  = formData.get("sector_expertise")  as string;
  const yearsExp         = parseInt(formData.get("years_experience") as string) || null;
  const bio              = formData.get("bio")               as string;
  const preferredContact = formData.get("preferred_contact") as string;

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError || !user) return { error: signUpError?.message ?? "Signup failed" };

  await db.from("profiles").insert({
    id: user.id, role: "mentor" as const, full_name: fullName, email, phone, location,
  });

  const { error } = await db.from("mentors").insert({
    id: user.id, sector_expertise: sectorExpertise,
    years_experience: yearsExp, bio, preferred_contact: preferredContact,
  });
  if (error) return { error: error.message };

  redirect("/mentor");
}

// ── CHURCH / ADMIN SIGNUP ────────────────────────────────────
export async function churchSignup(formData: FormData) {
  const supabase = await createClient();
  const db = createServiceClient();

  const email      = formData.get("email")       as string;
  const password   = formData.get("password")    as string;
  const adminName  = formData.get("admin_name")  as string;
  const churchName = formData.get("church_name") as string;
  const branchName = formData.get("branch_name") as string;
  const city       = formData.get("city")        as string;
  const state      = formData.get("state")       as string;
  const country    = (formData.get("country") as string) || "Nigeria";

  const slug = (churchName.slice(0, 4) + "-" + city.slice(0, 4) + "-" + branchName.slice(0, 4))
    .toUpperCase().replace(/\s+/g, "-");
  const branchCode = slug + "-" + Date.now().toString(36).toUpperCase();

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError || !user) return { error: signUpError?.message ?? "Signup failed" };

  await db.from("profiles").insert({
    id: user.id, role: "admin" as const, full_name: adminName, email,
  });

  const { error } = await db.from("branches").insert({
    church_name: churchName, branch_name: branchName,
    city, state, country, code: branchCode, admin_id: user.id,
  });
  if (error) return { error: error.message };

  redirect("/admin");
}
