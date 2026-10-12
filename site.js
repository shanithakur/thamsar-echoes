/* ------------------------------------------------------------------
   EDIT THESE LINES — everything on the site points at them.
   phone: with country code, no spaces. instagram: username only.
------------------------------------------------------------------ */
const CONTACT = {
  phone: "+918219667142",
  instagram: "thamser.echoes",
};

const WHATSAPP_MESSAGE =
  "Hello Thamsar Echoes! I would like to book a stay in Rajgundha Valley.";

/* ------------------------------------------------------------------
   GOOGLE RATING — fill these in from your listing and the section
   appears. Leave rating as null and it stays hidden, so nothing
   invented ever goes live.
------------------------------------------------------------------ */
const GOOGLE_REVIEWS = {
  rating: 4.3,
  count: 9,
  url: "https://maps.app.goo.gl/CWvBi8RMSiuv8ZZd7",
  quotes: [
    {
      text: "Superb location; happened to be a decent pitstop for us, clean rooms, nice dining area. Madan bhai is very helpful. Do buy the local Rajma from here too :)",
      author: "Hitesh Chanana",
      when: "Jun 2026",
    },
    {
      text: "Rooms are excellent and clean. We took breakfast, maggi is amazing. Front view is also good. Owner is also supportive and friendly.",
      author: "Neeraj Swami",
      when: "Jun 2026",
    },
    {
      text: "Very good home stay.",
      author: "Rajiv Thakur",
      when: "Jul 2026",
    },
  ],
};

/* ---------------------------- contact links --------------------------- */
const digits = CONTACT.phone.replace(/\D/g, "");
const waLink = `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll("[data-book]").forEach((el) => {
  const message = el.dataset.message || WHATSAPP_MESSAGE;
  el.href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});
const phoneDisplay = CONTACT.phone.replace(
  /^\+91(\d{5})(\d{5})$/,
  (_, a, b) => `+91 ${a} ${b}`
);
document.querySelectorAll("[data-call]").forEach((el) => {
  el.href = `tel:${CONTACT.phone}`;
});
document.querySelectorAll("[data-phone]").forEach((el) => {
  el.textContent = phoneDisplay;
});
document.querySelectorAll("[data-instagram]").forEach((el) => {
  el.href = `https://instagram.com/${CONTACT.instagram}`;
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* --------------------- floating WhatsApp CTA (mobile) ----------------- */
const floatBook = document.getElementById("float-book");
if (floatBook) {
  const bookSection = document.getElementById("book");
  const mobileMenu = document.getElementById("mobile-menu");
  const lightboxEl = document.getElementById("lightbox");

  const updateFloat = () => {
    const scrolled = window.scrollY > window.innerHeight * 0.45;
    const bookVisible =
      bookSection &&
      (() => {
        const r = bookSection.getBoundingClientRect();
        return r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25;
      })();
    const menuOpen = mobileMenu && !mobileMenu.classList.contains("hidden");
    const lbOpen = lightboxEl && !lightboxEl.classList.contains("hidden");
    floatBook.classList.toggle("is-visible", scrolled && !bookVisible && !menuOpen && !lbOpen);
  };

  updateFloat();
  window.addEventListener("scroll", updateFloat, { passive: true });
  window.addEventListener("resize", updateFloat);
  // menu / lightbox toggles also call class changes — observe them
  if (mobileMenu) {
    new MutationObserver(updateFloat).observe(mobileMenu, { attributes: true, attributeFilter: ["class"] });
  }
  if (lightboxEl) {
    new MutationObserver(updateFloat).observe(lightboxEl, { attributes: true, attributeFilter: ["class"] });
  }
}

/* ------------------------------- gallery ------------------------------ */
const PHOTOS = [
  ["exterior-01", "The house seen from the field below"],
  ["view-02", "Ridge lines from a guest room window"],
  ["room-02", "Double bed beside the valley window"],
  ["dining-01", "The dining room"],
  ["valley-06", "Forest falling away into the valley"],
  ["exterior-05", "The house from the hillside"],
  ["view-04", "Wooden window framing the mountains"],
  ["lounge-02", "The village shop and sitting corner"],
  ["valley-03", "Meadows and cloud over the ridge"],
  ["room-03", "The corner room"],
  ["produce-02", "Rajma grown on these slopes"],
  ["valley-04", "The road in, and the fields"],
  ["bath-01", "Bathroom with hot water"],
  ["exterior-07", "The front door"],
  ["valley-07", "The road winding down through the valley"],
  ["dining-04", "Tables set for dinner"],
];

const grid = document.getElementById("grid");
if (grid) {
  grid.innerHTML = PHOTOS.map(
    ([file, caption], i) => `
    <button
      class="group relative block w-full overflow-hidden rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-moss"
      data-index="${i}"
      aria-label="View photo: ${caption}"
    >
      <img
        src="images/web/${file}-sm.jpg"
        alt="${caption}"
        loading="lazy"
        class="w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <span class="pointer-events-none absolute inset-0 bg-ink/0 transition group-hover:bg-ink/20"></span>
    </button>`
  ).join("");
}

/* ------------------------------ lightbox ------------------------------ */
const lightbox = document.getElementById("lightbox");
if (lightbox && grid) {
  const lbImg = document.getElementById("lb-img");
  let current = 0;

  const showPhoto = (i) => {
    current = (i + PHOTOS.length) % PHOTOS.length;
    const [file, caption] = PHOTOS[current];
    lbImg.src = `images/web/${file}.jpg`;
    lbImg.alt = caption;
    gsap.fromTo(lbImg, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.35 });
  };

  const closeLightbox = () => {
    lightbox.classList.replace("flex", "hidden");
    document.body.classList.remove("locked");
  };

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    lightbox.classList.replace("hidden", "flex");
    document.body.classList.add("locked");
    showPhoto(Number(btn.dataset.index));
  });

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-next").addEventListener("click", () => showPhoto(current + 1));
  document.getElementById("lb-prev").addEventListener("click", () => showPhoto(current - 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showPhoto(current + 1);
    if (e.key === "ArrowLeft") showPhoto(current - 1);
  });
}

/* Walk photographs use the same viewer, with their own set of pictures. */
const walkGallery = document.getElementById("walk-gallery");
if (lightbox && walkGallery) {
  const lbImg = document.getElementById("lb-img");
  const shots = [...walkGallery.querySelectorAll("[data-shot]")];
  let current = 0;

  const showShot = (i) => {
    if (!shots.length) return;
    current = (i + shots.length) % shots.length;
    const img = shots[current].querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    if (window.gsap) gsap.fromTo(lbImg, { opacity: 0.6 }, { opacity: 1, duration: 0.35 });
  };

  const closeShot = () => {
    lightbox.classList.replace("flex", "hidden");
    document.body.classList.remove("locked");
  };

  walkGallery.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-shot]");
    if (!btn) return;
    lightbox.classList.replace("hidden", "flex");
    document.body.classList.add("locked");
    showShot(shots.indexOf(btn));
  });

  document.getElementById("lb-close").addEventListener("click", closeShot);
  document.getElementById("lb-next").addEventListener("click", () => showShot(current + 1));
  document.getElementById("lb-prev").addEventListener("click", () => showShot(current - 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeShot();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("flex")) return;
    if (e.key === "Escape") closeShot();
    if (e.key === "ArrowRight") showShot(current + 1);
    if (e.key === "ArrowLeft") showShot(current - 1);
  });
}

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

/* ----------------------------- google rating -------------------------- */
const reviewsHost = document.getElementById("reviews");
if (reviewsHost) {
  const { rating, count, url, quotes } = GOOGLE_REVIEWS;

  if (!rating) {
    reviewsHost.remove();
  } else {
    const star = (cls) =>
      `<svg viewBox="0 0 24 24" class="${cls}" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.6.95-4.8 4.65 1.14 6.5L12 17.5l-5.84 3-1.14-6.5L.22 9.35l6.6-.95z"/></svg>`;
    const row = (cls) => `<span class="flex gap-1">${star(cls).repeat(5)}</span>`;

    reviewsHost.innerHTML = `
      <div data-reveal class="mx-auto max-w-5xl text-center">
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-moss">Guest reviews</p>

        <div class="mt-8 inline-flex w-full max-w-md flex-col items-center gap-4 rounded-sm border border-ink/10 bg-white px-6 py-7 shadow-sm sm:w-auto sm:px-10 sm:py-8">
          <div class="flex items-center gap-4">
            <span class="font-display text-6xl leading-none">${rating}</span>
            <div class="text-left">
              <div class="relative inline-block">
                ${row("h-5 w-5 text-ink/15")}
                <span class="absolute inset-0 overflow-hidden" style="width:${(rating / 5) * 100}%">
                  ${row("h-5 w-5 shrink-0 text-amber-500")}
                </span>
              </div>
              <p class="mt-1.5 text-sm text-ink/60">
                ${count ? `${count} reviews on Google` : "on Google"}
              </p>
            </div>
          </div>
          <a
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-semibold text-moss underline-offset-4 transition hover:underline"
          >
            Read the reviews on Google
          </a>
        </div>

        ${
          quotes && quotes.length
            ? `<div class="mt-12 grid gap-6 text-left md:grid-cols-3">
                ${quotes
                  .map(
                    (q) => `
                  <figure class="rounded-sm bg-white p-7 shadow-sm ring-1 ring-ink/5">
                    <div class="flex gap-1 text-amber-500">${star("h-4 w-4").repeat(5)}</div>
                    <blockquote class="mt-4 text-[0.95rem] leading-relaxed text-ink/75">“${q.text}”</blockquote>
                    <figcaption class="mt-5 text-sm text-ink/50">
                      ${q.author}${q.when ? ` · ${q.when}` : ""}
                    </figcaption>
                  </figure>`
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>`;
  }
}

/* --------------------- rating badge in the hero ----------------------- */
const heroRating = document.getElementById("hero-rating");
if (heroRating && GOOGLE_REVIEWS.rating) {
  heroRating.innerHTML = `
    <a
      href="${GOOGLE_REVIEWS.url}"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white backdrop-blur-sm transition hover:border-white/60"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4 text-amber-400" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 5.9 6.6.95-4.8 4.65 1.14 6.5L12 17.5l-5.84 3-1.14-6.5L.22 9.35l6.6-.95z"/>
      </svg>
      <span class="font-semibold">${GOOGLE_REVIEWS.rating}</span>
      <span class="text-white/60">on Google</span>
    </a>`;
}

/* ----------------------------- mobile menu ---------------------------- */
const menu = document.getElementById("mobile-menu");
const menuBtn = document.getElementById("menu-btn");
if (menu && menuBtn) {
  const setMenu = (open) => {
    menu.classList.toggle("hidden", !open);
    menu.classList.toggle("flex", open);
    document.body.classList.toggle("locked", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  };

  menuBtn.addEventListener("click", () => setMenu(true));
  document.getElementById("menu-close").addEventListener("click", () => setMenu(false));
  document.querySelectorAll(".m-link").forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

/* ------------------------------ nav on scroll ------------------------- */
const nav = document.getElementById("nav");
if (nav) {
  const updateNav = () => {
    const solid = window.scrollY > window.innerHeight * 0.7;
    nav.classList.toggle("bg-ink/90", solid);
    nav.classList.toggle("backdrop-blur-md", solid);
    nav.classList.toggle("shadow-lg", solid);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
}

/* -------------------------------- motion ------------------------------ */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduced) {
  document.documentElement.classList.add("no-motion");
} else {
  gsap.registerPlugin(ScrollTrigger);

  const has = (sel) => document.querySelector(sel) !== null;

  /* split text into word-sized masks so lines can rise into view */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="inline-block overflow-hidden pb-[0.18em] -mb-[0.18em] align-bottom"><span class="inline-block">${w}</span></span>`
      )
      .join(" ");
    return el.querySelectorAll("span > span");
  }

  /* ------------------------------ hero ------------------------------ */
  const heroVisual = document.querySelector("#hero-media") || document.querySelector("#hero-img");
  const heroTitle = document.getElementById("hero-title");

  if (heroTitle) {
    const heroWords = splitWords(heroTitle);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroVisual) tl.from(heroVisual, { scale: 1.16, duration: 2.4, ease: "power2.out" }, 0);
    if (has("#nav")) tl.from("#nav", { y: -24, opacity: 0, duration: 0.9 }, 0.1);
    if (has("#hero-eyebrow")) tl.from("#hero-eyebrow", { y: 18, opacity: 0, duration: 0.8 }, 0.25);
    tl.from(heroWords, { yPercent: 115, duration: 1.1, stagger: 0.09 }, 0.35);
    if (has("#hero-sub")) tl.from("#hero-sub", { y: 20, opacity: 0, duration: 0.8 }, 0.9);
    if (has("#hero-cta")) tl.from("#hero-cta", { y: 18, opacity: 0, duration: 0.8 }, 1.05);
    if (has(".fact-strip > div"))
      tl.from(".fact-strip > div", { y: 26, opacity: 0, duration: 0.7, stagger: 0.08 }, 1.15);
  }

  /* --------------------------- scroll progress ----------------------- */
  if (has("#progress")) {
    gsap.to("#progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: () => document.body.scrollHeight - innerHeight, scrub: 0.3 },
    });
  }

  /* ------------------------------ parallax --------------------------- */
  if (heroVisual && has("#top")) {
    gsap.to(heroVisual, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ----------------- hero slideshow, gently and late ----------------- */
  const media = document.getElementById("hero-media");
  const slides = media ? gsap.utils.toArray(".hero-slide", media) : [];

  if (slides.length > 1) {
    let index = 0;

    const advance = () => {
      if (document.visibilityState === "hidden") return;
      const next = (index + 1) % slides.length;
      const incoming = slides[next];
      if (!incoming.src) return;

      media.appendChild(incoming); // stack it on top before fading in
      gsap.to(incoming, { opacity: 1, duration: 2, ease: "power1.inOut" });
      gsap.to(slides[index], { opacity: 0, duration: 2, delay: 0.6, ease: "power1.inOut" });
      index = next;
    };

    window.addEventListener("load", () => {
      setTimeout(() => {
        slides.forEach((s) => {
          if (s.dataset.src) s.src = s.dataset.src;
        });
        setInterval(advance, 8000);
      }, 1500);
    });
  }

  gsap.utils.toArray("[data-parallax]").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  /* ------------------------- section choreography -------------------- */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.set(el, { opacity: 1 });

    const kids = Array.from(el.children);
    const targets = kids.length ? kids : [el];
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        once: true,
        // if the block is already on screen (or jumped to via #hash), play immediately
        toggleActions: "play none none none",
      },
    });

    targets.forEach((kid, i) => {
      const at = i * 0.09;

      if (kid.matches("h1, h2")) {
        tl.from(splitWords(kid), { yPercent: 115, duration: 1, stagger: 0.055 }, at);
        return;
      }

      if (kid.matches("img")) {
        tl.from(kid, { scale: 1.12, opacity: 0, duration: 1.2, ease: "power2.out" }, at);
        return;
      }

      tl.from(kid, { y: 20, opacity: 0, duration: 0.7 }, at);

      const list = kid.matches("ul[data-stagger]") ? kid : kid.querySelector("ul[data-stagger]");
      if (list) {
        tl.from(list.children, { y: 16, opacity: 0, duration: 0.6, stagger: 0.07 }, at + 0.15);
      }
    });
  });

  // lazy images change page height — keep triggers accurate for the bottom of the page
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  });

  /* ---------------------- image grids, card by card ------------------ */
  function cascade(selector, from, to, start = "top 88%") {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    gsap.set(els, from);
    ScrollTrigger.batch(els, {
      start,
      onEnter: (batch) => gsap.to(batch, { ...to, overwrite: true }),
    });
  }

  cascade(
    "#stay .grid img, #experiences article, .reach-card, .shop-card, .product-card",
    { opacity: 0, y: 44 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }
  );

  cascade(
    "#grid button",
    { opacity: 0, y: 30, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.06, ease: "power2.out" }
  );

  /* --------------------------- places nearby ------------------------- */
  const places = gsap.utils.toArray("#explore .place");
  if (places.length) {
    gsap.set(places, { opacity: 0, x: -28 });
    ScrollTrigger.batch(places, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, x: 0, duration: 0.8, stagger: 0.09, ease: "power3.out", overwrite: true }),
    });

    gsap.from("[data-explore-line]", {
      scaleY: 0,
      ease: "none",
      scrollTrigger: { trigger: "#explore ul", start: "top 78%", end: "bottom 65%", scrub: 0.4 },
    });
  }

  /* --------------------------- the pull quote ------------------------ */
  const quote = document.querySelector("[data-quote]");
  if (quote) {
    gsap.from(splitWords(quote), {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: 0.03,
      ease: "power3.out",
      scrollTrigger: { trigger: quote, start: "top 80%" },
    });
  }

  /* ------------------ slow drift on the quieter photos --------------- */
  gsap.utils.toArray("#food img, #welcome img").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}
