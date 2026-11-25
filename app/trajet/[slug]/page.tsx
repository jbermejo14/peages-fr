import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllTrajets,
  getTrajetById,
  formatPrice,
  formatDurationHours
} from '@/lib/peages';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { absoluteUrl } from '@/lib/site';
import { seoOpenGraph, seoTrajetDescription, seoTrajetTitle } from '@/lib/seo';
import {
  Coins,
  Clock,
  Compass,
  Fuel,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Radar
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const trajets = getAllTrajets();
  return trajets.map((t) => ({
    slug: t.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trajet = getTrajetById(slug);
  if (!trajet) return {};

  const title = seoTrajetTitle(trajet.departNom, trajet.arriveeNom, formatPrice(trajet.peageClasse1));
  const description = seoTrajetDescription({
    depart: trajet.departNom,
    arrivee: trajet.arriveeNom,
    distanceKm: trajet.distanceKm,
    class1: formatPrice(trajet.peageClasse1),
    class2: formatPrice(trajet.peageClasse2),
    class5: formatPrice(trajet.peageClasse5),
  });

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/trajet/${trajet.id}`),
    },
    openGraph: seoOpenGraph(title, description, `/trajet/${trajet.id}`),
  };
}

export default async function TrajetPage({ params }: Props) {
  const { slug } = await params;
  const trajet = getTrajetById(slug);
  if (!trajet) notFound();

  const otherTrajets = getAllTrajets().filter((t) => t.id !== trajet.id).slice(0, 4);

  const tripSchema = {
    '@context': 'https://schema.org',
    '@type': 'Trip',
    name: `Trajet autoroutier ${trajet.departNom} - ${trajet.arriveeNom}`,
    description: trajet.resume,
    distance: `${trajet.distanceKm} km`,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: trajet.departNom,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: trajet.arriveeNom,
        },
      ],
    },
  };

  const coutCarburantEstime = Number((trajet.carburantEstimeL * 1.78).toFixed(2));
  const budgetTotalAller = Number((trajet.peageClasse1 + coutCarburantEstime).toFixed(2));
  const budgetTotalAR = Number((budgetTotalAller * 2).toFixed(2));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
      />

      <div className="space-y-10">
        {/* Fil d'Ariane */}
        <Breadcrumbs
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Trajets', url: '/#trajets' },
            { name: `${trajet.departNom} - ${trajet.arriveeNom}`, url: `/trajet/${trajet.id}` },
          ]}
        />

        {/* En-tête Trajet */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Compass className="w-4 h-4" />
            {trajet.autoroutes.join(' · ')} · {trajet.distanceKm} km
          </div>

          <h1 className="text-3xl font-extrabold text-fg tracking-tight">
            Tarif du péage {trajet.departNom} ↔ {trajet.arriveeNom} (2026)
          </h1>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {trajet.resume} Retrouvez le détail des tarifs par classe de véhicule, le coût en carburant, les gares de péage traversées et l’itinéraire alternatif gratuit sans péage.
          </p>
        </div>

        {/* Alerte Flux Libre si présent */}
        {trajet.fluxLibre && (
          <div className="p-4 rounded-xl border border-warning-line bg-warning-soft text-warning space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Attention : tronçon en FLUX LIBRE (sans barrière de péage)</span>
            </div>
            <p className="text-xs leading-relaxed">
              {trajet.fluxLibreDetails || "Ce trajet ne comporte pas de barrière d'arrêt physique. Vous devez vous acquitter du paiement en ligne dans les 72 heures sous peine d'une indemnité forfaitaire de 90 €."}
            </p>
          </div>
        )}

        {/* Grille des tarifs par classe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 border-line bg-surface text-center">
            <span className="text-xs text-secondary block font-semibold uppercase tracking-wider">
              🚗 Classe 1 (Voiture)
            </span>
            <strong className="text-3xl font-extrabold text-accent block mt-2">
              {formatPrice(trajet.peageClasse1)}
            </strong>
            <span className="text-[11px] text-muted mt-1 block">
              Aller simple · {formatPrice(trajet.peageClasse1 * 2)} A/R
            </span>
            <span className="text-[10px] text-secondary mt-2 block border-t border-line/60 pt-2">
              Hauteur ≤ 2 m, PTAC ≤ 3,5 t
            </span>
          </div>

          <div className="card p-5 border-line bg-surface text-center">
            <span className="text-xs text-secondary block font-semibold uppercase tracking-wider">
              🚐 Classe 2 (Van / Camping-car)
            </span>
            <strong className="text-3xl font-extrabold text-fg block mt-2">
              {formatPrice(trajet.peageClasse2)}
            </strong>
            <span className="text-[11px] text-muted mt-1 block">
              Aller simple · {formatPrice(trajet.peageClasse2 * 2)} A/R
            </span>
            <span className="text-[10px] text-secondary mt-2 block border-t border-line/60 pt-2">
              Hauteur 2 m à 3 m, PTAC ≤ 3,5 t
            </span>
          </div>

          <div className="card p-5 border-line bg-surface text-center">
            <span className="text-xs text-secondary block font-semibold uppercase tracking-wider">
              🏍️ Classe 5 (Moto)
            </span>
            <strong className="text-3xl font-extrabold text-positive block mt-2">
              {formatPrice(trajet.peageClasse5)}
            </strong>
            <span className="text-[11px] text-muted mt-1 block">
              Aller simple · {formatPrice(trajet.peageClasse5 * 2)} A/R
            </span>
            <span className="text-[10px] text-secondary mt-2 block border-t border-line/60 pt-2">
              Motos, triporteurs, side-cars
            </span>
          </div>
        </div>

        {/* Publicité 1 */}
        <AdSlot />

        {/* Budget global et détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 border-line bg-surface space-y-3">
            <h2 className="text-base font-bold text-fg flex items-center gap-2">
              <Fuel className="w-5 h-5 text-accent" />
              Budget total estimé du trajet (Voiture)
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-line/60">
                <span className="text-secondary">Péage autoroute (Aller simple)</span>
                <strong className="text-fg">{formatPrice(trajet.peageClasse1)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-line/60">
                <span className="text-secondary">Carburant estimé (~{trajet.carburantEstimeL} L)</span>
                <strong className="text-fg">{formatPrice(coutCarburantEstime)}</strong>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm">
                <span className="text-fg">Total Aller simple :</span>
                <span className="text-accent">{formatPrice(budgetTotalAller)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm bg-elevated px-2 rounded-lg">
                <span className="text-fg">Total Aller-Retour :</span>
                <span className="text-positive">{formatPrice(budgetTotalAR)}</span>
              </div>
            </div>
          </div>

          <div className="card p-5 border-line bg-surface space-y-3">
            <h2 className="text-base font-bold text-fg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Informations sur l’axe autoroutier
            </h2>
            <div className="space-y-2 text-xs text-secondary leading-relaxed">
              <p>
                • <strong>Autoroutes empruntées :</strong> {trajet.autoroutes.join(', ')}
              </p>
              <p>
                • <strong>Sociétés concessionnaires :</strong> {trajet.concessionnaires.join(', ')}
              </p>
              <p>
                • <strong>Gares de péage principales :</strong> {trajet.garesPeage.join(', ')}
              </p>
              <p>
                • <strong>Vérifier les radars automatiques :</strong> Consultez les emplacements des radars sur votre route sur notre service{' '}
                <a href="/fr/radars" className="text-accent underline font-semibold">
                  Ododex Radars France
                </a>.
              </p>
            </div>
          </div>
        </div>

        {/* Comparatif sans péage (Route Nationale) */}
        <section className="card p-6 border-line bg-surface space-y-4">
          <h2 className="text-lg font-bold text-fg flex items-center gap-2">
            <Coins className="w-5 h-5 text-positive" />
            L’alternative gratuite sans péage : combien économisez-vous ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-elevated rounded-xl border border-line space-y-2">
              <span className="font-bold text-accent text-sm block">Option 1 : Par l’autoroute payante</span>
              <p className="text-secondary leading-relaxed">
                Durée : <strong>{formatDurationHours(trajet.dureeAutorouteMinutes)}</strong>. Vitesse maximale de 130 km/h, sécurité optimale et moins de fatigue au volant.
              </p>
              <div className="text-sm font-extrabold text-fg pt-1">
                Coût du péage : {formatPrice(trajet.peageClasse1)}
              </div>
            </div>

            <div className="p-4 bg-elevated rounded-xl border border-positive-line/50 bg-positive-soft/30 space-y-2">
              <span className="font-bold text-positive text-sm block">Option 2 : Sans péage (Nationale / Départementale)</span>
              <p className="text-secondary leading-relaxed">
                Durée : <strong>{formatDurationHours(trajet.dureeSansPeageMinutes)}</strong>. Traversée de communes, ronds-points et vitesse limitée à 80 ou 110 km/h.
              </p>
              <div className="text-xs text-secondary">
                Itinéraire conseillé : <strong>{trajet.itineraireSansPeage}</strong>
              </div>
              <div className="text-sm font-extrabold text-positive pt-1">
                Économie réalisée : {formatPrice(trajet.peageClasse1)} (pour {formatDurationHours(trajet.dureeSansPeageMinutes - trajet.dureeAutorouteMinutes)} de route en plus)
              </div>
            </div>
          </div>
        </section>

        {/* Publicité 2 */}
        <AdSlot />

        {/* Autres trajets populaires */}
        {otherTrajets.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-fg">
              Autres trajets d’autoroute fréquemment recherchés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherTrajets.map((t) => (
                <Link
                  key={t.id}
                  href={`/trajet/${t.id}`}
                  className="card p-3 border-line bg-surface hover:border-accent/60 transition-colors flex items-center justify-between text-xs group"
                >
                  <div>
                    <span className="font-bold text-fg block group-hover:text-accent transition-colors">
                      {t.departNom} → {t.arriveeNom}
                    </span>
                    <span className="text-[11px] text-muted">
                      {t.autoroutes.join(' · ')} · {t.distanceKm} km
                    </span>
                  </div>
                  <span className="font-extrabold text-accent text-sm">
                    {formatPrice(t.peageClasse1)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
