import React from 'react';
import { LegalPage } from '@/components/LegalPage';
import { getTitular, type Titular } from '@/lib/legal';
import { legalHolderValue, legalMetadata } from '@/lib/legal-text';
import { SITE_NAME } from '@/lib/site';

const PATH = '/mentions-legales';
const URL_CLOUDFLARE = 'https://www.cloudflare.com';
const URL_ASFA = 'https://www.autoroutes.fr';

export const metadata = legalMetadata(
  PATH,
  'Mentions légales',
  `Mentions légales de ${SITE_NAME} : éditeur, hébergeur, sources des données des péages et limites de responsabilité.`
);

export default function MentionsLegalesPage() {
  const holder = getTitular();
  const field = (name: keyof Titular) => legalHolderValue(holder, name);

  return (
    <LegalPage title="Mentions légales" path={PATH}>
      <h2 className="text-base font-bold text-fg">Éditeur du site</h2>
      <p>
        Conformément à l&apos;article 6 III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), ce site est édité par :
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Nom : {field('nombre')}</li>
        <li>Numéro d&apos;identification fiscale (NIF, Espagne) : {field('nif')}</li>
        <li>Adresse : {field('domicilio')}</li>
        <li>Adresse e-mail de contact : {field('email')}</li>
        {holder.tipo === 'empresa' && <li>Immatriculation au registre du commerce : {field('registroMercantil')}</li>}
      </ul>

      <h2 className="text-base font-bold text-fg">Directeur de la publication</h2>
      <p>Le directeur de la publication est l&apos;éditeur du site : {field('nombre')}.</p>

      <h2 className="text-base font-bold text-fg">Hébergeur</h2>
      <p>
        Le site est hébergé par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (<a href={URL_CLOUDFLARE} target="_blank" rel="noopener noreferrer" className="text-accent underline">cloudflare.com</a>).
      </p>

      <h2 className="text-base font-bold text-fg">Objet du site et indépendance</h2>
      <p>
        Ce site propose à titre informatif et gratuit un calculateur des tarifs de péages et un guide pratique du réseau autoroutier français concédé.
      </p>
      <p>
        Le site est un service indépendant et n&apos;est rattaché ni au Ministère des Transports, ni à l&apos;Association des Sociétés Françaises d&apos;Autoroutes (ASFA), ni à aucune société concessionnaire (APRR, AREA, ASF, Cofiroute, Escota, Sanef, SAPN, ATMB).
      </p>

      <h2 className="text-base font-bold text-fg">Origine des données</h2>
      <p>
        Les tarifs kilométriques, distances et règles de classification des véhicules sont issus des barèmes officiels publiés par les sociétés concessionnaires d&apos;autoroutes sous le contrôle de l&apos;Autorité de régulation des transports (ART) et de l&apos;ASFA (<a href={URL_ASFA} target="_blank" rel="noopener noreferrer" className="text-accent underline">autoroutes.fr</a>).
      </p>

      <h2 className="text-base font-bold text-fg">Propriété intellectuelle</h2>
      <p>
        Les marques, logos, graphismes, logiciels, interfaces et contenus éditoriaux figurant sur le site sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable est prohibée.
      </p>
    </LegalPage>
  );
}
