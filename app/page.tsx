import React from 'react';
import Link from 'next/link';
import {
  Coins,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Zap
} from 'lucide-react';
import { getAllTrajets, getAllAutoroutes, formatPrice, formatDurationHours } from '@/lib/peages';
import { getAllGuides } from '@/lib/guides';
import { TollCalculator } from '@/components/TollCalculator';
import { AdSlot } from '@/components/AdSlot';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function HomePage() {
  const trajets = getAllTrajets();
  const autoroutes = getAllAutoroutes();
  const guides = getAllGuides();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ododex Péages d\'Autoroute',
    url: absoluteUrl('/'),
    description: 'Calculateur des tarifs de péages autoroutiers en France, comparateur d’itinéraires gratuits et guide du péage sans barrière en flux libre.'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Comment fonctionne le péage en flux libre sur l’A13 et l’A79 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sur les autoroutes en flux libre (sans barrière physique), des portiques photographient les plaques d’immatriculation. Les conducteurs sans badge télépéage disposent de 72 heures pour payer en ligne sur sanef.com ou aliae.com afin d’éviter une indemnité forfaitaire de 90 €.'
        }
      },
      {
        '@type': 'Question',
        name: 'Quel est le prix moyen d’un péage d’autoroute en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le tarif moyen des autoroutes concédées en France est d’environ 8 à 9 centimes par kilomètre pour une voiture particulière (Classe 1), avec des variations selon les concessionnaires (APRR, Sanef, VINCI Autoroutes).'
        }
      },
      {
        '@type': 'Question',
        name: 'Un coffre de toit fait-il passer une voiture en Classe 2 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Non. Selon la réglementation en vigueur, les accessoires sur le toit (coffre, vélos) ne doivent pas être comptés dans la hauteur. Si la barrière automatique vous surclasse en Classe 2, appuyez sur le bouton d’assistance pour rectification.'
        }
      },
      {
        '@type': 'Question',
        name: 'Comment économiser sur le péage grâce au fractionnement de trajet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En raison du barème tarifaire non linéaire des concessionnaires, sortir et re-rentrer immédiatement au même échangeur (la technique du foisonnement) permet d’économiser entre 10 % et 25 % sur certains longs trajets.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Coins className="w-4 h-4" />
            Tarifs autoroutiers 2026 · Concessions françaises
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">
            Péages d’Autoroute en France : Calculateur de Tarifs & Itinéraires
          </h1>

          <p className="text-base text-secondary leading-relaxed">
            Calculez le coût exact de vos péages (voiture, utilitaire, moto), comparez le temps gagné face aux routes nationales gratuites et découvrez comment payer les nouveaux péages en flux libre sans barrière.
          </p>
        </div>

        {/* Calculateur de péage */}
        <section aria-label="Calculateur de péage">
          <TollCalculator />
        </section>

        {/* Publicité 1 */}
        <AdSlot />

        {/* Encadré d'information Péage Flux Libre */}
        <div className="p-5 rounded-2xl border border-warning-line/60 bg-warning-soft/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Nouveau en France : le péage sans barrière (Flux Libre)
            </span>
            <p className="text-xs text-fg leading-relaxed">
              Sur l’<strong>A13 / A14 (Paris-Normandie)</strong> et l’<strong>A79</strong>, vous ne vous arrêtez plus pour payer. Vous devez régler votre trajet en ligne sous <strong>72 heures</strong> pour éviter une amende de 90 €.
            </p>
          </div>
          <Link
            href="/guide/peage-flux-libre-sans-barriere-comment-payer"
            className="px-4 py-2 rounded-lg bg-warning text-white text-xs font-bold hover:bg-warning/90 transition-all text-center shrink-0"
          >
            Guide du paiement sous 72h →
          </Link>
        </div>

        {/* Les 20 Grands Trajets les plus recherchés */}
        <section className="space-y-6">
          <div className="border-b border-line pb-3">
            <h2 className="text-2xl font-bold text-fg flex items-center gap-2">
              <Compass className="w-6 h-6 text-accent" />
              Prix des péages sur les trajets majeurs en France
            </h2>
            <p className="text-xs text-secondary mt-1">
              Consultez les tarifs pour les trajets autoroutiers les plus fréquentés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trajets.map((trajet) => (
              <Link
                key={trajet.id}
                href={`/trajet/${trajet.id}`}
                className="card p-4 border-line bg-surface hover:border-accent/60 transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-elevated border border-line text-fg">
                      {trajet.autoroutes.join(' · ')}
                    </span>
                    <span className="text-base font-extrabold text-accent">
                      {formatPrice(trajet.peageClasse1)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-fg group-hover:text-accent transition-colors">
                    {trajet.departNom} → {trajet.arriveeNom}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-secondary">
                  <span>{trajet.distanceKm} km · {formatDurationHours(trajet.dureeAutorouteMinutes)}</span>
                  <span className="flex items-center gap-1 group-hover:text-fg font-medium">
                    Détails <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Annuaire des grandes autoroutes françaises */}
        <section className="space-y-6">
          <div className="border-b border-line pb-3">
            <h2 className="text-2xl font-bold text-fg flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-accent" />
              Fiches des principales autoroutes à péage
            </h2>
            <p className="text-xs text-secondary mt-1">
              Concessionnaires, système de tarification et spécificités de chaque grand axe autoroutier français.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {autoroutes.map((autoroute) => (
              <Link
                key={autoroute.code}
                href={`/autoroute/${autoroute.code}`}
                className="card p-4 border-line bg-surface hover:border-accent/60 transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent uppercase">
                      {autoroute.code}
                    </span>
                    {autoroute.fluxLibre && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-warning-soft text-warning border border-warning-line">
                        Flux Libre
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-fg group-hover:text-accent transition-colors">
                    {autoroute.nom}
                  </h3>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                    {autoroute.villes}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-secondary">
                  <span>{autoroute.concessionnaire} · {autoroute.longueurKm} km</span>
                  <ArrowRight className="w-3 h-3 text-secondary group-hover:text-fg transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Publicité 2 */}
        <AdSlot />

        {/* Guides Pratiques & Astuces */}
        <section className="space-y-6">
          <div className="border-b border-line pb-3">
            <h2 className="text-2xl font-bold text-fg flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent" />
              Guides pratiques & astuces péages
            </h2>
            <p className="text-xs text-secondary mt-1">
              Tout pour voyager sereinement, éviter les amendes et réduire votre budget de voyage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="card p-5 border-line bg-surface hover:border-accent/60 transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span>Lecture {guide.readTime}</span>
                    <span>·</span>
                    <span>Mis à jour en 2026</span>
                  </div>
                  <h3 className="text-base font-bold text-fg group-hover:text-accent transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-accent font-semibold">
                  <span>Lire le guide complet</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Foire Aux Questions (FAQ) */}
        <section className="space-y-6">
          <div className="border-b border-line pb-3">
            <h2 className="text-2xl font-bold text-fg flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-accent" />
              Questions fréquentes sur les péages d’autoroutes
            </h2>
            <p className="text-xs text-secondary mt-1">
              Les réponses aux questions les plus courantes sur les tarifs, les badges et les règles de circulation.
            </p>
          </div>

          <div className="space-y-3">
            <details className="card p-4 border-line bg-surface rounded-xl group">
              <summary className="font-bold text-sm text-fg cursor-pointer flex items-center justify-between list-none">
                <span>Comment payer un péage sans barrière en flux libre ?</span>
                <ChevronRight className="w-4 h-4 text-secondary transition-transform group-open:rotate-90" />
              </summary>
              <div className="pt-3 text-xs text-secondary leading-relaxed border-t border-line/60 mt-3 space-y-2">
                <p>
                  Si vous empruntez une autoroute en flux libre (comme l’A13 entre Paris et Caen, ou l’A79 dans l’Allier), vous ne vous arrêtez pas. Vos plaques d’immatriculation sont scannées à 130 km/h sous les portiques.
                </p>
                <p>
                  Si vous avez un badge télépéage, le paiement est <strong>100 % automatique</strong>. Sans badge, vous devez vous connecter sous <strong>72 heures</strong> sur le site de l’exploitant (sanef.com pour l’A13, aliae.com pour l’A79) pour payer par carte bancaire.
                </p>
              </div>
            </details>

            <details className="card p-4 border-line bg-surface rounded-xl group">
              <summary className="font-bold text-sm text-fg cursor-pointer flex items-center justify-between list-none">
                <span>Quelle est la différence de prix entre la Classe 1 et la Classe 2 ?</span>
                <ChevronRight className="w-4 h-4 text-secondary transition-transform group-open:rotate-90" />
              </summary>
              <div className="pt-3 text-xs text-secondary leading-relaxed border-t border-line/60 mt-3 space-y-2">
                <p>
                  La Classe 1 concerne les véhicules d’une hauteur totale inférieure ou égale à 2 mètres et PTAC ≤ 3,5 t (berlines, SUV, citadines).
                </p>
                <p>
                  La Classe 2 concerne les véhicules d’une hauteur comprise entre 2 et 3 mètres (vans aménagés, gros utilitaires, camping-cars). Le tarif de la Classe 2 est en moyenne <strong>50 % plus cher</strong> que celui de la Classe 1.
                </p>
              </div>
            </details>

            <details className="card p-4 border-line bg-surface rounded-xl group">
              <summary className="font-bold text-sm text-fg cursor-pointer flex items-center justify-between list-none">
                <span>Le badge de télépéage est-il payant lorsqu’on ne s’en sert pas ?</span>
                <ChevronRight className="w-4 h-4 text-secondary transition-transform group-open:rotate-90" />
              </summary>
              <div className="pt-3 text-xs text-secondary leading-relaxed border-t border-line/60 mt-3 space-y-2">
                <p>
                  Avec les formules pour particuliers sans engagement (comme <em>Ulys Classic</em> ou <em>Bip&Go À la carte</em>), vous ne payez les frais de gestion (environ 1,70 € à 2 € par mois) <strong>uniquement les mois où vous utilisez l’autoroute</strong>.
                </p>
                <p>
                  Si vous ne partez en vacances que 2 mois dans l’année, le badge ne vous coûte qu’environ 4 € par an pour un gain de temps considérable aux barrières de péage.
                </p>
              </div>
            </details>

            <details className="card p-4 border-line bg-surface rounded-xl group">
              <summary className="font-bold text-sm text-fg cursor-pointer flex items-center justify-between list-none">
                <span>Comment contester un surclassement injustifié à la barrière ?</span>
                <ChevronRight className="w-4 h-4 text-secondary transition-transform group-open:rotate-90" />
              </summary>
              <div className="pt-3 text-xs text-secondary leading-relaxed border-t border-line/60 mt-3 space-y-2">
                <p>
                  Si votre véhicule est équipé d’un coffre de toit ou de vélos, les capteurs optiques peuvent vous classer en Classe 2 par erreur.
                </p>
                <p>
                  N’insérez pas votre carte bancaire immédiatement : appuyez sur le bouton d’assistance (interphone) et signalez votre chargement de toit. L’opérateur régularisera immédiatement le tarif en Classe 1.
                </p>
              </div>
            </details>
          </div>
        </section>
      </div>
    </>
  );
}
