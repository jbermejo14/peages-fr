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

/**
 * Description d’autoroute rédigée à la main (champ `descriptionSeo` des
 * données). Échoue si sa longueur sort des bornes : une description trop
 * courte ou trop longue est une erreur de données à corriger, pas à masquer.
 */
export function seoAutorouteDescription(descriptionSeo: string): string {
  const length = descriptionSeo.length;
  if (length < SEO_DESCRIPTION_MIN || length > SEO_DESCRIPTION_MAX) {
    throw new Error(
      `descriptionSeo de ${length} caractères (attendu : ${SEO_DESCRIPTION_MIN} à ${SEO_DESCRIPTION_MAX}) : « ${descriptionSeo} »`
    );
  }
  return descriptionSeo;
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

export function seoTwitter(title: string, description: string): NonNullable<Metadata['twitter']> {
  return { card: 'summary_large_image', title, description, images: [seoOgImageUrl()] };
}
