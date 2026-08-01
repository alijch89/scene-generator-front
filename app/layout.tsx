import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

/** Self-hosted-variable font configuration for Persian and Latin content. */
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

/** Site-wide title template and search/social description. */
export const metadata: Metadata = {
  title: {
    default: "سازندهٔ صحنه",
    template: "%s · سازندهٔ صحنه",
  },
  description: "فضایی امن برای ساخت قصه‌های مصور برای کودکان.",
};

/**
 * Inline pre-hydration theme initializer.
 *
 * Security:
 * The string is a static application constant and contains no user input. It
 * reads only the known `sg-theme` local-storage key to avoid a color-scheme flash.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem("sg-theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}})()`;

/**
 * Establishes Persian RTL document semantics and application-wide data providers.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
