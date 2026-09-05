# Cave à vin

Petite app mobile pour inventorier tes bouteilles : photo de l'étiquette (avant/verso) + quantité.

## Déployer sur GitHub + Vercel

1. Crée un nouveau repo GitHub (public ou privé, peu importe) et pousse ces 5 fichiers
   (`index.html`, `manifest.json`, `icon.svg`, `sw.js`, `README.md`) à la racine.
2. Va sur [vercel.com](https://vercel.com), clique **Add New → Project**, importe ce repo.
3. Aucune configuration nécessaire : c'est un site statique. Laisse "Framework Preset: Other"
   et "Build Command" vide, "Output Directory" = `./`. Clique **Deploy**.
4. Vercel te donne une URL du type `cave-a-vin.vercel.app`. Ouvre-la sur ton téléphone,
   ajoute-la à l'écran d'accueil (Safari : Partager → Sur l'écran d'accueil / Chrome Android :
   ⋮ → Ajouter à l'écran d'accueil) pour un accès en un tap, comme une vraie app.

## Configurer le mot de passe (variable d'environnement)

Le mot de passe est vérifié **côté serveur** par une fonction Vercel (`api/verify.js`), pas
dans le code envoyé au navigateur — il n'apparaît jamais dans le code source de la page,
et n'est jamais commité dans le repo GitHub.

1. Sur Vercel : **Project Settings → Environment Variables**, ajoute une variable
   `PASSWORD` avec la valeur de ton choix (ex. `passdepasse`), pour l'environnement
   "Production" (et "Preview"/"Development" si tu veux tester ailleurs).
2. Redéploie le projet (Vercel le fait automatiquement au prochain push, ou clique
   **Redeploy** dans le dashboard) pour que la variable soit prise en compte.
3. Pour tester en local avec `vercel dev` : copie `.env.example` en `.env.local` et
   modifie la valeur — ce fichier est ignoré par git (`.gitignore`), il ne sera jamais poussé.

Pour changer le mot de passe plus tard, il suffit de modifier la valeur de `PASSWORD` dans
Vercel et de redéployer — aucun changement de code nécessaire.

⚠️ Nuance importante côté usage : comme la vérification passe maintenant par une fonction
serveur, **il faut du réseau pour déverrouiller l'app**. Une fois déverrouillée dans l'onglet
en cours (le flag reste en mémoire de session), tu peux continuer à l'utiliser hors-ligne sans
problème — mais si tu fermes complètement le navigateur/l'app en étant hors-ligne, tu devras
retrouver du réseau pour te reconnecter. Si ça devient gênant en pratique en cave, on peut
revenir à une vérification côté client (moins sécurisée, mais 100% utilisable hors-ligne).

## Comment ça marche techniquement

- **Stockage** : les bouteilles sont sauvegardées avec `localStorage`, directement sur l'appareil.
  Ça persiste après fermeture de l'app et fonctionne sans réseau.
- **Hors-ligne** : un service worker (`sw.js`) met l'app en cache dès la première visite, donc elle
  se recharge même sans réseau ensuite (utile en cave si le signal est faible).
- **Un appareil = une cave locale** : les données ne se synchronisent pas automatiquement entre
  ton téléphone et ton ordinateur. Utilise les boutons **Exporter** (télécharge un fichier `.json`)
  et **Importer** pour transférer ou sauvegarder ta cave d'un appareil à l'autre.
- **Verrouillage** : le mot de passe déverrouille l'app pour la session en cours (`sessionStorage`).
  Le bouton **🔒 Verrouiller** en haut permet de reverrouiller manuellement.
