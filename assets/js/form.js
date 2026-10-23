// Formulaire de téléchargement du livre blanc.
// Renseigner FORM_ENDPOINT avec l'URL de collecte des leads (Zoho CRM, Brevo, webhook Zapier/Make…).
// Les données sont envoyées en POST (JSON). Laissé vide, le formulaire affiche directement le lien de téléchargement.
const FORM_ENDPOINT = "";

(function () {
  const form = document.getElementById("lead-form");
  const errorBox = document.getElementById("form-error");
  const success = document.getElementById("form-success");
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

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") mark(e.target, isValid(e.target));
  });
  form.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") mark(e.target, isValid(e.target));
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll("input, select").forEach(function (el) {
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

    const data = Object.fromEntries(new FormData(form).entries());
    data.telephone_complet = data.indicatif + " " + data.telephone;
    data.source = "LP livre blanc - L'annonce VEFA qui génère des contacts";
    data.page = window.location.href;

    if (FORM_ENDPOINT) {
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      button.textContent = "Envoi en cours…";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.status);
      } catch (err) {
        button.disabled = false;
        button.textContent = "Recevoir le livre blanc";
        errorBox.textContent = "Une erreur est survenue, merci de réessayer ou de nous écrire à hello@arlynk.com.";
        errorBox.hidden = false;
        return;
      }
    }

    form.hidden = true;
    success.hidden = false;
  });
})();
