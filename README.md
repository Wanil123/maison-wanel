# Maison Wanél

Maison Wanél est une boutique de mode fictive conçue pour présenter un parcours e-commerce en React. Le catalogue, les prix, les promotions et les calculs de livraison sont des données de démonstration. Aucun achat, paiement, courriel ou expédition réelle n'est effectué.

## Ce que montre le projet

- Catalogue bilingue français/anglais avec recherche, filtres et tri.
- Fiches produit, variantes, favoris et panier conservés localement.
- Code promotionnel, sous-total, livraison simulée et taxes estimées calculés de façon cohérente du panier au récapitulatif.
- Parcours de validation de démonstration sans collecte de coordonnées personnelles ou bancaires.
- Interface responsive, thème clair/sombre, navigation clavier et états vides.

La page **À propos** explique la portée du projet dans l'interface. Les données produit et certaines photos servent uniquement à illustrer le concept. Elles ne constituent pas une offre commerciale.

## Technologies

React 19, React Router 7, Vite 7, Tailwind CSS 3, Framer Motion, Vitest et Testing Library.

## Démarrer

Node.js 20.19 ou plus récent est requis.

```bash
npm ci
npm run dev
```

La commande `npm run dev` affiche l'adresse locale de la démo. Pour préparer et contrôler une version de production :

```bash
npm run lint
npm test
npm run build
npm run preview
```

Le build se trouve dans `dist/`. Le site public est hébergé sur GitHub Pages à `https://wanil123.github.io/maison-wanel/`. La version GitHub Pages utilise des URL avec `#/` pour permettre l'accès direct aux pages internes. Pour créer localement la même version, définir `GITHUB_PAGES=true` avant `npm run build`.

## Limites et suite possible

Ce projet est une démonstration front-end, sans inventaire, authentification, API marchande, compte client ou paiement. Une mise en production commerciale nécessiterait un backend, une gestion réelle du stock et des commandes, un prestataire de paiement, des contenus et photographies sous licence appropriée, ainsi que des politiques légales adaptées à l'entreprise.

Code et design : Wanil Parfait.
