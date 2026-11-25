import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllAutoroutes,
  getAutorouteByCode,
  getAllTrajets,
  formatPrice
} from '@/lib/peages';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { absoluteUrl } from '@/lib/site';
import { seoAutorouteDescription, seoAutorouteTitle, seoOpenGraph, seoTwitter } from '@/lib/seo';
import {
  Compass,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface Props {
  params: Promise<{ code: string }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const autoroutes = getAllAutoroutes();
  return autoroutes.map((a) => ({
    code: a.code,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const autoroute = getAutorouteByCode(code);
  if (!autoroute) return {};

  const codeUpper = autoroute.code.toUpperCase();
  const title = seoAutorouteTitle(codeUpper);
  const description = seoAutorouteDescription(autoroute.descriptionSeo);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/autoroute/${autoroute.code}`),
    },
    openGraph: seoOpenGraph(title, description, `/autoroute/${autoroute.code}`),
    twitter: seoTwitter(title, description),
  };
}

export default async function AutoroutePage({ params }: Props) {
  const { code } = await params;
  const autoroute = getAutorouteByCode(code);
  if (!autoroute) notFound();

  const codeUpper = autoroute.code.toUpperCase();
  const allTrajets = getAllTrajets();
  const trajetsAssocies = allTrajets.filter((t) =>
    t.autoroutes.some((a) => a.toUpperCase() === codeUpper)
  );

  return (
    <div className="space-y-10">
      {/* Fil d'Ariane */}
      <Breadcrumbs
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Autoroutes', url: '/#autoroutes' },
          { name: codeUpper, url: `/autoroute/${autoroute.code}` },
        ]}
      />

      {/* En-tête */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          Axe autoroutier français · {autoroute.longueurKm} km
        </div>

        <h1 className="text-3xl font-extrabold text-fg tracking-tight">
          Péages et tarifs de l’autoroute {autoroute.nom}
        </h1>

        <p className="text-sm text-secondary leading-relaxed max-w-3xl">
          {autoroute.description}
        </p>
      </div>

      {/* Alerte Flux Libre si l'autoroute est A13 ou A79 */}
      {autoroute.fluxLibre && (
        <div className="p-4 rounded-xl border border-warning-line bg-warning-soft text-warning space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Autoroute en FLUX LIBRE (Péage sans barrière)</span>
          </div>
          <p className="text-xs leading-relaxed">
            Cette autoroute fonctionne sans barrière d’arrêt. Des portiques automatiques photographient les plaques d’immatriculation. Vous devez régler votre trajet dans les <strong>72 heures</strong> sur le site de l’exploitant ou utiliser un badge de télépéage.
          </p>
        </div>
      )}

      {/* Fiche d'identité de l'autoroute */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 border-line bg-surface text-center">
          <span className="text-xs text-secondary block font-medium">Longueur</span>
          <strong className="text-2xl font-extrabold text-fg block mt-1">
            {autoroute.longueurKm} km
          </strong>
          <span className="text-[11px] text-muted mt-1 block">Axe concédé</span>
        </div>

        <div className="card p-4 border-line bg-surface text-center">
          <span className="text-xs text-secondary block font-medium">Concessionnaire</span>
          <strong className="text-xl font-extrabold text-accent block mt-1">
            {autoroute.concessionnaire}
          </strong>
          <span className="text-[11px] text-muted mt-1 block">Gestionnaire principal</span>
        </div>

        <div className="card p-4 border-line bg-surface text-center">
          <span className="text-xs text-secondary block font-medium">Tarif moyen indicatif</span>
          <strong className="text-2xl font-extrabold text-positive block mt-1">
            {formatPrice(autoroute.tarifMoyenClasse1)}
          </strong>
          <span className="text-[11px] text-muted mt-1 block">Trajet complet Classe 1</span>
        </div>

        <div className="card p-4 border-line bg-surface text-center">
          <span className="text-xs text-secondary block font-medium">Système de péage</span>
          <strong className="text-sm font-bold text-fg block mt-2">
            {autoroute.fluxLibre ? 'Flux libre' : 'Barrières physiques'}
          </strong>
          <span className="text-[11px] text-muted mt-0.5 block">{autoroute.systemePeage}</span>
        </div>
      </div>

      {/* Villes desservies */}
      <div className="card p-5 border-line bg-surface space-y-2">
        <h2 className="text-xs font-bold text-fg uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-accent" />
          Principales agglomérations reliées par l’autoroute {codeUpper} :
        </h2>
        <p className="text-sm text-secondary font-medium">
          {autoroute.villes}
        </p>
      </div>

      {/* Publicité 1 */}
      <AdSlot />

      {/* Trajets majeurs empruntant cette autoroute */}
      {trajetsAssocies.length > 0 && (
        <section className="space-y-4">
          <div className="border-b border-line pb-2">
            <h2 className="text-xl font-bold text-fg flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent" />
              Trajets fréquents empruntant l’autoroute {codeUpper}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Tarifs détaillés, durée et itinéraire alternatif gratuit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trajetsAssocies.map((t) => (
              <Link
                key={t.id}
                href={`/trajet/${t.id}`}
                className="card p-4 border-line bg-surface hover:border-accent/60 transition-colors flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="font-bold text-fg block text-sm group-hover:text-accent transition-colors">
                    {t.departNom} ↔ {t.arriveeNom}
                  </span>
                  <span className="text-[11px] text-muted">
                    {t.distanceKm} km · Péage : <strong>{formatPrice(t.peageClasse1)}</strong>
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-fg transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Conseils pratiques autoroute */}
      <section className="card p-6 border-line bg-surface space-y-3">
        <h2 className="text-base font-bold text-fg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          Conseils pour rouler sur l’autoroute {codeUpper}
        </h2>
        <div className="text-xs text-secondary space-y-2 leading-relaxed">
          <p>
            • <strong>Télépéage :</strong> Toutes les gares de péage de l’axe {codeUpper} disposent de voies réservées « t 30 » permettant de franchir le péage sans marquer l’arrêt.
          </p>
          <p>
            • <strong>Carburant :</strong> Le carburant sur les aires de services de l’autoroute est en moyenne 15 % plus cher que dans les stations hors autoroute. Consultez notre comparateur de carburants pour faire le plein avant de partir.
          </p>
          <p>
            • <strong>Sécurité & Radars :</strong> Respectez scrupuleusement les limitations de vitesse (130 km/h par temps sec, 110 km/h par temps de pluie).
          </p>
        </div>
      </section>
    </div>
  );
}
