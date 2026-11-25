import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl } from './site';

/** Longueur maximale du titre complet (marque comprise) admise par le site. */
export const SEO_TITLE_MAX = 65;
/** Longueur visée pour le titre complet : au-delà, Google tronque souvent. */
export const SEO_TITLE_TARGET = 60;
export const SEO_DESCRIPTION_MIN = 120;
export const SEO_DESCRIPTION_MAX = 160;

export const SEO_OG_IMAGE_PATH = '/brand/ododex-og.png';
export const SEO_OG_IMAGE_WIDTH = 1200;
export const SEO_OG_IMAGE_HEIGHT = 630;

const SEO_TITLE_SEPARATOR = ' | ';
const SEO_OG_LOCALE = 'fr_FR';

/** Ajoute la marque une seule fois (sans doubler « | Ododex »). */
export function seoFullTitle(core: string): string {
  const suffix = `${SEO_TITLE_SEPARATOR}${SITE_NAME}`;
  return core.endsWith(suffix) ? core : `${core}${suffix}`;
}

/**
 * Choisit la première variante dont le titre complet tient dans la longueur
 * visée ; à défaut, la première qui tient dans le maximum ; à défaut, la plus
 * courte (jamais de troncature).
 */
export function seoPickTitle(variants: readonly string[]): string {
  const withinTarget = variants.find((v) => seoFullTitle(v).length <= SEO_TITLE_TARGET);
  if (withinTarget) return seoFullTitle(withinTarget);
  const withinMax = variants.find((v) => seoFullTitle(v).length <= SEO_TITLE_MAX);
  if (withinMax) return seoFullTitle(withinMax);
  return seoFullTitle(variants[variants.length - 1]);
}

/**
 * Choisit la première description dont la longueur est comprise entre le
 * minimum et le maximum ; à défaut, la dernière variante.
 */
export function seoPickDescription(variants: readonly string[]): string {
  const fitting = variants.find(
    (v) => v.length >= SEO_DESCRIPTION_MIN && v.length <= SEO_DESCRIPTION_MAX
  );
  return fitting ?? variants[variants.length - 1];
}

export function seoTrajetTitle(depart: string, arrivee: string, price: string): string {
  const route = `${depart}-${arrivee}`;
  return seoPickTitle([
    `Péage ${route} 2026 : prix et itinéraire (${price})`,
    `Péage ${route} 2026 : prix (${price})`,
    `Péage ${route} : prix (${price})`,
    `Péage ${route} : ${price}`,
  ]);
}

export function seoAutorouteTitle(code: string): string {
  return seoPickTitle([
    `Péage ${code} 2026 : tarifs et concessionnaire`,
    `Péage ${code} 2026 : tarifs`,
  ]);
}

export const SEO_HOME_DESCRIPTION =
  'Calculez le prix des péages en France pour votre trajet (classes 1, 2 et moto). Péage sans barrière en flux libre (A13, A79) et badge télépéage expliqués.';

export function seoHomeTitle(): string {
  return seoPickTitle(['Péages d’autoroute 2026 : calculateur de tarifs']);
}

/** Aplatit la parenthèse finale d’un libellé (« A (B) » devient « a, B »). */
export function seoFlattenParentheses(label: string): string {
  const flat = label.replace(/\s*\(([^)]*)\)?\s*$/, ', $1').trim();
  return flat.charAt(0).toLowerCase() + flat.slice(1);
}

/** Intègre les parenthèses au texte (« A (B) » devient « A B »). */
export function seoInlineParentheses(label: string): string {
  return label.replace(/\s*\(([^)]*)\)/g, ' $1').trim();
}

/** Retire les précisions entre parenthèses d’un libellé. */
export function seoDropParentheses(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, '').trim();
}

/** Garde le début d’un libellé, avant toute parenthèse ou tout deux-points. */
export function seoShortLabel(label: string): string {
  return label.replace(/\s*[(:].*$/, '').trim();
}

function seoLowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function seoTrajetDescription(args: {
  depart: string;
  arrivee: string;
  distanceKm: number;
  class1: string;
  class2: string;
  class5: string;
}): string {
  const { depart, arrivee, distanceKm, class1, class2, class5 } = args;
  const head = `Prix du péage entre ${depart} et ${arrivee}`;
  return seoPickDescription([
    `${head} : ${class1} en voiture, ${class2} en van ou camping-car, ${class5} à moto. Distance de ${distanceKm} km et comparatif sans péage.`,
    `${head} : ${class1} en voiture, ${class2} en van, ${class5} à moto. Distance de ${distanceKm} km et alternative sans péage.`,
    `${head} : ${class1} en voiture, ${class2} en van, ${class5} à moto. ${distanceKm} km, itinéraire gratuit en comparaison.`,
  ]);
}

const SEO_AUTOROUTE_TAILS = [
  'Tarifs 2026 par classe de véhicule et trajets principaux.',
  'Tarifs 2026 et trajets principaux, avec conseils pratiques.',
  'Tarifs 2026, trajets principaux et conseils pratiques pour bien préparer votre route.',
  'Tarifs 2026 et trajets principaux.',
  'Tarifs 2026.',
];

/**
 * Description d’autoroute : de la version la plus détaillée à la plus courte,
 * la première qui tient entre le minimum et le maximum est retenue.
 */
export function seoAutorouteDescription(args: {
  name: string;
  lengthKm: number;
  concessionaire: string;
  tollSystem: string;
}): string {
  const { name, lengthKm, concessionaire, tollSystem } = args;
  const prefix = `Autoroute ${seoInlineParentheses(name)} (${lengthKm} km), exploitée par`;
  const heads = [
    `${prefix} ${seoInlineParentheses(concessionaire)}.`,
    `${prefix} ${seoDropParentheses(concessionaire)}.`,
  ];
  const systems = [
    seoFlattenParentheses(tollSystem),
    seoLowerFirst(seoDropParentheses(tollSystem)),
    seoLowerFirst(seoShortLabel(tollSystem)),
  ];
  const variants = heads.flatMap((head) =>
    systems.flatMap((system) => SEO_AUTOROUTE_TAILS.map((tail) => `${head} Péage : ${system}. ${tail}`))
  );
  return seoPickDescription(variants);
}

export function seoOgImageUrl(): string {
  return absoluteUrl(SEO_OG_IMAGE_PATH);
}

export function seoOgImages(): { url: string; width: number; height: number; alt: string }[] {
  return [
    {
      url: seoOgImageUrl(),
      width: SEO_OG_IMAGE_WIDTH,
      height: SEO_OG_IMAGE_HEIGHT,
      alt: SITE_NAME,
    },
  ];
}

/** Open Graph complet : une page qui redéfinit `openGraph` remplace celui du layout, donc l’image doit y figurer. */
export function seoOpenGraph(title: string, description: string, path: string): NonNullable<Metadata['openGraph']> {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: SITE_NAME,
    locale: SEO_OG_LOCALE,
    type: 'website',
    images: seoOgImages(),
  };
}

export function seoTwitter(): NonNullable<Metadata['twitter']> {
  return { card: 'summary_large_image', images: [seoOgImageUrl()] };
}
