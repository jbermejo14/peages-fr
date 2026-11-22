'use client';

import React, { useState, useMemo, useId } from 'react';
import Link from 'next/link';
import {
  Car,
  Truck,
  Bike,
  ArrowRightLeft,
  Clock,
  Coins,
  Fuel,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  getAllVilles,
  calculateToll,
  formatDurationHours,
  formatPrice,
  VehicleClass
} from '@/lib/peages';

export function TollCalculator() {
  const [depart, setDepart] = useState('paris');
  const [arrivee, setArrivee] = useState('lyon');
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('classe1');
  const [allerRetour, setAllerRetour] = useState(false);
  const departId = useId();
  const arriveeId = useId();
  const vehicleClassId = useId();

  const villes = useMemo(() => getAllVilles(), []);

  const handleInvert = () => {
    const temp = depart;
    setDepart(arrivee);
    setArrivee(temp);
  };

  const result = useMemo(() => {
    return calculateToll(depart, arrivee, vehicleClass, allerRetour);
  }, [depart, arrivee, vehicleClass, allerRetour]);

  const directTrajetSlug = useMemo(() => {
    if (!result) return null;
    const s1 = `${depart}-${arrivee}`;
    const s2 = `${arrivee}-${depart}`;
    return s1;
  }, [depart, arrivee, result]);

  return (
    <div className="card border-line bg-surface p-6 rounded-2xl shadow-sm space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-fg flex items-center gap-2">
          <Coins className="w-5 h-5 text-accent" />
          Calculateur de tarif de péage d’autoroute 2026
        </h2>
        <p className="text-xs text-secondary mt-1">
          Sélectionnez vos villes de départ et d’arrivée pour calculer le tarif officiel exact et comparer le temps gagné face à l’itinéraire gratuit.
        </p>
      </div>

      {/* Formulaire de sélection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Ville départ */}
        <div className="md:col-span-4">
          <label htmlFor={departId} className="block text-xs font-semibold text-fg uppercase tracking-wider mb-2">
            Ville de départ
          </label>
          <select
            id={departId}
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            className="w-full bg-elevated border border-line rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
          >
            {villes.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === arrivee}>
                {v.nom} ({v.departement})
              </option>
            ))}
          </select>
        </div>

        {/* Bouton inversion */}
        <div className="md:col-span-1 flex justify-center pb-1">
          <button
            type="button"
            onClick={handleInvert}
            aria-label="Inverser le sens du trajet"
            className="p-2 rounded-lg bg-elevated border border-line text-secondary hover:text-fg hover:border-accent transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Ville arrivée */}
        <div className="md:col-span-4">
          <label htmlFor={arriveeId} className="block text-xs font-semibold text-fg uppercase tracking-wider mb-2">
            Ville d’arrivée
          </label>
          <select
            id={arriveeId}
            value={arrivee}
            onChange={(e) => setArrivee(e.target.value)}
            className="w-full bg-elevated border border-line rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
          >
            {villes.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === depart}>
                {v.nom} ({v.departement})
              </option>
            ))}
          </select>
        </div>

        {/* Classe véhicule */}
        <div className="md:col-span-3">
          <label htmlFor={vehicleClassId} className="block text-xs font-semibold text-fg uppercase tracking-wider mb-2">
            Classe de véhicule
          </label>
          <select
            id={vehicleClassId}
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value as VehicleClass)}
            className="w-full bg-elevated border border-line rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
          >
            <option value="classe1">🚗 Classe 1 (Voiture)</option>
            <option value="classe2">🚐 Classe 2 (Van / Camping-car)</option>
            <option value="classe5">🏍️ Classe 5 (Moto / 2-roues)</option>
          </select>
        </div>
      </div>

      {/* Options : Aller simple vs Aller-retour */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-line/60 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-fg">
          <input
            type="checkbox"
            checked={allerRetour}
            onChange={(e) => setAllerRetour(e.target.checked)}
            className="rounded border-line text-accent focus:ring-accent"
          />
          <span>Calculer pour un trajet Aller-Retour</span>
        </label>

        <span className="text-secondary text-[11px]">
          Carburant estimé sur une base moyenne de 6,8 L/100 km à 1,78 €/L
        </span>
      </div>

      {/* Résultat détaillé */}
      {result && (
        <div className="pt-4 space-y-4">
          {/* Alerte Flux Libre si le trajet emprunte l'A13 ou l'A79 */}
          {result.fluxLibre && (
            <div className="p-4 rounded-xl border border-warning-line bg-warning-soft text-warning space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Péage en FLUX LIBRE sur cet itinéraire (sans barrière physique)</span>
              </div>
              <p className="text-xs leading-relaxed">
                Ce trajet traverse une autoroute sans barrière de péage. Vous devez impérativement vous acquitter du montant sous <strong>72 heures</strong> sur le site du concessionnaire (sanef.com ou aliae.com) ou utiliser un badge de télépéage pour éviter une indemnité forfaitaire de 90 €.
              </p>
            </div>
          )}

          {/* Grille principale des coûts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-elevated rounded-xl border border-line text-center">
              <span className="text-xs text-secondary block font-medium">Tarif du péage</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-accent block mt-1">
                {formatPrice(result.peageTotal)}
              </strong>
              <span className="text-[11px] text-muted mt-1 block">
                {allerRetour ? 'Aller-Retour' : 'Aller simple'} ({result.vehicleClass})
              </span>
            </div>

            <div className="p-4 bg-elevated rounded-xl border border-line text-center">
              <span className="text-xs text-secondary block font-medium">Carburant estimé</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-fg block mt-1">
                {formatPrice(result.coutCarburantEstime)}
              </strong>
              <span className="text-[11px] text-muted mt-1 block">
                ~{result.carburantTotalLitres} litres
              </span>
            </div>

            <div className="p-4 bg-elevated rounded-xl border border-line text-center">
              <span className="text-xs text-secondary block font-medium">Budget total trajet</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-positive block mt-1">
                {formatPrice(result.coutTotalEstime)}
              </strong>
              <span className="text-[11px] text-muted mt-1 block">Péage + Carburant</span>
            </div>

            <div className="p-4 bg-elevated rounded-xl border border-line text-center">
              <span className="text-xs text-secondary block font-medium">Distance & Temps</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-fg block mt-1">
                {formatDurationHours(result.dureeAutorouteMinutes * (allerRetour ? 2 : 1))}
              </strong>
              <span className="text-[11px] text-muted mt-1 block">
                {result.distanceKm * (allerRetour ? 2 : 1)} km via autoroute
              </span>
            </div>
          </div>

          {/* Comparatif Autoroute vs Itinéraire sans péage */}
          <div className="p-4 bg-surface border border-line rounded-xl space-y-3">
            <h3 className="font-bold text-sm text-fg flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent" />
              Comparatif : Autoroute payante vs Route Nationale gratuite
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-elevated rounded-lg border border-line space-y-1">
                <span className="font-semibold text-fg flex items-center gap-1.5 text-accent">
                  <Clock className="w-4 h-4" /> Par autoroute payante :
                </span>
                <p className="text-secondary">
                  Temps de parcours : <strong>{formatDurationHours(result.dureeAutorouteMinutes)}</strong>. Vitesse fluide et sécurisée sur chaussée séparée.
                </p>
                <div className="text-[11px] text-muted mt-1">
                  Autoroutes : {result.autoroutes.join(', ')} ({result.concessionnaires.join(', ')})
                </div>
              </div>

              <div className="p-3 bg-elevated rounded-lg border border-line space-y-1">
                <span className="font-semibold text-fg flex items-center gap-1.5 text-positive">
                  <Coins className="w-4 h-4" /> Sans péage (gratuit) :
                </span>
                <p className="text-secondary">
                  Temps de parcours : <strong>{formatDurationHours(result.dureeSansPeageMinutes)}</strong> (vous perdez{' '}
                  <strong>{formatDurationHours(result.tempsGagneMinutes)}</strong> mais économisez{' '}
                  <strong className="text-positive">{formatPrice(result.peageTotal)}</strong>).
                </p>
                <div className="text-[11px] text-muted mt-1">
                  Itinéraire conseillé : {result.itineraireSansPeage}
                </div>
              </div>
            </div>
          </div>

          {/* Lien vers la fiche trajet détaillée si disponible */}
          {result.isDirectRoute && (
            <div className="flex justify-end pt-2">
              <Link
                href={`/trajet/${directTrajetSlug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                <span>Voir le détail complet du trajet {result.departNom} - {result.arriveeNom}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
