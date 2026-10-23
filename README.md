# Landing page – Livre blanc « L'annonce VEFA qui génère des contacts »

Landing page de téléchargement du livre blanc Arlynk, à la charte du site [arlynk.com](https://arlynk.com/)
(violet `#5a18a5`, framboise `#c1164b`, dégradé bordeaux → violet, police Montserrat).

## Structure

- `index.html` : la page (texte, formulaire, bloc à propos, contact, mentions RGPD)
- `assets/css/style.css` : styles, responsive mobile
- `assets/js/form.js` : validation du formulaire et envoi des leads
- `assets/img/` : logos Arlynk et couverture du livre blanc
- `assets/livre-blanc-annonce-vefa.pdf` : le livre blanc proposé au téléchargement

## Brancher la collecte des leads

Dans `assets/js/form.js`, renseigner `FORM_ENDPOINT` avec l'URL qui reçoit les leads
(formulaire Zoho CRM, Brevo, webhook Zapier/Make…). Les données sont envoyées en POST JSON :
`nom`, `prenom`, `email`, `indicatif`, `telephone`, `telephone_complet`, `societe`, `fonction`,
`consentement`, `source`, `page`.

Tant que `FORM_ENDPOINT` est vide, le formulaire est validé côté navigateur puis affiche directement
le bouton de téléchargement du PDF (aucune donnée n'est enregistrée).

## Aperçu local

Ouvrir `index.html` dans un navigateur, ou lancer `npx serve .` à la racine.
