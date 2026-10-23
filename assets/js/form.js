// Formulaire de téléchargement du livre blanc, relié au formulaire web Zoho CRM « LIVRE BLANC ANNONCE VEFA ».
// Zoho n'accepte pas les envois en JavaScript (fetch) depuis un autre site : le formulaire est envoyé
// normalement vers une iframe cachée, puis la page affiche son propre message de remerciement.
// Les prospects arrivent dans Zoho avec « Origine du Prospect = Livre blanc annonce VEFA ».

(function () {
  const form = document.getElementById("lead-form");
  const iframe = document.getElementById("zoho-target");
  const errorBox = document.getElementById("form-error");
  const success = document.getElementById("form-success");
  const button = form.querySelector("button[type=submit]");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const TEL_RE = /^[0-9 .\-()]{6,20}$/;

  function isValid(el) {
    if (el.type === "checkbox") return el.checked;
    const v = el.value.trim();
    if (!v) return !el.required;
    if (el.type === "email") return EMAIL_RE.test(v);
    if (el.type === "tel") return TEL_RE.test(v);
    return true;
  }

  function mark(el, ok) {
    const target = el.type === "checkbox" ? el.closest(".consent") : el;
    target.classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", ok ? "false" : "true");
  }

  function visibleFields() {
    return form.querySelectorAll("input:not([type=hidden]):not([name=aG9uZXlwb3Q]), select");
  }

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") mark(e.target, isValid(e.target));
  });
  form.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") mark(e.target, isValid(e.target));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let firstInvalid = null;
    visibleFields().forEach(function (el) {
      const ok = isValid(el);
      mark(el, ok);
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      errorBox.hidden = false;
      firstInvalid.focus();
      return;
    }
    errorBox.hidden = true;

    // Zoho reçoit le numéro complet, indicatif compris, dans le champ « Portable ».
    const tel = document.getElementById("telephone").value.trim().replace(/^0/, "");
    document.getElementById("mobile-complet").value = document.getElementById("indicatif").value + " " + tel;

    button.disabled = true;
    button.textContent = "Envoi en cours…";

    // La réponse de Zoho (dans l'iframe) n'est pas lisible depuis la page : on affiche le remerciement
    // dès qu'elle est chargée, avec un délai maximum au cas où l'événement n'arrive pas.
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      showSuccess();
    }
    iframe.addEventListener("load", finish, { once: true });
    setTimeout(finish, 6000);

    HTMLFormElement.prototype.submit.call(form);
  });
})();
