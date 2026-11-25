import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseScript } from '@/components/AdSenseScript';
import { absoluteUrl } from '@/lib/site';
import { SEO_HOME_DESCRIPTION, seoHomeTitle, seoOpenGraph, seoTwitter } from '@/lib/seo';

const HOME_TITLE = seoHomeTitle();

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: SEO_HOME_DESCRIPTION,
  metadataBase: new URL('https://ododex.com'),
  alternates: {
    canonical: absoluteUrl('/'),
  },
  icons: {
    icon: '/fr/peages/icon.svg',
  },
  openGraph: seoOpenGraph(HOME_TITLE, SEO_HOME_DESCRIPTION, '/'),
  twitter: seoTwitter(HOME_TITLE, SEO_HOME_DESCRIPTION),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ododex-theme');
                  var prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        <AdSenseScript />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-fg font-sans antialiased">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
