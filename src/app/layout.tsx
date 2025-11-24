import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Auraline Nutrition",
  description: "Sua jornada para uma vida mais saudável",
  manifest: "/manifest.json",
  themeColor: "#00C974",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Auraline Nutrition"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00C974" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-inter antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered:', registration);
                    })
                    .catch((error) => {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
