import type { Metadata } from 'next';
import { Baloo_Bhaijaan_2, Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const baloo = Baloo_Bhaijaan_2({
  variable: '--font-baloo',
  subsets: ['arabic', 'latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'شهرزاد قصه‌گو',
    template: '%s · شهرزاد قصه‌گو',
  },
  description: 'کودک شما قهرمان قصهٔ خودش می‌شود.',
};

/**
 * Stamps data-theme before first paint so a dark-mode reload never flashes
 * light. Kept inline and tiny on purpose — it has to run before hydration.
 */
const themeScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  document.documentElement.dataset.theme=t;
  if(localStorage.getItem('motion')==='reduce'){document.documentElement.dataset.motion='reduce';}
}catch(e){document.documentElement.dataset.theme='light';}})();
`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className={`${vazirmatn.variable} ${baloo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
