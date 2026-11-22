import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateToll,
  getAllTrajets,
  getAllAutoroutes,
  getAllVilles,
  getTrajetById,
  getAutorouteByCode,
  formatDurationHours,
  formatPrice
} from '../lib/peages';

describe('Calculateur de Péages Français', () => {
  it('charge la liste des villes, autoroutes et trajets sans erreur', () => {
    const villes = getAllVilles();
    const autoroutes = getAllAutoroutes();
    const trajets = getAllTrajets();

    assert.ok(villes.length >= 30);
    assert.ok(autoroutes.length >= 15);
    assert.ok(trajets.length >= 20);
  });

  it('calcule exactement le péage Paris - Lyon pour la Classe 1', () => {
    const res = calculateToll('paris', 'lyon', 'classe1', false);
    assert.ok(res);
    assert.equal(res?.peageTotal, 38.70);
    assert.equal(res?.distanceKm, 465);
    assert.equal(res?.allerRetour, false);
    assert.equal(res?.vehicleClass, 'classe1');
    assert.ok(res?.autoroutes.includes('A6'));
  });

  it('calcule le péage Paris - Lyon pour la Classe 2 (Van / Camping-car)', () => {
    const res = calculateToll('paris', 'lyon', 'classe2', false);
    assert.ok(res);
    assert.equal(res?.peageTotal, 60.10);
    assert.ok(res.peageTotal > 38.70);
  });

  it('calcule le péage Paris - Lyon pour la Classe 5 (Moto)', () => {
    const res = calculateToll('paris', 'lyon', 'classe5', false);
    assert.ok(res);
    assert.equal(res?.peageTotal, 23.40);
    assert.ok(res.peageTotal < 38.70);
  });

  it('gère le sens inverse Lyon - Paris automatiquement', () => {
    const res = calculateToll('lyon', 'paris', 'classe1', false);
    assert.ok(res);
    assert.equal(res?.departNom, 'Lyon');
    assert.equal(res?.arriveeNom, 'Paris');
    assert.equal(res?.peageTotal, 38.70);
  });

  it('double le montant du péage et du carburant en cas d’Aller-Retour', () => {
    const simple = calculateToll('paris', 'bordeaux', 'classe1', false);
    const ar = calculateToll('paris', 'bordeaux', 'classe1', true);

    assert.ok(simple && ar);
    assert.equal(ar.peageTotal, Number((simple.peageTotal * 2).toFixed(2)));
    assert.equal(ar.carburantTotalLitres, Number((simple.carburantTotalLitres * 2).toFixed(1)));
  });

  it('identifie un trajet en flux libre (Paris - Deauville sur A13)', () => {
    const res = calculateToll('paris', 'deauville', 'classe1', false);
    assert.ok(res);
    assert.equal(res?.fluxLibre, true);
    assert.ok(res?.fluxLibreDetails && res.fluxLibreDetails.length > 0);
  });

  it('estime un trajet non directement enregistré via coordonnées GPS', () => {
    const res = calculateToll('rouen', 'nice', 'classe1', false);
    assert.ok(res);
    assert.ok(res.distanceKm > 800);
    assert.ok(res.peageTotal > 50);
    assert.equal(res.isDirectRoute, false);
  });

  it('formate correctement les durées et les prix', () => {
    assert.equal(formatDurationHours(90), '1 h 30 min');
    assert.equal(formatDurationHours(120), '2 h');
    assert.equal(formatDurationHours(45), '45 min');

    const priceStr = formatPrice(38.7);
    assert.ok(priceStr.includes('38,70') || priceStr.includes('38.70'));
    assert.ok(priceStr.includes('€'));
  });

  it('récupère une autoroute spécifique par son code', () => {
    const a10 = getAutorouteByCode('a10');
    assert.ok(a10);
    assert.equal(a10?.code, 'a10');
    assert.ok(a10?.longueurKm > 500);

    const a13 = getAutorouteByCode('a13');
    assert.ok(a13);
    assert.equal(a13?.fluxLibre, true);
  });
});
