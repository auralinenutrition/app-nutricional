// src/lib/supabase/browser.ts
import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabase() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return document.cookie
              .split("; ")
              .map((c) => {
                const [name, value] = c.split("=");
                return { name, value };
              });
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((cookie) => {
              document.cookie = `${cookie.name}=${cookie.value}; path=/; max-age=31536000`;
            });
          },
        },
      }
    );
  }

  return browserClient;
}
