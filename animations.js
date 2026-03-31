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
          // Clear inline transform after animation so CSS hover (translateY) works
          clearProps: "transform",
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

    // ── 8. FALLING PARTICLES ───────────────────────────────────────────────
    const particleCount = isDesktop ? 22 : 11;

    const particlesContainer = document.createElement("div");
    particlesContainer.setAttribute("aria-hidden", "true");
    Object.assign(particlesContainer.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "0",
      overflow: "hidden",
    });
    document.body.prepend(particlesContainer);

    // Shape variants: circle, small square, tiny diamond (square rotated 45°)
    const shapes = ["circle", "square", "diamond"];

    for (let i = 0; i < particleCount; i++) {
      const size      = gsap.utils.random(2.5, 9);
      const shape     = shapes[Math.floor(Math.random() * shapes.length)];
      const isTeal    = Math.random() > 0.4;
      const opacity   = gsap.utils.random(0.15, 0.5);
      const startX    = gsap.utils.random(1, 99);       // % from left
      const startY    = gsap.utils.random(-20, 80);     // starting vh
      const fallDist  = gsap.utils.random(70, 200);     // vh to fall
      const spinDelta = gsap.utils.random(-90, 90);     // rotation change while falling
      const scrub     = gsap.utils.random(1.2, 4.5);    // slower = floatier

      const color = isTeal
        ? `rgba(20, 184, 166, ${opacity})`
        : `rgba(232, 69, 99, ${opacity * 0.85})`;

      const el = document.createElement("div");
      Object.assign(el.style, {
        position:     "absolute",
        width:        `${size}px`,
        height:       `${size}px`,
        left:         `${startX}%`,
        top:          `${startY}vh`,
        background:   color,
        borderRadius: shape === "circle"  ? "50%"
                    : shape === "square"  ? "2px"
                    :                       "3px",       // diamond gets border-radius too
        transform:    shape === "diamond" ? `rotate(45deg)` : `rotate(${gsap.utils.random(0, 30)}deg)`,
        willChange:   "transform",
      });

      particlesContainer.appendChild(el);

      gsap.to(el, {
        y:        `${fallDist}vh`,
        rotation: `+=${spinDelta}`,
        ease:     "none",
        scrollTrigger: {
          trigger: document.body,
          start:   "top top",
          end:     "bottom bottom",
          scrub,
        },
      });
    }

    // Cleanup: remove container when matchMedia conditions change
    return () => particlesContainer.remove();
  }
);
