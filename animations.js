gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    reduceMotion: "(prefers-reduced-motion: reduce)",
    isDesktop: "(min-width: 769px)",
  },
  (context) => {
    const { reduceMotion, isDesktop } = context.conditions;

    if (reduceMotion) return;

    // ── 1. HEADER ENTRANCE ─────────────────────────────────────────────────
    const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    headerTl
      .from(".logo-sinergia", { autoAlpha: 0, x: -28, duration: 0.7 })
      .from(".partner-badge", { autoAlpha: 0, x: 28, duration: 0.6 }, "<0.1");

    if (isDesktop) {
      headerTl.from(".nav-links li", {
        autoAlpha: 0,
        y: -10,
        stagger: 0.07,
        duration: 0.45,
      }, 0.25);
    }

    // ── 2. NAVBAR HIDE / SHOW ON SCROLL DIRECTION ──────────────────────────
    const header = document.querySelector(".site-header");

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate(self) {
        if (self.scroll() < 80) {
          gsap.to(header, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
          return;
        }
        if (self.direction === 1) {
          gsap.to(header, { yPercent: -100, duration: 0.3, ease: "power2.in", overwrite: true });
        } else {
          gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.out", overwrite: true });
        }
      },
    });

    // ── 3. SECTION SCROLL-IN ───────────────────────────────────────────────
    gsap.utils.toArray(".section").forEach((section) => {
      gsap.from(section, {
        autoAlpha: 0,
        y: 48,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    // ── 4. CARDS STAGGER ───────────────────────────────────────────────────
    ScrollTrigger.batch(".card", {
      onEnter: (elements) => {
        gsap.from(elements, {
          autoAlpha: 0,
          y: 36,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
          overwrite: true,
        });
      },
      start: "top 88%",
      once: true,
    });

    // ── 5. SUBTLE PARALLAX ON SECTION HEADINGS ─────────────────────────────
    if (isDesktop) {
      gsap.utils.toArray(".section h2").forEach((h2) => {
        gsap.to(h2, {
          y: -22,
          ease: "none",
          scrollTrigger: {
            trigger: h2.closest(".section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }

    // ── 6. CTA BUTTON HOVER ────────────────────────────────────────────────
    document.querySelectorAll(".cta").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.05,
          y: -2,
          duration: 0.18,
          ease: "power1.out",
          overwrite: "auto",
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          y: 0,
          duration: 0.2,
          ease: "power1.in",
          overwrite: "auto",
        });
      });
    });

    // ── 7. NAV LINKS HOVER (desktop) ──────────────────────────────────────
    if (isDesktop) {
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, { y: -2, duration: 0.15, ease: "power1.out", overwrite: "auto" });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, { y: 0, duration: 0.15, ease: "power1.in", overwrite: "auto" });
        });
      });
    }
  }
);
