# Péages & Autoroutes France 2026 — Ododex (`/fr/peages`)

Calculateur officiel des tarifs de péages d'autoroutes en France, comparateur de temps et coût face aux routes nationales gratuites, et guide des péages sans barrière en flux libre (A13 et A79).

- **URL en production** : [https://ododex.com/fr/peages](https://ododex.com/fr/peages)
- **Worker Cloudflare** : `ododex-peages`
- **Portail parent** : [Ododex](https://ododex.com/fr/)

---

## 🎯 Fonctionnalités Clés

1. **Calculateur de Péages Multiclasse 2026** :
   - Tarifs officiels actualisés 2026 pour Classe 1 (voitures), Classe 2 (utilitaires, camping-cars, vans avec coffre de toit) et Classe 5 (motos).
   - Couverture des 17 autoroutes concédées (A1, A4, A6, A7, A8, A9, A10, A11, A13, A20, A61, A62, A63, A71, A75, A79, A89) et de 35 grandes villes de France.
   - Estimation du budget carburant (essence, gazole, électrique) et coût global du trajet.
2. **Alerte Péage en Flux Libre (Free-Flow)** :
   - Détection automatique sur l'A13 (Paris - Normandie) et l'A79 (Allier).
   - Rappel légal de paiement obligatoire sous 72 heures en ligne pour éviter l'indemnité forfaitaire de 90 € à 375 €.
3. **Comparateur Autoroute vs Route Nationale** :
   - Arbitrage direct argent économisé vs temps perdu.
4. **Monétisation** :
   - Affiliation télépéage : Partenariats avec les badges Liber-t (*Ulys Vinci Autoroutes, Bip&Go Sanef*), avec 5 € à 15 € de commission par souscription.
   - Bannières AdSense conformes TCF v2.2 sans CLS.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router) en export statique.
- **Moteur de calcul** : `lib/peages.ts` avec gestion bidirectionnelle et algorithme de repli Haversine.
- **SEO** : 55 pages statiques pré-générées, Schema.org `FAQPage` et `BreadcrumbList`.

---

## 🚀 Développement Local & Tests

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Exécuter les 18 tests unitaires
npm test

# Compiler l'export statique
npm run build
```
