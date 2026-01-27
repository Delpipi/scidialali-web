# SCI DIALALI - Real Estate Management Platform

## A propos

En tant qu’ingénieur logiciel, j’ai développé cette application web full-stack afin d’approfondir ma compréhension des systèmes d’authentification modernes, de l’intégration d’API et de la gestion d’état avec Next.js. Le projet se concentre sur la mise en place d’une authentification sécurisée avec Firebase, l’intégration d’un backend FastAPI et la création d’une expérience utilisateur fluide combinant rendu côté serveur et interactivité côté client.

SCI DIALALI est une plateforme de gestion immobilière qui permet aux utilisateurs de gérer des biens, des utilisateurs et des données associées via un tableau de bord sécurisé. L’application propose un contrôle d’accès basé sur les rôles, une authentification JWT et une synchronisation des données en temps réel avec un backend FastAPI.

### Démarrage

**Prérequis:**

- Node.js 18+ and pnpm installed
- FastAPI backend running (optional for full functionality)

**Installation et configuration:**

1. Cloner le dépôt

```bash
git clone <your-repo-url>
cd scidialali-web
```

2. Installer les dépendances

```bash
pnpm install
```

3. Configurer les variables d’environnement
   Create a `.env.local` file at the root:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
# API
API_BASE_URLL=http://localhost:8000
```

4. Lancer le serveur de développement

```bash
pnpm run dev
```

5. Ouvrir votre navigateur et accéder à `http://localhost:3000`

### Objectif

Ce projet a été développé afin de:

- Maîtriser l’architecture App Router de Next.js 14+ et les Server Components
- Pratiquer l’intégration d’API entre un frontend Next.js et un backend FastAPI
- Explorer des systèmes de typage TypeScript avancés et l’extension de modules
- Construire des composants réutilisables selon les standards modernes de React
- Comprendre la gestion des tokens JWT et des sessions
- Implémenter la protection des routes via des middlewares

[Software Demo Video](https://youtu.be/BmVMEuQ4QXg)

## Pages Web

### 1. Page de connexion (`/login`)

Point d’entrée de l’application avec un formulaire d’authentification épuré. Les utilisateurs saisissent leur adresse e-mail et leur mot de passe, validés via Firebase Authentication. Après une connexion réussie, un token JWT est attribué et l’utilisateur est redirigé vers le tableau de bord:

- Validation du formulaire en temps réel
- Messages d’erreur pour les identifiants invalides
- États de chargement pendant l’authentification
- Redirection automatique des utilisateurs déjà authentifiés

### 2. Accueil du tableau de bord (`/{role}`)

Page principale après authentification, offrant une vue d’ensemble du compte utilisateur et un accès rapide aux fonctionnalités clés:

- Informations du profil utilisateur depuis la session
- Liens de navigation vers toutes les sections principales
- Contenu conditionné par le rôle (les administrateurs voient plus d’options)

### 3. Gestion des utilisateurs (`/admin/users`)

Interface complète de gestion des utilisateurs réservée aux administrateurs:

- Tableau dynamique affichant tous les utilisateurs enregistrés
- Récupération des données en temps réel depuis le backend FastAPI
- Indicateurs de rôles (admin, locataire et prospect)
- Suppression avec boîtes de dialogue de confirmation
- Pagination côté serveur pour les grands volumes de données

### 4. Gestion des biens / propriétés (`/admin/estates`)

Page de gestion immobilière permettant de :

- Consulter tous les biens enregistrés
- Ajouter de nouvelles propriétés
- Modifier les informations existantes
- Supprimer des biens avec autorisation appropriée
- Filtrer et rechercher des propriétés
- Visualiser les détails (images, descriptions, prix, etc.)

### Flux de navigation

L’application utilise l’App Router de Next.js avec une navigation côté client pour des transitions fluides:

- Utilisateur non authentifié accédant à une route protégée → redirection vers `/login`
- Connexion réussie → redirection vers `/{role}` (or `callbackUrl` si défini)
- Utilisateur authentifié accédant à `/login` → edirection automatique vers `/{role}`
- Navigation via la barre latérale pour un accès instantané aux sections
- Déconnexion → suppression de la session et redirection vers `/login`

Toutes les pages implémentent un chargement dynamique du contenu grâce à:

- Server Components pour le chargement initial des données (SEO friendly)
- Client Components pour les éléments interactifs (formulaires, boutons, modales)
- Server Actions pour les opérations CRUD
- Mises à jour optimistes de l’UI pour une meilleure expérience utilisateur

## Environnement de développement

### Outils et technologies

**Framework Frontend:**

- Next.js 16.0.3 (App Router)
- React 19
- TypeScript 5.x

**Authentification et autorisation:**

- NextAuth.js 4.x

**Styles:**

- Tailwind CSS 3.x
- Lucide React
- Configuration Tailwind personnalisée avec extensions de thème

**Outils de développement:**

- pnpm (gestionnaire de paquets)
- ESLint (analyse statique du code)
- VS Code (IDE)
- Git (gestion de versions)

**Intégration Backend:**

- FastAPI (Python)

### Langages et bibliothèques

**TypeScript/JavaScript:**

- **Next.js** - Framework React avec rendu côté serveur et App Router
- **NextAuth.js** - Solution d’authentification basée sur JWT
- **React Hooks** - useState, useEffect, useSession pour la gestion d’état
- **next/navigation** - useRouter, useSearchParams pour le routage

**Bibliothèques clés:**

- `@lucide-react` - Composants d’icônes
- `tailwindcss` - Framework CSS utilitaire
- `typescript` - Typage statique et productivité développeur

**Python (Backend):**

- `fastapi` - Framework API moderne
- `uvicorn` - Serveur ASGI

**Architecture Patterns:**

- Server Components pour le chargement des données
- Client Components pour l’interactivité
- Server Actions pour les mutations
- Middlewares pour la protection des routes
- Séparation des responsabilités (lib/actions.ts, lib/auth.ts)

## Useful Websites

- [Next.js Documentation](https://nextjs.org/docs) - Guide complet App Router 14+
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentification
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Styles et composants
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Bonnes pratiques
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Développement d’API
- [React Documentation](https://react.dev/) - Hooks et fonctionnalités modernes
- [MDN Web Docs](https://developer.mozilla.org/) - Standards du Web
- [Stack Overflow](https://stackoverflow.com/) - Support communautaire

## Contact

**Email:** alexandrepaulkouame@gmail.com  
**Mobile:**  +225 01 41 42 96 28
