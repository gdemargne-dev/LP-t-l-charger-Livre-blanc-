// Landing page salon RENT 2026 : comparateurs avant/après, compte à rebours, bouton fixe mobile
// et formulaire de prise de rendez-vous relié au formulaire web Zoho CRM.
// Zoho n'accepte pas les envois en JavaScript (fetch) depuis un autre site : le formulaire est envoyé
// normalement vers une iframe cachée, puis la page affiche son propre message de remerciement.
// Les prospects arrivent dans Zoho avec « Origine du Prospect = Salon RENT 2026 ».

(function () {
  // ---------- Comparateurs avant / après ----------
  document.querySelectorAll(".compare__range").forEach(function (range) {
    const figure = range.closest(".compare");
    range.addEventListener("input", function () {
      figure.style.setProperty("--pos", range.value + "%");
    });
  });

  // ---------- Compte à rebours jusqu'à l'ouverture du salon ----------
  const countdown = document.getElementById("countdown");
  const opening = new Date("2026-11-04T09:00:00+01:00");
  const closing = new Date("2026-11-05T19:00:00+01:00");
  const now = new Date();
  if (now < opening) {
    const days = Math.ceil((opening - now) / 86400000);
    countdown.innerHTML = days > 1
      ? "Plus que <strong>" + days + " jours</strong> avant l'ouverture du salon"
      : "Le salon ouvre <strong>demain</strong>&nbsp;!";
    countdown.hidden = false;
  } else if (now < closing) {
    countdown.innerHTML = "<strong>Le salon a lieu en ce moment</strong>&nbsp;: passez nous voir&nbsp;!";
    countdown.hidden = false;
  }

  // ---------- Bouton fixe sur mobile, masqué quand les boutons du haut ou le formulaire sont visibles ----------
  const sticky = document.getElementById("sticky-cta");
  if ("IntersectionObserver" in window) {
    const visible = new Set();
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      sticky.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.1 });
    observer.observe(document.querySelector(".rent-hero__ctas"));
    observer.observe(document.getElementById("rdv"));
  }

  // ---------- Formulaire ----------
  const form = document.getElementById("lead-form");
  const iframe = document.getElementById("zoho-target");
  const errorBox = document.getElementById("form-error");
  const success = document.getElementById("form-success");
  const button = form.querySelector("button[type=submit]");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const TEL_RE = /^[0-9 .\-()]{6,20}$/;

  function isValid(el) {
    if (el.type === "checkbox") return el.checked;
    if (el.type === "radio") return !!form.querySelector("input[name='" + el.name + "']:checked");
    const v = el.value.trim();
    if (!v) return !el.required;
    if (el.type === "email") return EMAIL_RE.test(v);
    if (el.type === "tel") return TEL_RE.test(v);
    return true;
  }

  function mark(el, ok) {
    let target = el;
    if (el.type === "checkbox") target = el.closest(".consent");
    if (el.type === "radio") target = el.closest(".choices");
    target.classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", ok ? "false" : "true");
  }

  function requiredFields() {
    return form.querySelectorAll(".field input, .field select, #consentement, .choices input[type=radio][required]");
  }

  function checkedValues(name) {
    return Array.prototype.map.call(form.querySelectorAll("input[name='" + name + "']:checked"), function (el) {
      return el.value;
    });
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") mark(e.target, isValid(e.target));
  });
  form.addEventListener("change", function (e) {
    if (e.target.type === "checkbox" && e.target.id === "consentement") mark(e.target, isValid(e.target));
    if (e.target.type === "radio") {
      const first = form.querySelector("input[name='" + e.target.name + "'][required]");
      if (first) mark(first, isValid(first));
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let firstInvalid = null;
    requiredFields().forEach(function (el) {
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

    // Le créneau et les centres d'intérêt sont regroupés dans le champ « Description » du prospect.
    const moment = checkedValues("moment");
    const interets = checkedValues("interet");
    document.getElementById("description").value = [
      "Salon RENT 2026 - rendez-vous sur le stand",
      "Créneau souhaité : " + checkedValues("jour").concat(moment.length ? moment : ["indifférent"]).join(", "),
      "Intérêt : " + (interets.length ? interets.join(" / ") : "non précisé")
    ].join("\n");

    button.disabled = true;
    button.textContent = "Envoi en cours…";

    // La réponse de Zoho (dans l'iframe) n'est pas lisible depuis la page : on affiche le remerciement
    // dès qu'elle est chargée, avec un délai maximum au cas où l'événement n'arrive pas.
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      form.hidden = true;
      success.hidden = false;
    }
    iframe.addEventListener("load", finish, { once: true });
    setTimeout(finish, 6000);

    HTMLFormElement.prototype.submit.call(form);
  });
})();
