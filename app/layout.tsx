import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseScript } from '@/components/AdSenseScript';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Péages d\'Autoroute 2026 : Calculateur de Tarifs & Itinéraires | Ododex',
  description: 'Calculez le prix exact des péages en France pour votre trajet (Classe 1, 2 et moto). Tout savoir sur le péage sans barrière en flux libre (A13, A79) et le badge télépéage.',
  metadataBase: new URL('https://ododex.com'),
  alternates: {
    canonical: absoluteUrl('/'),
  },
  icons: {
    icon: '/fr/peages/icon.svg',
  },
  openGraph: {
    title: 'Péages d\'Autoroute 2026 : Calculateur de Tarifs & Itinéraires | Ododex',
    description: 'Calculez vos frais de péage et comparez avec les itinéraires gratuits sans péage en France.',
    url: absoluteUrl('/'),
    siteName: 'Ododex',
    locale: 'fr_FR',
    type: 'website',
  },
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
