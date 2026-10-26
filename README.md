# Landing page – Livre blanc « L'annonce VEFA qui génère des contacts »

Landing page de téléchargement du livre blanc Arlynk, à la charte du site [arlynk.com](https://arlynk.com/)
(violet `#5a18a5`, framboise `#c1164b`, dégradé bordeaux → violet, police Montserrat).

## Structure

- `index.html` : la page (texte, formulaire, bloc à propos, contact, mentions RGPD)
- `assets/css/style.css` : styles, responsive mobile
- `assets/js/form.js` : validation du formulaire et envoi des leads
- `assets/img/` : logos Arlynk et couverture du livre blanc
- `assets/livre-blanc-annonce-vefa.pdf` : le livre blanc proposé au téléchargement

## Collecte des leads (Zoho CRM)

Le formulaire envoie les prospects au formulaire web Zoho CRM « LIVRE BLANC ANNONCE VEFA »
(module Prospects, `https://crm.zoho.com/crm/WebToLeadForm`). Les identifiants du formulaire
(`xnQsjsdp`, `xmIwtLD`, `actionType`) sont dans `index.html` : ne pas les modifier.

Champs envoyés : `Last Name`, `First Name`, `Email`, `Mobile` (indicatif + numéro), `Company`,
`Designation` (fonction) et `Lead Source` = « Livre blanc annonce VEFA ». C'est cette origine qui
sert de condition à la règle Zoho qui envoie le livre blanc par e-mail.

Zoho n'accepte pas les envois en JavaScript depuis un autre site : `assets/js/form.js` valide le
formulaire, l'envoie vers une iframe cachée, puis affiche le message de remerciement.

Si le formulaire est recréé dans Zoho, reprendre les nouvelles valeurs des champs cachés depuis
son code source.

## Mise en ligne

La page est publiée avec GitHub Pages sur `https://livre-blanc.arlynk.com` (fichier `CNAME`).

1. GitHub → Settings → Pages : Source « Deploy from a branch », branche
   `claude/landing-page-vefa-whitepaper-x4j99x`, dossier `/ (root)`.
2. DNS de arlynk.com : enregistrement `CNAME` `livre-blanc` → `gdemargne-dev.github.io`.
3. Une fois le domaine vérifié par GitHub, cocher « Enforce HTTPS ».

## Aperçu local

Ouvrir `index.html` dans un navigateur, ou lancer `npx serve .` à la racine.

---

# Landing page – Salon RENT 2026 (Styl'Ai)

Page d'atterrissage de la campagne SMS invitant les prospects sur le stand SF01 (Arlynk · Styl'Ai) au salon
RENT 2026 (4 et 5 novembre, Paris Expo Porte de Versailles). Publiée sur
`https://livre-blanc.arlynk.com/rent-2026/`.

- `rent-2026/index.html` : la page (accroche, deux propositions, démo live, offre 990 € HT / 1 200 crédits,
  prise de rendez-vous, contact)
- `rent-2026/rent.css` : styles propres à la page, en complément de `assets/css/style.css`
- `rent-2026/rent.js` : comparateurs avant/après, compte à rebours, bouton fixe mobile, formulaire
- `rent-2026/rent-2026-arlynk.ics` : invitation agenda (4 et 5 novembre)
- `rent-2026/img/` : visuels Styl'Ai (avant/après) et logo


## Formulaire (Zoho CRM)

Le formulaire réutilise les identifiants du formulaire web Zoho du livre blanc, avec
`Lead Source` = « Salon RENT 2026 » (la règle d'envoi du livre blanc ne se déclenche donc pas).
Le jour, le moment et les centres d'intérêt sont regroupés dans le champ `Description`.

À vérifier dans Zoho : la valeur « Salon RENT 2026 » doit exister dans la liste « Origine du prospect »,
et le champ « Description » doit faire partie du formulaire web. Le plus propre est de créer un formulaire
web dédié « SALON RENT 2026 » et de reporter ses champs cachés (`xnQsjsdp`, `xmIwtLD`, `actionType`)
dans `rent-2026/index.html`.

Pour suivre la campagne SMS, utiliser un lien du type
`https://livre-blanc.arlynk.com/rent-2026/?utm_source=sms&utm_campaign=rent2026`.
