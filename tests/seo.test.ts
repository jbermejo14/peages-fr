import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getAllAutoroutes, getAllTrajets, formatPrice } from '../lib/peages';
import { getAllGuides } from '../lib/guides';
import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_HOME_DESCRIPTION,
  SEO_OG_IMAGE_HEIGHT,
  SEO_OG_IMAGE_PATH,
  SEO_OG_IMAGE_WIDTH,
  SEO_TITLE_MAX,
  seoAutorouteDescription,
  seoAutorouteTitle,
  seoFullTitle,
  seoHomeTitle,
  seoOgImageUrl,
  seoOpenGraph,
  seoTrajetDescription,
  seoTrajetTitle,
  seoTwitter,
} from '../lib/seo';

interface PageMeta {
  label: string;
  title: string;
  description: string;
}

const BRAND_DOUBLED = /\| Ododex \| Ododex/;
const PNG_SIGNATURE = '89504e470d0a1a0a';
const PNG_IHDR_WIDTH_OFFSET = 16;
const PNG_IHDR_HEIGHT_OFFSET = 20;
const LEGAL_DIRECTORIES = ['mentions-legales', 'confidentialite', 'cookies'];

function trajetPages(): PageMeta[] {
  return getAllTrajets().map((t) => ({
    label: `trajet/${t.id}`,
    title: seoTrajetTitle(t.departNom, t.arriveeNom, formatPrice(t.peageClasse1)),
    description: seoTrajetDescription({
      depart: t.departNom,
      arrivee: t.arriveeNom,
      distanceKm: t.distanceKm,
      class1: formatPrice(t.peageClasse1),
      class2: formatPrice(t.peageClasse2),
      class5: formatPrice(t.peageClasse5),
    }),
  }));
}

function autoroutePages(): PageMeta[] {
  return getAllAutoroutes().map((a) => ({
    label: `autoroute/${a.code}`,
    title: seoAutorouteTitle(a.code.toUpperCase()),
    description: seoAutorouteDescription(a.descriptionSeo),
  }));
}

function guidePages(): PageMeta[] {
  return getAllGuides().map((g) => ({
    label: `guide/${g.slug}`,
    title: seoFullTitle(g.metaTitle),
    description: g.metaDescription,
  }));
}

function homePage(): PageMeta {
  return { label: 'accueil', title: seoHomeTitle(), description: SEO_HOME_DESCRIPTION };
}

/** Les pages légales déclarent titre et description dans le source de la page. */
function legalPages(): PageMeta[] {
  return LEGAL_DIRECTORIES.map((dir) => {
    const source = readFileSync(join('app', dir, 'page.tsx'), 'utf8');
    const titleMatch = source.match(/seoFullTitle\('([^']+)'\)/);
    const descriptionMatch = source.match(/`([^`]*\$\{SITE_NAME\}[^`]*)`/);
    assert.ok(titleMatch && descriptionMatch, `métadonnées introuvables pour ${dir}`);
    return {
      label: dir,
      title: seoFullTitle(titleMatch[1]),
      description: descriptionMatch[1].replace(/\$\{SITE_NAME\}/g, 'Ododex'),
    };
  });
}

function allPages(): PageMeta[] {
  return [homePage(), ...trajetPages(), ...autoroutePages(), ...guidePages(), ...legalPages()];
}

describe('SEO : titres et descriptions de toutes les pages', () => {
  it('couvre toutes les pages générables', () => {
    const expected = 1 + getAllTrajets().length + getAllAutoroutes().length + getAllGuides().length + LEGAL_DIRECTORIES.length;
    assert.equal(allPages().length, expected);
  });

  it('titre complet de 65 caractères au plus, avec une seule marque', () => {
    for (const page of allPages()) {
      assert.ok(page.title.length <= SEO_TITLE_MAX, `${page.label} : ${page.title.length} car. « ${page.title} »`);
      assert.ok(page.title.endsWith(' | Ododex'), `${page.label} : marque absente`);
      assert.doesNotMatch(page.title, BRAND_DOUBLED, `${page.label} : marque doublée`);
    }
  });

  it('titres uniques', () => {
    const titles = allPages().map((p) => p.title);
    assert.equal(new Set(titles).size, titles.length);
  });

  it('description de 120 à 160 caractères, unique par page', () => {
    for (const page of allPages()) {
      const length = page.description.length;
      assert.ok(
        length >= SEO_DESCRIPTION_MIN && length <= SEO_DESCRIPTION_MAX,
        `${page.label} : ${length} car. « ${page.description} »`
      );
    }
    const descriptions = allPages().map((p) => p.description);
    assert.equal(new Set(descriptions).size, descriptions.length);
  });

  it('aucune description d’autoroute ne contient de parenthèses doubles', () => {
    for (const page of autoroutePages()) {
      assert.doesNotMatch(page.description, /\)\)/, page.label);
      assert.doesNotMatch(page.description, /\([^)]*\([^)]*\)/, page.label);
    }
  });

  it('les descriptions d’autoroute n’ont ni libellé vide ni ponctuation doublée', () => {
    for (const page of autoroutePages()) {
      assert.doesNotMatch(page.description, /:\s*\./, page.label);
      assert.doesNotMatch(page.description, /\.\./, page.label);
      assert.doesNotMatch(page.description, /Péage : [^.]*:/, page.label);
    }
  });

  it('descriptions d’autoroute : sans « & », sans majuscules de flux libre, sans « Péage : »', () => {
    for (const page of autoroutePages()) {
      assert.doesNotMatch(page.description, / & /, page.label);
      assert.doesNotMatch(page.description, /FLUX LIBRE/, page.label);
      assert.doesNotMatch(page.description, /Péage : /, page.label);
      assert.match(page.description, /tarifs 2026/i, page.label);
    }
  });

  it('seoAutorouteDescription refuse une description hors bornes', () => {
    assert.throws(() => seoAutorouteDescription('trop courte'));
    assert.throws(() => seoAutorouteDescription('x'.repeat(SEO_DESCRIPTION_MAX + 1)));
  });

  it('aucune page ne se présente comme officielle', () => {
    for (const page of allPages()) {
      assert.doesNotMatch(`${page.title} ${page.description}`, /officiel/i, page.label);
    }
  });

  it('exemple : majuscules seulement aux noms propres, variante courte si la plantilla ne tient pas', () => {
    assert.equal(seoTrajetTitle('Paris', 'Lyon', '38,70 €'), 'Péage Paris-Lyon 2026 : prix (38,70 €) | Ododex');
    assert.equal(seoTrajetTitle('Paris', 'Caen', '9 €'), 'Péage Paris-Caen 2026 : prix et itinéraire (9 €) | Ododex');
  });

  it('seoFullTitle n’ajoute pas la marque deux fois', () => {
    assert.equal(seoFullTitle('Titre | Ododex'), 'Titre | Ododex');
    assert.equal(seoFullTitle('Titre'), 'Titre | Ododex');
  });
});

describe('SEO : image Open Graph', () => {
  const imageFile = join('public', SEO_OG_IMAGE_PATH);

  it('le fichier existe et est un PNG 1200×630', () => {
    assert.ok(existsSync(imageFile));
    assert.ok(statSync(imageFile).size > 0);
    const bytes = readFileSync(imageFile);
    assert.equal(bytes.subarray(0, 8).toString('hex'), PNG_SIGNATURE);
    assert.equal(bytes.readUInt32BE(PNG_IHDR_WIDTH_OFFSET), SEO_OG_IMAGE_WIDTH);
    assert.equal(bytes.readUInt32BE(PNG_IHDR_HEIGHT_OFFSET), SEO_OG_IMAGE_HEIGHT);
  });

  it('l’URL est absolue et sous /fr/peages', () => {
    assert.match(seoOgImageUrl(), /^https:\/\/.+\/fr\/peages\/brand\/ododex-og\.png$/);
  });

  it('seoOpenGraph et seoTwitter déclarent l’image', () => {
    const og = seoOpenGraph('t', 'd', '/trajet/x') as { images?: { url: string; width: number; height: number }[] };
    assert.equal(og.images?.[0].url, seoOgImageUrl());
    assert.equal(og.images?.[0].width, SEO_OG_IMAGE_WIDTH);
    assert.equal(og.images?.[0].height, SEO_OG_IMAGE_HEIGHT);
    const twitter = seoTwitter('t', 'd') as { card?: string; title?: string; description?: string; images?: string[] };
    assert.equal(twitter.card, 'summary_large_image');
    assert.equal(twitter.title, 't');
    assert.equal(twitter.description, 'd');
    assert.deepEqual(twitter.images, [seoOgImageUrl()]);
  });

  it('le layout et les pages dynamiques utilisent ces fonctions', () => {
    assert.match(readFileSync('app/layout.tsx', 'utf8'), /openGraph: seoOpenGraph\(/);
    assert.match(readFileSync('app/layout.tsx', 'utf8'), /twitter: seoTwitter\(HOME_TITLE, SEO_HOME_DESCRIPTION\)/);
    for (const file of ['app/trajet/[slug]/page.tsx', 'app/autoroute/[code]/page.tsx', 'app/guide/[slug]/page.tsx']) {
      assert.match(readFileSync(file, 'utf8'), /openGraph: seoOpenGraph\(/, file);
    }
  });
});
