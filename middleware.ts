import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require auth and which role they belong to
const PROTECTED: Record<string, string[]> = {
  "/member":   ["member"],
  "/business": ["business"],
  "/mentor":   ["mentor"],
  "/admin":    ["admin"],
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Check protected route access
  for (const [prefix, roles] of Object.entries(PROTECTED)) {
    if (path.startsWith(prefix)) {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // Check role via profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || !roles.includes(profile.role)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      break;
    }
  }

  // Redirect logged-in users away from login/signup
  if (user && (path === "/login" || path === "/signup")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const dashboards: Record<string, string> = {
      member:   "/member",
      business: "/business",
      mentor:   "/mentor",
      admin:    "/admin",
    };

    if (profile?.role) {
      return NextResponse.redirect(
        new URL(dashboards[profile.role] ?? "/", request.url)
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
