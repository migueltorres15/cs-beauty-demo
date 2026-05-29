(function () {
  "use strict";
  /* CS Beauty — main.js | Archetype: Editorial Light Cream | Tigre Studio 2026-05-28 */

  /* ── Safe wrapper: one failing init never breaks the rest ── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[CS Beauty]", name, e.message || e); }
  }

  /* ── Splash ─────────────────────────────────────────────── */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;

    function hide() {
      if (splash.classList.contains("is-out")) return;
      splash.classList.add("is-out");
    }

    /* Hide at 1.8s (after the brand animation completes) */
    if (document.readyState === "complete") {
      setTimeout(hide, 1800);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 1800); });
    }

    /* JS safety net at 4s (CSS animation fires at 4.5s) */
    setTimeout(hide, 4000);
  }

  /* ── Nav ────────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;

    /* Scroll effect: transparent → opaque */
    function onScroll() {
      if (window.scrollY > 55) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Mobile hamburger */
    var toggle = nav.querySelector(".nav__toggle");
    var drawer = document.getElementById("navMobile");
    if (!toggle || !drawer) return;

    toggle.addEventListener("click", function () {
      var isOpen = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });

    /* Close drawer on any link click */
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
      });
    });
  }

  /* ── Smooth anchor scroll ───────────────────────────────── */
  function initSmoothScroll() {
    var NAV_OFFSET = 80;
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ── Hero parallax (GSAP + ScrollTrigger) ────────────────── */
  function initHeroParallax() {
    var img = document.querySelector(".hero__img");
    if (!img) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    window.gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ─────────────── */
  function initReveals() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    /* Stagger: add delay based on visual order within parent */
    targets.forEach(function (el) {
      var siblings = Array.from(el.parentElement.querySelectorAll("[data-reveal]"));
      var idx = siblings.indexOf(el);
      if (idx > 0 && idx < 4) {
        el.style.transitionDelay = (idx * 0.08) + "s";
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "0px 0px -2% 0px"
    });

    targets.forEach(function (el) { io.observe(el); });

    /* 6-second safety: force-reveal anything in/near viewport still hidden */
    setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains("is-revealed")) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 120) {
            el.style.transitionDelay = "0s";
            el.classList.add("is-revealed");
          }
        }
      });
    }, 6000);
  }

  /* ── Gallery hover tilt (subtle) ────────────────────────── */
  function initGalleryHover() {
    document.querySelectorAll(".galeria__item").forEach(function (item) {
      item.addEventListener("mouseover", function (e) {
        if (!item.contains(e.relatedTarget)) {
          item.style.zIndex = "2";
        }
      });
      item.addEventListener("mouseout", function (e) {
        if (!item.contains(e.relatedTarget)) {
          item.style.zIndex = "";
        }
      });
    });
  }

  /* ── Booking form → WhatsApp ─────────────────────────────── */
  function initAgendaForm() {
    var form = document.getElementById("agendaForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre   = (form.nombre.value   || "").trim();
      var tel      = (form.tel.value      || "").trim();
      var servicio = (form.servicio.value || "").trim();
      var fecha    = (form.fecha.value    || "").trim();
      var hora     = (form.hora.value     || "").trim();
      var notas    = (form.notas.value    || "").trim();

      if (!nombre || !tel || !servicio) {
        form.nombre.reportValidity();
        return;
      }

      var lines = [
        "Hola Cynthia! Me gustaría agendar una cita en CS Beauty 💄",
        "",
        "👤 Nombre: " + nombre,
        "📱 WhatsApp: " + tel,
        "✨ Servicio: " + servicio,
        fecha ? "📅 Fecha: " + fecha : "",
        hora  ? "🕐 Hora: " + hora   : "",
        notas ? "📝 Notas: " + notas : ""
      ].filter(Boolean).join("\n");

      window.open("https://wa.me/522221258551?text=" + encodeURIComponent(lines), "_blank");
    });
  }

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    safe(initSplash,        "initSplash");
    safe(initNav,           "initNav");
    safe(initSmoothScroll,  "initSmoothScroll");
    safe(initReveals,       "initReveals");
    safe(initGalleryHover,  "initGalleryHover");
    safe(initAgendaForm,    "initAgendaForm");

    /* GSAP features — only if library is loaded */
    if (window.gsap && window.ScrollTrigger) {
      safe(initHeroParallax, "initHeroParallax");
    }
  }

  /* Run after DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
