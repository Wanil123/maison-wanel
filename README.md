# LuxeMode

Boutique e-commerce de mode premium — Femme, Homme, Enfant. Construite avec React 19, Vite 7, Tailwind 3 et Framer Motion.

> Une expérience d'achat raffinée, accessible, et bilingue (FR/EN), inspirée d'une palette **Bordeaux Luxe**.

---

## Sommaire
- [Fonctionnalités](#fonctionnalités)
- [Stack](#stack)
- [Démarrer en local](#démarrer-en-local)
- [Scripts](#scripts)
- [Structure](#structure)
- [Design system](#design-system)
- [Accessibilité](#accessibilité)
- [SEO](#seo)
- [Sécurité](#sécurité)
- [Déploiement](#déploiement)
- [Roadmap](#roadmap)
- [Licence](#licence)

---

## Fonctionnalités

- 🛍️ **Catalogue** complet avec filtres (genre, catégorie), tri, recherche
- 🧺 **Panier** persistant (localStorage), promo codes, calcul livraison/taxes
- 💳 **Checkout** en 3 étapes avec validation (Luhn, code postal CA, date d'expiration), CGV requises
- ❤️ **Wishlist** avec « Tout ajouter au panier »
- 🌐 **Bilingue** FR/EN avec persistance
- 🌗 **Mode sombre** avec persistance et respect `prefers-color-scheme`
- ♿ **Accessibilité** WCAG-friendly : focus trap, skip-link, ARIA, `prefers-reduced-motion`
- 🔍 **Recherche** instantanée dans le header
- 🪄 **Confetti** canvas thématique (or, champagne, bordeaux)
- 🧠 **ErrorBoundary** global + reload automatique sur `ChunkLoadError`
- 🔁 **Sync multi-onglets** du panier et de la wishlist via `storage` event
- 🔎 **SEO** : meta dynamiques par page, JSON-LD `Organization`, `WebSite`, `Product`

---

## Stack

- **React 19** (StrictMode)
- **Vite 7** (build & dev server)
- **React Router 7** (lazy routes + Suspense)
- **Tailwind CSS 3** + design tokens custom (palette Bordeaux Luxe)
- **Framer Motion 12** (animations performantes)
- **Lucide React** (icônes)

---

## Démarrer en local

```bash
# Installer les dépendances
npm install

# Lancer le dev server (HMR)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

Pré-requis : **Node.js ≥ 20.19** (voir `.nvmrc` si présent, ou `engines` dans `package.json`).

---

## Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Démarre Vite en mode développement       |
| `npm run build`  | Compile pour la production dans `dist/`  |
| `npm run preview`| Sert le build de production en local     |
| `npm run lint`   | Exécute ESLint sur tout le projet        |

---

## Structure

```
src/
├── components/
│   ├── Hero.jsx
│   ├── ProductCard.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Toast.jsx
│       ├── Badge.jsx
│       └── ErrorBoundary.jsx
├── context/
│   └── AppContext.jsx       # State global (cart, wishlist, lang, theme, toasts)
├── data/
│   ├── products.js          # Catalogue (30 produits)
│   └── translations.js      # i18n FR/EN
├── hooks/
│   └── usePageMeta.js       # SEO meta dynamique par page
├── pages/
│   ├── Shop.jsx
│   ├── Product.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Thanks.jsx
│   ├── Wishlist.jsx
│   └── About.jsx
├── utils/
│   └── confetti.js          # Canvas confetti (palette Bordeaux Luxe)
├── App.jsx
├── main.jsx
└── index.css
```

---

## Design system

Palette **Bordeaux Luxe** déclinée comme tokens Tailwind et variables CSS :

| Token            | Hex      | Usage                          |
| ---------------- | -------- | ------------------------------ |
| `luxury-noir`    | #1E0F21  | Fonds sombres, headers dark    |
| `luxury-charcoal`| #2D1B30  | Surfaces sombres secondaires   |
| `luxury-wine`    | #6B2D4A  | Accents bordeaux, hovers       |
| `luxury-plum`    | #4A1E3A  | Dégradés profonds              |
| `accent`         | #C9A96E  | Doré principal (CTA, focus)    |
| `accent-light`   | #E8D5B0  | Doré clair (hovers)            |
| `luxury-rose`    | #D4A0A0  | Texte secondaire sur sombre    |
| `luxury-ivory`   | #FAF4EB  | Fond clair                     |
| `luxury-champagne`| #F5E6CC | Sélection, mises en avant      |

Typographies :
- Sans : `Inter` (300–900)
- Serif : `Playfair Display` (400–900) — titres luxe

Easings :
- `--ease-luxe` `cubic-bezier(0.23, 1, 0.32, 1)` — cards, images
- `--ease-emphasis` `cubic-bezier(0.77, 0, 0.175, 1)` — reveals

---

## Accessibilité

- **Skip-to-content** sur la première tabulation
- **Focus visible** doré (token `--color-accent`) systématique
- **Focus trap** dans le menu mobile et la modale de recherche
- **Body scroll lock** quand une modale est ouverte
- **ARIA** complet : `role="dialog"`, `aria-modal`, `aria-expanded`, `aria-current`, `aria-live`
- **`prefers-reduced-motion`** : toutes les animations sont neutralisées (grain, marquee, scroll smooth, confetti)
- **Labels** : tous les inputs ont un `<label htmlFor>`, les boutons icônes ont un `aria-label`
- **Contraste** : palette Bordeaux respecte WCAG AA sur les combinaisons principales

---

## SEO

- Meta dynamiques par page via le hook `usePageMeta` (title, description, og, canonical)
- **JSON-LD** : `Organization`, `WebSite` (search action), `Product` (sur la PDP avec prix, rating, dispo)
- `robots.txt` + `manifest.webmanifest`
- `og-image.svg` vectoriel pour les previews sociaux
- `lang` attribut synchronisé avec la langue active (`fr-CA` / `en`)

---

## Sécurité

Headers configurés dans `netlify.toml` :
- `Content-Security-Policy` (script/style/img/font restreints)
- `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options`
- `Referrer-Policy`, `Permissions-Policy`
- Cache `immutable` 1 an sur les assets hashés, `must-revalidate` sur HTML

Côté front :
- ErrorBoundary global avec recovery automatique des `ChunkLoadError`
- localStorage validé à la lecture (Array, types attendus) — résiste à la corruption
- Validation de formulaire stricte (Luhn, code postal CA, expiry, email)
- Aucun `dangerouslySetInnerHTML`, aucun `target="_blank"` sans `rel="noopener noreferrer"`

---

## Déploiement

Configuré pour **Netlify** out-of-the-box :
1. Connecter le repo
2. Le `netlify.toml` définit `build` et `publish`
3. Les headers de sécurité et le cache sont appliqués automatiquement

---

## Roadmap

- [ ] Migration TypeScript
- [ ] Tests Vitest + Playwright
- [ ] PWA complète (service worker, offline)
- [ ] Authentification + compte utilisateur
- [ ] Vrais avis clients
- [ ] Backend Headless CMS (Shopify Storefront / Sanity)
- [ ] Analytics (Plausible/PostHog) avec events e-commerce
- [ ] Multi-devise (CAD/USD/EUR)

---

## Licence

© 2026 LuxeMode. Tous droits réservés.

Développé avec ❤️ par **Wanil Parfait**.
