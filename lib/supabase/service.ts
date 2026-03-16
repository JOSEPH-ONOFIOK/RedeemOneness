import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS, server-side only, never expose to browser
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServiceClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
