/* ============================================================
   Ems's Vet Clinic — Lightweight Canvas Game Engine
   ============================================================ */

const Engine = (() => {
  const W = 390, H = 844;           // Design resolution (portrait phone)
  let canvas, ctx, scale = 1, offsetX = 0, offsetY = 0;
  let currentScene = null;
  let lastTime = 0;
  let touches = [];                  // Active touch/mouse positions
  let tapCallbacks = [];
  let dragTarget = null;
  let frameId = null;

  // ── Init ──
  function init() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    // Input: unified touch + mouse
    canvas.addEventListener('mousedown', e => onDown(e.offsetX, e.offsetY));
    canvas.addEventListener('mousemove', e => onMove(e.offsetX, e.offsetY));
    canvas.addEventListener('mouseup', e => onUp(e.offsetX, e.offsetY));
    canvas.addEventListener('touchstart', e => { e.preventDefault(); const t = e.touches[0]; const r = canvas.getBoundingClientRect(); onDown(t.clientX - r.left, t.clientY - r.top); }, { passive: false });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0]; const r = canvas.getBoundingClientRect(); onMove(t.clientX - r.left, t.clientY - r.top); }, { passive: false });
    canvas.addEventListener('touchend', e => { e.preventDefault(); onUp(0, 0); }, { passive: false });

    lastTime = performance.now();
    loop();
  }

  function resize() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const aspect = W / H;
    if (vw / vh < aspect) {
      scale = vw / W;
      canvas.width = vw;
      canvas.height = vw / aspect;
      offsetX = 0;
      offsetY = (vh - canvas.height) / 2;
    } else {
      scale = vh / H;
      canvas.height = vh;
      canvas.width = vh * aspect;
      offsetX = (vw - canvas.width) / 2;
      offsetY = 0;
    }
    canvas.style.marginTop = offsetY + 'px';
    canvas.style.marginLeft = offsetX + 'px';
  }

  // ── Convert screen coords to game coords ──
  function toGame(sx, sy) {
    return { x: sx / scale, y: sy / scale };
  }

  // ── Input Handlers ──
  let downPos = null;
  let downTime = 0;
  let lastMovePos = null;
  let dragMoved = false;

  function onDown(sx, sy) {
    const p = toGame(sx, sy);
    downPos = p;
    lastMovePos = p;
    downTime = performance.now();
    dragMoved = false;

    // Check drag targets
    if (currentScene && currentScene.onDragStart) {
      dragTarget = currentScene.onDragStart(p.x, p.y);
    }
    if (currentScene && currentScene.onDown) {
      currentScene.onDown(p.x, p.y);
    }
  }

  function onMove(sx, sy) {
    const p = toGame(sx, sy);
    lastMovePos = p;
    if (downPos) {
      const dx = p.x - downPos.x, dy = p.y - downPos.y;
      if (dx * dx + dy * dy > 100) dragMoved = true;
    }
    if (dragTarget && currentScene && currentScene.onDrag) {
      currentScene.onDrag(dragTarget, p.x, p.y);
    }
    if (currentScene && currentScene.onMove) {
      currentScene.onMove(p.x, p.y);
    }
  }

  function onUp(sx, sy) {
    const p = lastMovePos || downPos || toGame(sx, sy);
    if (dragTarget && currentScene && currentScene.onDrop) {
      currentScene.onDrop(dragTarget, p.x, p.y);
    }
    // Tap detection (< 300ms and minimal movement)
    if (downPos && !dragMoved && performance.now() - downTime < 400) {
      if (currentScene && currentScene.onTap) {
        currentScene.onTap(downPos.x, downPos.y);
      }
    }
    dragTarget = null;
    downPos = null;
    lastMovePos = null;
    dragMoved = false;
  }

  // ── Game Loop ──
  function loop() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);

    if (currentScene) {
      if (currentScene.update) currentScene.update(dt);
      if (currentScene.draw) currentScene.draw(ctx, W, H);
    }

    ctx.restore();
    frameId = requestAnimationFrame(loop);
  }

  // ── Scene Management ──
  function setScene(scene) {
    if (currentScene && currentScene.exit) currentScene.exit();
    currentScene = scene;
    if (currentScene && currentScene.enter) currentScene.enter();
  }

  // ── Tween System ──
  const tweens = [];
  function tween(obj, props, duration, easing = 'easeInOut', onDone = null) {
    const start = {};
    for (const k in props) start[k] = obj[k];
    tweens.push({ obj, start, end: props, duration, elapsed: 0, easing, onDone });
  }

  function updateTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      tw.elapsed += dt;
      let t = Math.min(tw.elapsed / tw.duration, 1);
      t = ease(t, tw.easing);
      for (const k in tw.end) {
        tw.obj[k] = tw.start[k] + (tw.end[k] - tw.start[k]) * t;
      }
      if (tw.elapsed >= tw.duration) {
        if (tw.onDone) tw.onDone();
        tweens.splice(i, 1);
      }
    }
  }

  function ease(t, type) {
    switch (type) {
      case 'linear': return t;
      case 'easeIn': return t * t;
      case 'easeOut': return t * (2 - t);
      case 'easeInOut': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'bounce': {
        if (t < 1/2.75) return 7.5625*t*t;
        if (t < 2/2.75) return 7.5625*(t-=1.5/2.75)*t+.75;
        if (t < 2.5/2.75) return 7.5625*(t-=2.25/2.75)*t+.9375;
        return 7.5625*(t-=2.625/2.75)*t+.984375;
      }
      default: return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  }

  // ── Drawing Helpers ──
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawButton(ctx, x, y, w, h, text, color, textColor = '#fff') {
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    roundRect(ctx, x + 2, y + 4, w, h, 14);
    ctx.fill();
    // Button
    ctx.fillStyle = color;
    roundRect(ctx, x, y, w, h, 14);
    ctx.fill();
    // Text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.restore();
  }

  function hitRect(px, py, x, y, w, h) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
  }

  function hitCircle(px, py, cx, cy, r) {
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
  }

  // ── Sound (simple Web Audio beeps) ──
  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(freq, duration = 0.15, type = 'sine', vol = 0.3) {
    try {
      const ac = getAudio();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + duration);
    } catch (e) {}
  }

  function sfxTap() { playTone(800, 0.08, 'sine', 0.2); }
  function sfxSuccess() { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.2), 200); }
  function sfxCoin() { playTone(1200, 0.1, 'square', 0.15); setTimeout(() => playTone(1600, 0.15, 'square', 0.15), 80); }
  function sfxHeal() { playTone(400, 0.3, 'sine', 0.2); setTimeout(() => playTone(600, 0.3, 'sine', 0.2), 200); }
  function sfxBad() { playTone(200, 0.3, 'sawtooth', 0.15); }

  return {
    W, H, init, ctx: () => ctx, canvas: () => canvas,
    setScene, tween, updateTweens,
    roundRect, drawButton, hitRect, hitCircle,
    sfxTap, sfxSuccess, sfxCoin, sfxHeal, sfxBad,
    toGame, ease,
  };
})();
