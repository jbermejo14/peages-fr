import React from 'react';
import Link from 'next/link';
import { getAdSenseClient } from './AdSenseScript';

export function Footer() {
  const hasAdsense = !!getAdSenseClient();

  return (
    <footer className="border-t border-line bg-surface mt-16 py-10 text-xs text-secondary">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Bannière Télépéage Affiliation */}
        <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
              Gagnez du temps aux péages
            </span>
            <p className="text-xs text-fg font-medium mt-0.5">
              Passez sans vous arrêter dans les voies réservées 30 km/h grâce au badge de télépéage Liber-t (Ulys / Bip&Go). Formule sans engagement : 0 € les mois où vous ne l’utilisez pas !
            </p>
          </div>
          <Link
            href="/guide/badge-telepeage-ulys-bipandgo-comparatif"
            className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all text-center shrink-0"
          >
            Choisir mon badge →
          </Link>
        </div>

        {/* Liens transversaux des services Ododex France */}
        <div className="pt-2 border-t border-line/60">
          <p className="font-semibold text-fg mb-2">Tous les services automobiles Ododex en France :</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <a href="/fr" className="hover:text-fg hover:underline">
              ⛽ Prix des carburants
            </a>
            <a href="/fr/zfe" className="hover:text-fg hover:underline">
              🌱 ZFE & Crit’Air
            </a>
            <a href="/fr/carte-grise" className="hover:text-fg hover:underline">
              📄 Carte grise (simulateur taxe)
            </a>
            <a href="/fr/radars" className="hover:text-fg hover:underline">
              📷 Radars & amendes
            </a>
            <a href="/fr/controle-technique" className="hover:text-fg hover:underline">
              🔍 Contrôle technique & centres
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg">Ododex</span>
            <span>·</span>
            <span>Calculateur de tarifs de péages et guide des autoroutes françaises</span>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/fr" className="hover:text-fg hover:underline">
              Accueil Ododex
            </a>
            <Link href="/mentions-legales" className="hover:text-fg hover:underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-fg hover:underline">
              Confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-fg hover:underline">
              Cookies
            </Link>
          </nav>
        </div>

        <p className="text-muted leading-relaxed">
          Les tarifs de référence sont fixés par l’État et les sociétés concessionnaires d’autoroutes (APRR, AREA, ASF, Cofiroute, Escota, Sanef, SAPN, ATMB).
          Ododex est un portail indépendant d’information pratique non affilié aux sociétés concessionnaires d’autoroutes ni à l’ASFA.
        </p>

        {hasAdsense && (
          <p className="text-muted">
            Des annonces personnalisées peuvent être affichées conformément à notre politique de cookies et au cadre TCF v2.2.
          </p>
        )}
      </div>
    </footer>
  );
}
