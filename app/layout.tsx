/**
 * @file layout.tsx
 * @description Defines Persian RTL document metadata, the self-hosted font preload, pre-hydration theme state, and global providers.
 */

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

const SITE_TITLE = 'شهرزاد قصه‌گو';
const SITE_DESCRIPTION = 'کودک شما قهرمان قصهٔ خودش می‌شود.';

/** A deployment-owned origin is the only safe base for absolute social URLs. */
function getSiteOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;

  if (!value) return undefined;

  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

const siteOrigin = getSiteOrigin();
const socialImage = siteOrigin ? new URL('/og.png', siteOrigin) : undefined;

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: siteOrigin } : {}),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ...(socialImage
      ? {
          images: [
            {
              url: socialImage,
              width: 1731,
              height: 909,
              alt: 'کتاب قصهٔ جادویی شهرزاد قصه‌گو',
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
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

/** Root layout that establishes the HTML document and global client providers. */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Every surface renders Persian body copy, so the arabic cut of
            Vazirmatn is on the critical path of the first paint everywhere.
            The latin cuts and the display face are left to @font-face to fetch
            on demand; the layouts that lead with display type pull theirs in
            through DisplayFontPreload. */}
        <link
          rel="preload"
          href="/fonts/vazirmatn-v16-arabic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
