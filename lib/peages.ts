import villesData from '../data/villes.json';
import autoroutesData from '../data/autoroutes.json';
import trajetsData from '../data/trajets.json';

export type VehicleClass = 'classe1' | 'classe2' | 'classe5';

export interface Ville {
  id: string;
  nom: string;
  departement: string;
  region: string;
  lat: number;
  lng: number;
}

export interface Autoroute {
  code: string;
  nom: string;
  villes: string;
  longueurKm: number;
  concessionnaire: string;
  systemePeage: string;
  tarifMoyenClasse1: number;
  fluxLibre: boolean;
  description: string;
  descriptionSeo: string;
}

export interface Trajet {
  id: string;
  departId: string;
  arriveeId: string;
  departNom: string;
  arriveeNom: string;
  distanceKm: number;
  dureeAutorouteMinutes: number;
  dureeSansPeageMinutes: number;
  peageClasse1: number;
  peageClasse2: number;
  peageClasse5: number;
  autoroutes: string[];
  concessionnaires: string[];
  fluxLibre: boolean;
  fluxLibreDetails?: string;
  garesPeage: string[];
  itineraireSansPeage: string;
  carburantEstimeL: number;
  resume: string;
}

export interface CalculationResult {
  departNom: string;
  arriveeNom: string;
  distanceKm: number;
  dureeAutorouteMinutes: number;
  dureeSansPeageMinutes: number;
  tempsGagneMinutes: number;
  peageTotal: number;
  peageUnitaire: number;
  allerRetour: boolean;
  vehicleClass: VehicleClass;
  carburantTotalLitres: number;
  coutCarburantEstime: number;
  coutTotalEstime: number;
  autoroutes: string[];
  concessionnaires: string[];
  fluxLibre: boolean;
  fluxLibreDetails?: string;
  garesPeage: string[];
  itineraireSansPeage: string;
  isDirectRoute: boolean;
}

export function getAllVilles(): Ville[] {
  return villesData as Ville[];
}

export function getVilleById(id: string): Ville | undefined {
  return (villesData as Ville[]).find(v => v.id.toLowerCase() === id.toLowerCase());
}

export function getAllAutoroutes(): Autoroute[] {
  return autoroutesData as Autoroute[];
}

export function getAutorouteByCode(code: string): Autoroute | undefined {
  return (autoroutesData as Autoroute[]).find(a => a.code.toLowerCase() === code.toLowerCase());
}

export function getAllTrajets(): Trajet[] {
  return trajetsData as Trajet[];
}

export function getTrajetById(id: string): Trajet | undefined {
  return (trajetsData as Trajet[]).find(t => t.id.toLowerCase() === id.toLowerCase());
}

// Distance à vol d'oiseau (formule de Haversine)
function distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateToll(
  departId: string,
  arriveeId: string,
  vehicleClass: VehicleClass = 'classe1',
  allerRetour: boolean = false
): CalculationResult | null {
  const villeDepart = getVilleById(departId);
  const villeArrivee = getVilleById(arriveeId);

  if (!villeDepart || !villeArrivee) return null;
  if (departId === arriveeId) return null;

  // 1. Chercher dans les trajets directs pré-enregistrés
  const allTrajets = getAllTrajets();
  let direct = allTrajets.find(
    t => t.departId === departId && t.arriveeId === arriveeId
  );

  let isInverse = false;
  if (!direct) {
    direct = allTrajets.find(
      t => t.departId === arriveeId && t.arriveeId === departId
    );
    if (direct) isInverse = true;
  }

  const multiplier = allerRetour ? 2 : 1;
  const prixCarburantLitre = 1.78; // Prix moyen indicatif essence/diesel en France

  if (direct) {
    let peageUnitaire = direct.peageClasse1;
    if (vehicleClass === 'classe2') peageUnitaire = direct.peageClasse2;
    if (vehicleClass === 'classe5') peageUnitaire = direct.peageClasse5;

    const peageTotal = Number((peageUnitaire * multiplier).toFixed(2));
    const carburantLitres = Number((direct.carburantEstimeL * multiplier).toFixed(1));
    const coutCarburant = Number((carburantLitres * prixCarburantLitre).toFixed(2));

    return {
      departNom: isInverse ? direct.arriveeNom : direct.departNom,
      arriveeNom: isInverse ? direct.departNom : direct.arriveeNom,
      distanceKm: direct.distanceKm,
      dureeAutorouteMinutes: direct.dureeAutorouteMinutes,
      dureeSansPeageMinutes: direct.dureeSansPeageMinutes,
      tempsGagneMinutes: direct.dureeSansPeageMinutes - direct.dureeAutorouteMinutes,
      peageTotal,
      peageUnitaire,
      allerRetour,
      vehicleClass,
      carburantTotalLitres: carburantLitres,
      coutCarburantEstime: coutCarburant,
      coutTotalEstime: Number((peageTotal + coutCarburant).toFixed(2)),
      autoroutes: direct.autoroutes,
      concessionnaires: direct.concessionnaires,
      fluxLibre: direct.fluxLibre,
      fluxLibreDetails: direct.fluxLibreDetails,
      garesPeage: direct.garesPeage,
      itineraireSansPeage: direct.itineraireSansPeage,
      isDirectRoute: true
    };
  }

  // 2. Trajet non pré-enregistré : estimation basée sur coordonnées GPS
  const volOiseau = distanceBetween(
    villeDepart.lat,
    villeDepart.lng,
    villeArrivee.lat,
    villeArrivee.lng
  );

  // En France, la distance routière moyenne est environ 1.25 fois la distance à vol d'oiseau
  const distanceKm = Math.round(volOiseau * 1.25);
  // Vitesse moyenne autoroute ~110 km/h avec pauses
  const dureeAutorouteMinutes = Math.round((distanceKm / 110) * 60);
  // Vitesse moyenne réseau secondaire ~70 km/h
  const dureeSansPeageMinutes = Math.round((distanceKm / 68) * 60);

  // Tarif moyen kilométrique autoroutier français ~0.088 € / km pour classe 1
  let tarifAuKm = 0.088;
  if (vehicleClass === 'classe2') tarifAuKm = 0.137;
  if (vehicleClass === 'classe5') tarifAuKm = 0.054;

  const peageUnitaire = Number((distanceKm * tarifAuKm).toFixed(2));
  const peageTotal = Number((peageUnitaire * multiplier).toFixed(2));

  // Consommation estimée ~6.8 L / 100 km
  const carburantLitres = Number(((distanceKm * 6.8 / 100) * multiplier).toFixed(1));
  const coutCarburant = Number((carburantLitres * prixCarburantLitre).toFixed(2));

  return {
    departNom: villeDepart.nom,
    arriveeNom: villeArrivee.nom,
    distanceKm,
    dureeAutorouteMinutes,
    dureeSansPeageMinutes,
    tempsGagneMinutes: dureeSansPeageMinutes - dureeAutorouteMinutes,
    peageTotal,
    peageUnitaire,
    allerRetour,
    vehicleClass,
    carburantTotalLitres: carburantLitres,
    coutCarburantEstime: coutCarburant,
    coutTotalEstime: Number((peageTotal + coutCarburant).toFixed(2)),
    autoroutes: ['Réseau autoroutier concédé'],
    concessionnaires: ['Sociétés concessionnaires autoroutières'],
    fluxLibre: false,
    garesPeage: ['Barrières de péage du trajet'],
    itineraireSansPeage: 'Réseau de routes nationales et départementales gratuites',
    isDirectRoute: false
  };
}

export function formatDurationHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m.toString().padStart(2, '0')} min`;
}

export function formatPrice(val: number): string {
  return val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
