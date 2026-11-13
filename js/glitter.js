(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const colors = ["#bd829b", "#b3b4c3", "#e2b5c8", "#ffffff"];
  const particles = [];
  const maxParticles = 70;
  let canvas;
  let context;
  let frame = 0;
  let previousTime = 0;
  let lastTrailTime = 0;
  let lastX = -100;
  let lastY = -100;

  function resize() {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createCanvas() {
    if (canvas) return true;
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    if (!context) {
      canvas = null;
      return false;
    }
    canvas.className = "glitter-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    resize();
    return true;
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    particles.length = 0;
    if (context) context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function draw(time) {
    const delta = Math.min(time - (previousTime || time), 32);
    previousTime = time;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = particles.length - 1; index >= 0; index--) {
      const particle = particles[index];
      particle.age += delta;
      if (particle.age >= particle.life) {
        particles.splice(index, 1);
        continue;
      }
      const progress = particle.age / particle.life;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 0.000025 * delta;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation + progress * 0.5);
      context.globalAlpha = Math.sin(Math.PI * progress) * 0.82;
      context.fillStyle = particle.color;
      const size = particle.size * (1 - progress * 0.45);
      // Alternate outer and inner vertices to draw a five-point star.
      context.beginPath();
      for (let point = 0; point < 10; point++) {
        const angle = (point * Math.PI) / 5 - Math.PI / 2;
        const radius = point % 2 === 0 ? size : size * 0.45;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.fill();
      context.restore();
    }
    if (particles.length) frame = requestAnimationFrame(draw);
    else {
      frame = 0;
      previousTime = 0;
    }
  }

  function emit(x, y, burst) {
    if (reducedMotion.matches || document.hidden || !createCanvas()) return;
    const count = burst ? 10 : 2;
    for (let index = 0; index < count; index++) {
      const angle = burst
        ? (index / count) * Math.PI * 2 + Math.random() * 0.3
        : Math.random() * Math.PI * 2;
      const speed = burst
        ? 0.045 + Math.random() * 0.065
        : 0.008 + Math.random() * 0.018;
      if (particles.length >= maxParticles) particles.shift();
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: x + (burst ? 0 : (Math.random() - 0.5) * 12),
        y: y + (burst ? 0 : (Math.random() - 0.5) * 12),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: burst ? 2.5 + Math.random() * 2 : 1.7 + Math.random() * 2,
        rotation: Math.random() * Math.PI,
        color,
        life: burst ? 450 + Math.random() * 180 : 260 + Math.random() * 180,
        age: 0,
      });
    }
    if (!frame) frame = requestAnimationFrame(draw);
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      if (
        !finePointer.matches ||
        event.pointerType !== "mouse" ||
        reducedMotion.matches
      )
        return;
      const now = performance.now();
      if (
        now - lastTrailTime < 38 ||
        Math.hypot(event.clientX - lastX, event.clientY - lastY) < 7
      )
        return;
      lastTrailTime = now;
      lastX = event.clientX;
      lastY = event.clientY;
      emit(lastX, lastY, false);
    },
    { passive: true },
  );

  document.addEventListener("click", (event) => {
    const control = event.target.closest("a, button");
    if (
      !control ||
      control.matches(':disabled, [aria-disabled="true"]') ||
      reducedMotion.matches
    )
      return;
    const rect = control.getBoundingClientRect();
    const keyboard = event.detail === 0;
    emit(
      keyboard ? rect.left + rect.width / 2 : event.clientX,
      keyboard ? rect.top + rect.height / 2 : event.clientY,
      true,
    );
    if (control.classList.contains("button")) {
      control.classList.add("is-pressed");
      window.setTimeout(() => control.classList.remove("is-pressed"), 140);
    }
  });

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", stop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) stop();
  });
  finePointer.addEventListener("change", () => {
    if (!finePointer.matches) stop();
  });
})();
