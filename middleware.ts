import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Cria supabase no contexto da middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.delete({ name, ...options });
        },
      },
    }
  );

  // Obtém sessão atual
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const isAuth = !!session?.user;

  // Rotas públicas
  const publicRoutes = [
    "/login",
    "/register",
    "/quiz",
    "/quiz/motivation",
    "/forgot-password",
    "/onboarding",
    "/api/auth",
  ];

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // Bloqueia rotas privadas
  if (!isAuth && !isPublic) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Evita usuário logado ir pra login/register
  if (isAuth && ["/login", "/register"].includes(pathname)) {
    const redirectUrl = new URL("/app/home", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
