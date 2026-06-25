/* ============================================
   GIORGI TSERTSVADZE — PORTFOLIO MAIN.JS
   ============================================ */

// ---- ADVANCED 3D BACKGROUND ----
(function initBackground() {
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");

  let W,
    H,
    mouse = { x: 0, y: 0 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // --- PARTICLES ---
  const PARTICLE_COUNT = 120;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.z = Math.random() * 0.8 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.1;
      this.vy = -(Math.random() * 0.15 + 0.05) * this.z;
      this.radius = Math.random() * 1.5 + 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? "#0066ff" : "#00f5d4";
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.008 + 0.002;
    }
    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.vx += (dx / dist) * 0.005;
        this.vy += (dy / dist) * 0.005;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      if (this.y < -10) this.reset(false);
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
    }
    draw() {
      const glow = Math.sin(this.pulse) * 0.3 + 0.7;
      ctx.save();
      ctx.globalAlpha = this.opacity * glow;
      const grad = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 4,
      );
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // --- CONNECTIONS ---
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 130) * 0.12;
          ctx.strokeStyle = "#00f5d4";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // --- FLOWING WAVE LINES ---
  let waveOffset = 0;
  function drawWaves() {
    const waves = [
      {
        amp: 60,
        freq: 0.008,
        speed: 0.003,
        y: H * 0.25,
        color: "rgba(0,245,212,0.04)",
      },
      {
        amp: 80,
        freq: 0.006,
        speed: 0.002,
        y: H * 0.5,
        color: "rgba(0,102,255,0.04)",
      },
      {
        amp: 50,
        freq: 0.01,
        speed: 0.003,
        y: H * 0.75,
        color: "rgba(0,245,212,0.03)",
      },
      {
        amp: 70,
        freq: 0.007,
        speed: 0.002,
        y: H * 0.35,
        color: "rgba(0,102,255,0.03)",
      },
    ];
    waves.forEach((w, wi) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, w.y);
      for (let x = 0; x <= W; x += 4) {
        const y =
          w.y +
          Math.sin(x * w.freq + waveOffset * w.speed * 60 + wi) * w.amp +
          Math.sin(x * w.freq * 2 + waveOffset * w.speed * 40) * (w.amp * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = w.color;
      ctx.fill();
      ctx.restore();

      // wave line on top
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, w.y);
      for (let x = 0; x <= W; x += 4) {
        const y =
          w.y +
          Math.sin(x * w.freq + waveOffset * w.speed * 60 + wi) * w.amp +
          Math.sin(x * w.freq * 2 + waveOffset * w.speed * 40) * (w.amp * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = w.color.replace("0.0", "0.15");
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });
    waveOffset++;
  }

  // --- GRID PULSE ---
  let gridPulse = 0;
  function drawGrid() {
    gridPulse += 0.005;
    const alpha = Math.sin(gridPulse) * 0.015 + 0.02;
    const spacing = 55;
    ctx.save();
    ctx.strokeStyle = `rgba(0,245,212,${alpha})`;
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- FLOATING HEX SHAPES ---
  const hexes = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 40 + 20,
    vx: (Math.random() - 0.5) * 0.06,
    vy: (Math.random() - 0.5) * 0.06,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.001,
    opacity: Math.random() * 0.06 + 0.02,
    color: i % 2 === 0 ? "#00f5d4" : "#0066ff",
  }));

  function drawHex(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = rot + (Math.PI / 3) * i;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function updateDrawHexes() {
    hexes.forEach((h) => {
      h.x += h.vx;
      h.y += h.vy;
      h.rot += h.rotSpeed;
      if (h.x < -h.r) h.x = W + h.r;
      if (h.x > W + h.r) h.x = -h.r;
      if (h.y < -h.r) h.y = H + h.r;
      if (h.y > H + h.r) h.y = -h.r;
      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.strokeStyle = h.color;
      ctx.lineWidth = 1;
      drawHex(h.x, h.y, h.r, h.rot);
      ctx.stroke();
      drawHex(h.x, h.y, h.r * 0.6, h.rot + Math.PI / 6);
      ctx.stroke();
      ctx.restore();
    });
  }

  // --- SCANLINE SWEEP ---
  let scanY = 0;
  function drawScanline() {
    scanY = (scanY + 0.3) % H;
    const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, "rgba(0,245,212,0.025)");
    grad.addColorStop(1, "transparent");
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 60, W, 120);
    ctx.restore();
  }

  // --- CORNER GLOWS ---
  function drawCornerGlows() {
    const glows = [
      { x: 0, y: 0, color: "#00f5d4" },
      { x: W, y: H, color: "#0066ff" },
      { x: W, y: 0, color: "#0066ff" },
      { x: 0, y: H, color: "#00f5d4" },
    ];
    glows.forEach((g) => {
      const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, W * 0.35);
      grad.addColorStop(
        0,
        g.color
          .replace(")", ",0.06)")
          .replace("rgb", "rgba")
          .replace("#00f5d4", "rgba(0,245,212,0.06)")
          .replace("#0066ff", "rgba(0,102,255,0.06)"),
      );
      grad.addColorStop(1, "transparent");
      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    });
  }

  // --- MAIN LOOP ---
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawCornerGlows();
    drawGrid();
    drawWaves();
    updateDrawHexes();
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawScanline();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ---- CUSTOM CURSOR ----
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const trail = document.getElementById("cursor-trail");
  let mx = 0,
    my = 0,
    tx = 0,
    ty = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + "px";
    trail.style.top = ty + "px";
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document
    .querySelectorAll("a, button, .project-card, .edu-card, .timeline-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "18px";
        cursor.style.height = "18px";
        trail.style.width = "48px";
        trail.style.height = "48px";
        trail.style.opacity = "0.8";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "10px";
        cursor.style.height = "10px";
        trail.style.width = "32px";
        trail.style.height = "32px";
        trail.style.opacity = "0.5";
      });
    });
})();

// ---- NAVBAR SCROLL ----
(function initNavbar() {
  const nav = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const links = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });

  hamburger.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
})();

// ---- TYPED TEXT ----
(function initTyped() {
  const el = document.getElementById("typed");
  const phrases = [
    "Data Engineer",
    "Software Engineering Student",
    "Freelance Web Developer",
    "Database Specialist",
    "Full-Stack Builder",
  ];
  let pi = 0,
    ci = 0,
    deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 85);
  }
  setTimeout(type, 1400);
})();

// ---- COUNT-UP STATS ----
(function initCountUp() {
  const stats = document.querySelectorAll(".stat-num");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 30);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(interval);
        }, 50);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  stats.forEach((s) => observer.observe(s));
})();

// ---- SCROLL REVEAL ----
(function initReveal() {
  const items = document.querySelectorAll(
    "[data-reveal], .timeline-item, .skill-category, .project-card, .edu-card, .contact-left, .contact-right",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  items.forEach((el) => observer.observe(el));
})();

// ---- SKILL BAR ANIMATION ----
(function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.dataset.width;
          setTimeout(() => {
            fill.style.width = width + "%";
          }, 200);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 },
  );
  fills.forEach((f) => observer.observe(f));
})();

// ---- EMAILJS + CONTACT FORM ----
(function initContactForm() {
  emailjs.init("58Vx3dkhYAbbwQD_a");

  const form = document.getElementById("contact-form");
  const popup = document.getElementById("email-popup");
  const popupIcon = document.getElementById("popup-icon");
  const popupTitle = document.getElementById("popup-title");
  const popupMsg = document.getElementById("popup-msg");
  const popupClose = document.getElementById("popup-close");

  function showPopup(success) {
    if (success) {
      popupIcon.textContent = "✓";
      popupIcon.className = "popup-icon";
      popupTitle.textContent = "MESSAGE SENT";
      popupMsg.textContent =
        "Your message has been delivered. I'll get back to you soon.";
    } else {
      popupIcon.textContent = "✕";
      popupIcon.className = "popup-icon error";
      popupTitle.textContent = "SEND FAILED";
      popupMsg.textContent =
        "Something went wrong. Please try emailing directly at tsertsvadzegio56@gmail.com";
    }
    popup.classList.remove("hidden");
  }

  popupClose.addEventListener("click", () => popup.classList.add("hidden"));
  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.classList.add("hidden");
  });

  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = "SENDING...";
    btn.disabled = true;

    const templateParams = {
      from_name: document.getElementById("form-name").value.trim(),
      from_email: document.getElementById("form-email").value.trim(),
      message: document.getElementById("form-message").value.trim(),
    };

    try {
      await emailjs.send("service_o8y1b2e", "template_88i6old", templateParams);
      await emailjs.send("service_o8y1b2e", "template_o1nvn2b", templateParams);
      showPopup(true);
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      showPopup(false);
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
})();

// ---- GLITCH HOVER ----
(function initGlitchHover() {
  const name = document.querySelector(".hero-name");
  if (!name) return;
  let interval;
  name.addEventListener("mouseenter", () => {
    let count = 0;
    interval = setInterval(() => {
      name.style.textShadow =
        count % 2 === 0
          ? "2px 0 #00f5d4, -2px 0 #ff2d55"
          : "-2px 0 #00f5d4, 2px 0 #ff2d55";
      count++;
      if (count > 10) {
        clearInterval(interval);
        name.style.textShadow = "";
      }
    }, 60);
  });
})();

// ---- TERMINAL TYPEWRITER ----
(function initTerminal() {
  const body = document.getElementById("terminal-body");
  if (!body) return;
  const lines = body.querySelectorAll(".t-line");
  lines.forEach((line, i) => {
    line.style.opacity = "0";
    setTimeout(
      () => {
        line.style.transition = "opacity 0.3s";
        line.style.opacity = "1";
      },
      600 + i * 90,
    );
  });
})();

// ---- SMOOTH ACTIVE NAV ----
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((a) => {
      a.style.color =
        a.getAttribute("href") === `#${current}` ? "var(--primary)" : "";
    });
  });
})();

// ---- PARALLAX GRID ----
(function initParallax() {
  const grid = document.querySelector(".hero-grid-overlay");
  if (!grid) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.3}px)`;
  });
})();

// ---- PHOTO PLACEHOLDER GLOW ----
(function initPhotoGlow() {
  const photo = document.querySelector(".photo-circle");
  if (!photo) return;
  let angle = 0;
  setInterval(() => {
    angle = (angle + 1) % 360;
    photo.style.boxShadow = `
      0 0 40px rgba(0,245,212,0.3),
      ${Math.cos((angle * Math.PI) / 180) * 6}px ${Math.sin((angle * Math.PI) / 180) * 6}px 20px rgba(0,245,212,0.15)
    `;
  }, 30);
})();
