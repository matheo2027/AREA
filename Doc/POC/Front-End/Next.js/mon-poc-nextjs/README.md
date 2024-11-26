Ceci est un projet [Next.js](https://nextjs.org) initialisé avec [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Démarrage
Tout d'abord, lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.
Vous pouvez commencer à modifier la page en éditant `pages/index.js`. La page se mettra automatiquement à jour lorsque vous sauvegarderez vos modifications.
[Les routes API](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) sont accessibles via [http://localhost:3000/api/hello](http://localhost:3000/api/hello). Vous pouvez modifier ce point de terminaison dans `pages/api/hello.js`.
Le répertoire `pages/api` est mappé sur `/api/*`. Les fichiers de ce répertoire sont traités comme des [routes API](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) au lieu de pages React.
Ce projet utilise [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une nouvelle famille de polices développée par Vercel.

## En savoir plus
Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn-pages-router) - un tutoriel interactif sur Next.js.

Vous pouvez également visiter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Déployer sur Vercel
La façon la plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) créée par les développeurs de Next.js.

Consultez notre [documentation sur le déploiement de Next.js](https://nextjs.org/docs/pages/building-your-application/deploying) pour plus de détails.