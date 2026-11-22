export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  sections: Array<{
    heading: string;
    content: string[];
  }>;
  faqs: GuideFaq[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'peage-flux-libre-sans-barriere-comment-payer',
    title: 'Péage en flux libre (A13, A79) : comment payer et éviter l’amende de 90 € ?',
    metaTitle: 'Péage en Flux Libre A13 & A79 : Paiement et Délais 2026',
    metaDescription: 'Tout savoir sur le péage sans barrière en France : délai de paiement sous 72h, sites de paiement en ligne (Sanef, Aliae), badge télépéage et sanctions.',
    summary: 'La fin des barrières physiques sur l’A13 (Paris-Normandie) et l’A79 révolutionne la route. Vos plaques sont scannées par des portiques automatiques : découvrez les démarches obligatoires pour régler votre trajet dans les 72 heures.',
    readTime: '6 min',
    publishedAt: '2026-01-20',
    updatedAt: '2026-11-22',
    sections: [
      {
        heading: '1. Qu’est-ce que le péage en flux libre (Free-Flow) ?',
        content: [
          'Le péage en flux libre est un système sans aucune barrière physique d’arrêt. Des portiques métalliques équipés de caméras infrarouges haute définition et de capteurs laser enjambent l’autoroute pour lire instantanément votre plaque d’immatriculation et détecter votre badge de télépéage à pleine vitesse (130 km/h).',
          'En France, deux axes majeurs fonctionnent intégralement en flux libre :',
          '• L’autoroute A79 dans l’Allier (entre Montmarault et Digoin) depuis fin 2022.',
          '• L’autoroute A13 et A14 reliant Paris à la Normandie (Rouen, Deauville, Caen) depuis fin 2024.',
          'Ce système permet d’éliminer les bouchons aux gares de péage, de réduire la consommation de carburant et de fluidifier le trafic lors des grands départs.'
        ]
      },
      {
        heading: '2. Quel est le délai légal pour régler son péage ?',
        content: [
          'Vous disposez d’un délai strict de 72 heures (3 jours ouvrés) après chaque passage sous un portique pour vous acquitter du montant dû.',
          'Attention : aucun courrier postal ni SMS ne vous est envoyé avant l’expiration de ce délai. C’est à vous de penser à vous connecter au site de l’exploitant.',
          'Si vous possédez un badge de télépéage fixé sur votre pare-brise, vous n’avez absolument rien à faire : la détection est automatique et le montant est prélevé sur votre facture mensuelle habituelle.'
        ]
      },
      {
        heading: '3. Comment payer son trajet sans badge télépéage ?',
        content: [
          'Pour régler un trajet sans badge, vous disposez de 3 solutions :',
          '• En ligne par carte bancaire sur le site officiel de l’autoroute empruntée (sanef.com pour l’A13/A14, ou aliae.com pour l’A79) en saisissant votre numéro d’immatriculation.',
          '• Par prélèvement automatique automatique en créant un compte client en ligne et en associant votre plaque à votre carte bancaire avant votre voyage.',
          '• En espèces ou carte bancaire dans le réseau des bureaux de tabac et maisons de la presse partenaires équipés du terminal Nirio (FDJ).'
        ]
      },
      {
        heading: '4. Quelles sont les sanctions en cas d’oubli de paiement ?',
        content: [
          'En cas de non-paiement dans les 72 heures, l’exploitant vous adresse un avis de paiement majoré d’une indemnité forfaitaire de 90 € (article L323-1 du Code de la route).',
          'Si vous réglez sous 15 jours, cette indemnité est minorée à 10 € en plus du péage initial.',
          'Au-delà de 60 jours sans paiement, le dossier est transmis au Ministère public : l’infraction devient une contravention de 4e classe punie d’une amende forfaitaire majorée de 375 € recouvrée par le Trésor public.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Comment payer le péage de l’A13 Paris-Normandie ?',
        answer: 'Sur le site sanef.com dans la rubrique "Payer mon péage flux libre", en renseignant votre numéro de plaque d’immatriculation dans les 72h suivant votre voyage.'
      },
      {
        question: 'Les véhicules étrangers doivent-ils également payer ?',
        answer: 'Oui, les caméras lisent toutes les plaques européennes et internationales. Des accords d’échange transfrontaliers permettent le recouvrement des péages impayés dans toute l’Union européenne.'
      },
      {
        question: 'Le badge télépéage fonctionne-t-il sur les autoroutes sans barrière ?',
        answer: 'Oui, tous les badges de télépéage Liber-t (Ulys, Bip&Go, Fulli, etc.) sont automatiquement reconnus par les portiques sans aucune manipulation.'
      }
    ]
  },
  {
    slug: 'badge-telepeage-ulys-bipandgo-comparatif',
    title: 'Badge télépéage : comparatif Ulys, Bip&Go, Fulli et calcul de rentabilité',
    metaTitle: 'Comparatif Badges Télépéage 2026 : Ulys vs Bip&Go vs Fulli',
    metaDescription: 'Quel est le meilleur badge télépéage en 2026 ? Comparatif des formules sans abonnement, voies 30 km/h, validité Espagne/Portugal/Italie et astuces d’utilisation.',
    summary: 'Fini l’attente aux barrières et la vitre baissée sous la pluie : analyse des offres de télépéage Liber-t, frais réels d’utilisation et formules "à la carte" où vous ne payez que les mois où vous roulez.',
    readTime: '5 min',
    publishedAt: '2026-02-05',
    updatedAt: '2026-11-22',
    sections: [
      {
        heading: '1. Comment fonctionne le télépéage Liber-t ?',
        content: [
          'Le badge de télépéage est un petit boîtier électronique que vous collez sur votre pare-brise, derrière le rétroviseur intérieur (sur la zone à pointillés noirs conçue pour laisser passer les ondes athermiques).',
          'À l’approche d’une barrière de péage, vous empruntez les voies signalées par un « t » orange. Dans les voies « t 30 », vous franchissez le péage à 30 km/h sans vous arrêter. Le badge émet un bip sonore, le feu passe au vert et la barrière se lève instantanément.',
          'Le montant exact de chaque passage est prélevé le mois suivant sur votre compte bancaire, accompagné d’une facture électronique détaillée.'
        ]
      },
      {
        heading: '2. Les formules "Au forfait" vs "À la carte"',
        content: [
          'Pour les conducteurs occasionnels (vacances, week-ends), les gestionnaires proposent des formules sans engagement à 0 € les mois non utilisés :',
          '• Ulys Classic (VINCI Autoroutes) : 2 € par mois utilisé, 0 € les mois où vous ne prenez pas l’autoroute.',
          '• Bip&Go (Sanef) : 1,70 € par mois circulé (facture en ligne), 0 € le reste de l’année.',
          '• Fulli Nomade (APRR) : 1,70 € par mois utilisé.',
          'Si vous ne roulez que 3 mois dans l’année pour vos vacances, le coût de confort du badge ne vous revient qu’à 5 € à 6 € par an !'
        ]
      },
      {
        heading: '3. Utilisation en Espagne, Portugal et Italie',
        content: [
          'Tous les badges récents proposent l’option Espagne-Portugal (environ 2 € à 2,50 € supplémentaires par mois utilisé à l’étranger) et l’option Italie.',
          'Cela vous permet de passer les péages des autoroutes espagnoles (autopistas) et les péages électroniques portugais (ex-SCUT) sans aucun arrêt ni formalité.'
        ]
      },
      {
        heading: '4. Utilisation dans les parkings urbains',
        content: [
          'Votre badge télépéage fonctionne également dans plus de 1 000 parkings souterrains en France (Indigo, Effia, Q-Park, aéroports de Roissy et Orly). La barrière s’ouvre automatiquement à l’entrée et à la sortie, et le stationnement est débité sur votre facture mensuelle de péage.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Où coller exactement le badge sur le pare-brise ?',
        answer: 'Il doit être positionné sur la zone noire en pointillés située autour de la fixation du rétroviseur intérieur. Cette zone n’est pas athermique et permet aux ondes de passer sans blocage.'
      },
      {
        question: 'Que se passe-t-il si le badge ne bipe pas à la barrière ?',
        answer: 'Prenez simplement un ticket à la borne manuelle. À la sortie, insérez le ticket puis présentez votre badge devant le lecteur optique ou utilisez l’interphone d’assistance.'
      },
      {
        question: 'Le badge permet-il d’avoir des réductions sur le prix du péage ?',
        answer: 'Sur les trajets occasionnels, non : le prix du péage reste le même. En revanche, des abonnements "trajet régulier" (comme Ulys 30 ou Bip&Go Fréquence) offrent jusqu’à 30 % de réduction si vous réalisez au moins 20 trajets identiques par mois.'
      }
    ]
  },
  {
    slug: 'classes-vehicules-peage-autoroute',
    title: 'Classes de véhicules au péage : comment éviter d’être surclassé ?',
    metaTitle: 'Classes de Péage Autoroute en France (1 à 5) : Règles et Tarifs',
    metaDescription: 'Classe 1, 2, 3, 4 ou 5 : découvrez la grille officielle des classes de péage en France, l’impact des coffres de toit et comment corriger une erreur.',
    summary: 'Entre la classe 1 (voiture) et la classe 2 (utilitaire/van), les tarifs de péage augmentent en moyenne de 50 %. Hauteur maximale de 2 mètres, chargement sur le toit et tolérances des capteurs.',
    readTime: '5 min',
    publishedAt: '2026-02-15',
    updatedAt: '2026-11-22',
    sections: [
      {
        heading: '1. La classification officielle en 5 catégories',
        content: [
          'Le tarif du péage dépend exclusivement du gabarit physique de votre ensemble de véhicules :',
          '• Classe 1 (Véhicules légers) : hauteur totale ≤ 2 mètres ET poids total autorisé en charge (PTAC) ≤ 3,5 tonnes. Concerne toutes les berlines, citadines, breaks, SUV et monospaces standards.',
          '• Classe 2 (Véhicules intermédiaires) : hauteur totale supérieure à 2 m et strictement inférieure à 3 m, avec PTAC ≤ 3,5 t. Concerne les grands utilitaires légers, camping-cars et vans aménagés.',
          '• Classe 3 (Poids lourds 2 essieux) : hauteur ≥ 3 m ou PTAC > 3,5 t à deux essieux.',
          '• Classe 4 (Poids lourds 3 essieux et plus) : ensembles routiers, camions articulés et autocars.',
          '• Classe 5 (Deux-roues) : motocyclettes, side-cars et tricycles à moteur (tarif réduit d’environ 40 % par rapport à la classe 1).'
        ]
      },
      {
        heading: '2. Un coffre de toit ou des vélos font-ils changer de classe ?',
        content: [
          'Règle fondamentale : les accessoires transportés sur le toit (coffre de toit, galerie, porte-vélos, skis) NE DOIVENT PAS être pris en compte dans le calcul de la hauteur.',
          'Si votre voiture mesure 1,75 m et dépasse 2 m avec son coffre de toit, vous restez légalement en Classe 1.',
          'Cependant, les cellules de mesure optiques automatisées des barrières mesurent le point le plus haut sans faire la différence. Il arrive fréquemment qu’une berline équipée d’un coffre de toit soit automatiquement détectée en Classe 2.'
        ]
      },
      {
        heading: '3. Que faire si l’écran de la barrière affiche "Classe 2" par erreur ?',
        content: [
          'NE PAYEZ PAS IMMÉDIATEMENT. Appuyez sur le bouton d’interphone d’assistance (bouton avec pictogramme combiné ou cloche).',
          'Indiquez à l’opérateur vocal : « Bonjour, je suis un véhicule léger de classe 1 avec un coffre de toit, l’automate m’a surclassé en classe 2 ».',
          'L’opérateur vérifie la caméra vidéo de contrôle et rectifie manuellement la tarification en classe 1 en quelques secondes.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Une remorque attelée fait-elle changer de classe ?',
        answer: 'Si la hauteur de la voiture ET de la remorque ne dépasse pas 2 mètres (et PTAC total ≤ 3,5 t), vous restez en Classe 1. Si la remorque mesure entre 2 et 3 mètres de haut (ex: van à chevaux), l’ensemble passe en Classe 2.'
      },
      {
        question: 'Comment sont classés les pick-up américains ?',
        answer: 'La plupart des pick-up (Ford Ranger, Toyota Hilux) mesurent moins de 1,90 m d’origine et relèvent de la classe 1, sauf si une rehausse de suspension ou un hard-top dépasse la limite fatidique des 2 mètres.'
      },
      {
        question: 'Peut-on se faire rembourser après coup en cas d’erreur de classe avec un badge télépéage ?',
        answer: 'Oui, depuis votre espace client en ligne (Ulys ou Bip&Go), vous pouvez contester le trajet débité en transmettant la carte grise du véhicule pour obtenir le remboursement du trop-perçu.'
      }
    ]
  },
  {
    slug: 'astuces-payer-moins-cher-autoroute',
    title: 'Comment payer moins cher l’autoroute : astuces et techniques légales',
    metaTitle: 'Économiser sur les Péages d’Autoroute : 5 Astuces Légales 2026',
    metaDescription: 'Découvrez la technique du fractionnement de sortie, les contournements gratuits et le covoiturage pour économiser jusqu’à 30 % sur vos trajets d’autoroute.',
    summary: 'Les tarifs des concessions autoroutières ne sont pas proportionnels à la distance. En fractionnant vos sorties ou en combinant autoroute et voies express gratuites, vous pouvez réduire la facture de 10 € à 30 € par trajet.',
    readTime: '6 min',
    publishedAt: '2026-02-22',
    updatedAt: '2026-11-22',
    sections: [
      {
        heading: '1. L’astuce du fractionnement de trajet (foisonnement)',
        content: [
          'En raison de l’histoire des concessions et des barèmes fiscaux, le prix d’un trajet continu de A à C est souvent supérieur à la somme du trajet de A à B puis de B à C.',
          'En sortant de l’autoroute à un échangeur intermédiaire, en faisant immédiatement demi-tour au rond-point et en reprenant l’autoroute, vous pouvez économiser entre 10 % et 25 % sur votre facture globale.',
          'Par exemple, sur le trajet Paris-Bordeaux (A10), sortir et re-rentrer à certains échangeurs clés permet d’économiser près de 7 € pour moins de 3 minutes perdues.'
        ]
      },
      {
        heading: '2. Emprunter les sections gratuites à 2x2 voies (N10, N4, A20, A75)',
        content: [
          'La France dispose d’un réseau exceptionnel de routes nationales aménagées aux normes autoroutières (2x2 voies séparées, chaussées séparées à 110 km/h) totalement gratuites :',
          '• Sur Paris-Bordeaux : quittez l’A10 à Poitiers pour prendre la N10 gratuite jusqu’à Bordeaux. Vous économisez plus de 25 € de péage pour seulement 25 minutes de trajet en plus.',
          '• Sur Paris-Toulouse : l’A20 est gratuite sur 270 km entre Vierzon et Brive-la-Gaillarde.',
          '• Sur Paris-Strasbourg : la N4 entre la banlieue parisienne et Nancy fait économiser la quasi-totalité du péage de l’A4.',
          '• Vers l’Espagne et le Sud : l’A75 (La Méridienne) traverse le Massif central gratuitement jusqu’à Béziers (seul le viaduc de Millau est à péage, et peut être évité en traversant la commune).'
        ]
      },
      {
        heading: '3. Faire le plein hors des aires d’autoroute',
        content: [
          'Le carburant vendu sur les stations-service d’autoroute est en moyenne 15 à 25 centimes plus cher par litre qu’en dehors.',
          'Sur un plein de 50 litres, sortir 5 minutes de l’autoroute pour ravitailler dans une station de grande distribution (Leclerc, Carrefour, Intermarché) fait économiser entre 8 € et 12 € supplémentaires.',
          'Consultez notre comparateur Ododex Prix des Carburants (/fr/prix-carburants) pour repérer la station la moins chère à 2 minutes de votre sortie !'
        ]
      }
    ],
    faqs: [
      {
        question: 'Le fractionnement de sortie est-il légal ?',
        answer: 'Oui, à 100 %. Vous êtes totalement libre de quitter et de rejoindre le réseau autoroutier autant de fois que vous le désirez.'
      },
      {
        question: 'Le badge télépéage fonctionne-t-il si l’on fractionne ses sorties ?',
        answer: 'Parfaitement. Le badge enregistre chaque sous-trajet de manière transparente et vous bénéficiez automatiquement du tarif fractionné plus avantageux.'
      },
      {
        question: 'Le covoiturage permet-il de réduire le péage ?',
        answer: 'Sur certaines autoroutes (ex: A48 à l’entrée de Grenoble, A43 à Lyon, voie réservée VR2+ de l’A1), les véhicules transportant au moins 2 personnes peuvent emprunter des voies réservées et bénéficient de tarifs préférentiels sur certaines offres partenaires.'
      }
    ]
  }
];

export function getAllGuides(): GuideArticle[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find(g => g.slug === slug);
}
