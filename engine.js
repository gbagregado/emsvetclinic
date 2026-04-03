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

  // ══════════════════════════════════════════════
  //   SOUND SYSTEM (Web Audio — no external files)
  // ══════════════════════════════════════════════

  let audioCtx = null;
  let masterGain = null;
  let sfxGain = null;
  let bgmGain = null;
  let bgmPlaying = null;     // current BGM track name
  let bgmNodes = [];          // active BGM oscillators/sources
  let bgmLoopTimer = null;
  let soundEnabled = true;    // user toggle
  let bgmVolume = 0.25;
  let sfxVolume = 0.5;

  function getAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(audioCtx.destination);
      sfxGain = audioCtx.createGain();
      sfxGain.gain.value = sfxVolume;
      sfxGain.connect(masterGain);
      bgmGain = audioCtx.createGain();
      bgmGain.gain.value = bgmVolume;
      bgmGain.connect(masterGain);
    }
    // Resume on iOS (requires user gesture)
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // ── Play a single tone ──
  function playTone(freq, duration = 0.15, type = 'sine', vol = 0.4, dest = null) {
    if (!soundEnabled) return;
    try {
      const ac = getAudio();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.connect(gain);
      gain.connect(dest || sfxGain);
      osc.start();
      osc.stop(ac.currentTime + duration + 0.05);
    } catch (e) {}
  }

  // ── Play a chord (multiple freqs at once) ──
  function playChord(freqs, duration, type = 'sine', vol = 0.15, dest = null) {
    freqs.forEach(f => playTone(f, duration, type, vol / freqs.length, dest));
  }

  // ── Noise generator (for surgical ambience, water, etc.) ──
  function playNoise(duration, vol = 0.05, filter = 800, dest = null) {
    if (!soundEnabled) return;
    try {
      const ac = getAudio();
      const bufferSize = ac.sampleRate * duration;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = ac.createBufferSource();
      source.buffer = buffer;
      const bpFilter = ac.createBiquadFilter();
      bpFilter.type = 'lowpass';
      bpFilter.frequency.value = filter;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(vol, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      source.connect(bpFilter);
      bpFilter.connect(gain);
      gain.connect(dest || sfxGain);
      source.start();
    } catch (e) {}
  }

  // ══════════════════════════
  //   SOUND EFFECTS
  // ══════════════════════════

  function sfxTap() {
    playTone(900, 0.06, 'sine', 0.25);
    playTone(1200, 0.04, 'sine', 0.1);
  }

  function sfxSuccess() {
    // Happy ascending arpeggio
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'sine', 0.3), i * 100);
    });
    setTimeout(() => playChord([523, 659, 784], 0.5, 'sine', 0.2), 400);
  }

  function sfxCoin() {
    playTone(1200, 0.08, 'square', 0.15);
    setTimeout(() => playTone(1600, 0.12, 'square', 0.12), 60);
    setTimeout(() => playTone(2000, 0.08, 'square', 0.08), 120);
  }

  function sfxHeal() {
    // Warm healing shimmer
    playChord([400, 500, 600], 0.4, 'sine', 0.2);
    setTimeout(() => playChord([500, 600, 750], 0.5, 'sine', 0.2), 250);
    setTimeout(() => playTone(800, 0.3, 'sine', 0.15), 500);
  }

  function sfxBad() {
    // Worried descending
    playTone(350, 0.2, 'sawtooth', 0.12);
    setTimeout(() => playTone(280, 0.25, 'sawtooth', 0.1), 150);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.08), 300);
  }

  function sfxDrop() {
    // Satisfying drop/place sound
    playTone(600, 0.08, 'sine', 0.3);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.2), 50);
    playNoise(0.1, 0.08, 2000);
  }

  function sfxPickup() {
    // Lift/grab sound
    playTone(500, 0.06, 'sine', 0.2);
    playTone(700, 0.06, 'sine', 0.12);
  }

  function sfxAnimalHappy() {
    // Cheerful bark/meow-like
    playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(750, 0.12, 'sine', 0.25), 80);
    setTimeout(() => playTone(600, 0.08, 'sine', 0.15), 180);
  }

  function sfxAnimalWhimper() {
    // Sad descending whine
    const ac = getAudio();
    if (!ac || !soundEnabled) return;
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ac.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start();
      osc.stop(ac.currentTime + 0.45);
    } catch (e) {}
  }

  function sfxSurgery() {
    // Metallic clink
    playTone(3000, 0.04, 'square', 0.08);
    playTone(4500, 0.03, 'square', 0.05);
    playNoise(0.08, 0.06, 5000);
  }

  function sfxHeartbeat() {
    // Thump-thump
    playTone(60, 0.12, 'sine', 0.3);
    setTimeout(() => playTone(50, 0.15, 'sine', 0.25), 150);
  }

  function sfxPageTurn() {
    playNoise(0.15, 0.06, 3000);
  }

  function sfxDayEnd() {
    // Gentle wind-down
    const notes = [784, 659, 523, 392];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.35, 'sine', 0.15), i * 200);
    });
  }

  // ══════════════════════════════════════════
  //   BACKGROUND MUSIC (procedural loops)
  // ══════════════════════════════════════════

  function stopBGM() {
    if (bgmLoopTimer) { clearInterval(bgmLoopTimer); bgmLoopTimer = null; }
    bgmNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    bgmNodes = [];
    bgmPlaying = null;
  }

  function _bgmNote(freq, startTime, duration, type = 'sine', vol = 0.08) {
    if (!soundEnabled) return;
    try {
      const ac = getAudio();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.setValueAtTime(vol, startTime + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      osc.connect(gain);
      gain.connect(bgmGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
      bgmNodes.push(osc);
    } catch (e) {}
  }

  // Title: upbeat cheerful loop
  function bgmTitle() {
    if (bgmPlaying === 'title') return;
    stopBGM();
    bgmPlaying = 'title';
    const melody = [523, 587, 659, 784, 659, 587, 523, 494, 523, 587, 659, 784, 880, 784, 659, 523];
    const bass = [262, 262, 330, 330, 349, 349, 262, 262, 262, 262, 330, 330, 349, 349, 262, 262];
    const noteLen = 0.28;
    function playLoop() {
      if (bgmPlaying !== 'title' || !soundEnabled) return;
      const ac = getAudio();
      const now = ac.currentTime + 0.05;
      melody.forEach((f, i) => {
        _bgmNote(f, now + i * noteLen, noteLen * 0.9, 'sine', 0.06);
        _bgmNote(bass[i], now + i * noteLen, noteLen * 0.9, 'triangle', 0.04);
      });
      // Soft pad chord
      [262, 330, 392].forEach(f => _bgmNote(f, now, melody.length * noteLen, 'sine', 0.02));
    }
    playLoop();
    bgmLoopTimer = setInterval(playLoop, melody.length * noteLen * 1000);
  }

  // Clinic: calm, warm ambient
  function bgmClinic() {
    if (bgmPlaying === 'clinic') return;
    stopBGM();
    bgmPlaying = 'clinic';
    // Gentle arpeggiated pattern
    const pattern = [262, 330, 392, 523, 392, 330, 262, 220, 262, 294, 349, 440, 349, 294, 262, 220];
    const noteLen = 0.45;
    function playLoop() {
      if (bgmPlaying !== 'clinic' || !soundEnabled) return;
      const ac = getAudio();
      const now = ac.currentTime + 0.05;
      pattern.forEach((f, i) => {
        _bgmNote(f, now + i * noteLen, noteLen * 1.2, 'sine', 0.04);
      });
      // Warm pad underneath
      [196, 262, 330].forEach(f => _bgmNote(f, now, pattern.length * noteLen, 'sine', 0.015));
    }
    playLoop();
    bgmLoopTimer = setInterval(playLoop, pattern.length * noteLen * 1000);
  }

  // Checkup: curious, lighthearted
  function bgmCheckup() {
    if (bgmPlaying === 'checkup') return;
    stopBGM();
    bgmPlaying = 'checkup';
    const melody = [392, 440, 494, 523, 494, 440, 392, 349, 330, 349, 392, 440, 523, 494, 440, 392];
    const noteLen = 0.35;
    function playLoop() {
      if (bgmPlaying !== 'checkup' || !soundEnabled) return;
      const ac = getAudio();
      const now = ac.currentTime + 0.05;
      melody.forEach((f, i) => {
        _bgmNote(f, now + i * noteLen, noteLen * 0.8, 'sine', 0.04);
      });
      // Light bass
      [196, 220, 196, 175].forEach((f, i) => {
        _bgmNote(f, now + i * noteLen * 4, noteLen * 3.8, 'triangle', 0.03);
      });
    }
    playLoop();
    bgmLoopTimer = setInterval(playLoop, melody.length * noteLen * 1000);
  }

  // Surgery: tense, focused
  function bgmSurgery() {
    if (bgmPlaying === 'surgery') return;
    stopBGM();
    bgmPlaying = 'surgery';
    const noteLen = 0.6;
    const pattern = [220, 233, 220, 208, 196, 208, 220, 233, 247, 233, 220, 208, 196, 185, 196, 208];
    function playLoop() {
      if (bgmPlaying !== 'surgery' || !soundEnabled) return;
      const ac = getAudio();
      const now = ac.currentTime + 0.05;
      pattern.forEach((f, i) => {
        _bgmNote(f, now + i * noteLen, noteLen * 1.1, 'sine', 0.035);
      });
      // Deep drone
      _bgmNote(110, now, pattern.length * noteLen, 'triangle', 0.03);
      _bgmNote(165, now, pattern.length * noteLen, 'sine', 0.015);
      // Soft heartbeat rhythm
      for (let i = 0; i < pattern.length; i += 2) {
        _bgmNote(55, now + i * noteLen, 0.12, 'sine', 0.04);
        _bgmNote(50, now + i * noteLen + 0.15, 0.15, 'sine', 0.03);
      }
    }
    playLoop();
    bgmLoopTimer = setInterval(playLoop, pattern.length * noteLen * 1000);
  }

  // Result: celebratory
  function bgmResult() {
    if (bgmPlaying === 'result') return;
    stopBGM();
    bgmPlaying = 'result';
    const melody = [523, 659, 784, 880, 784, 659, 523, 659, 784, 1047, 880, 784, 659, 523, 587, 523];
    const noteLen = 0.25;
    function playLoop() {
      if (bgmPlaying !== 'result' || !soundEnabled) return;
      const ac = getAudio();
      const now = ac.currentTime + 0.05;
      melody.forEach((f, i) => {
        _bgmNote(f, now + i * noteLen, noteLen * 0.85, 'sine', 0.05);
      });
      [262, 330, 392].forEach(f => _bgmNote(f, now, melody.length * noteLen, 'triangle', 0.02));
    }
    playLoop();
    bgmLoopTimer = setInterval(playLoop, melody.length * noteLen * 1000);
  }

  // Night: dreamy, peaceful
  function bgmNight() {
    if (bgmPlaying === 'night') return;
    stopBGM();
    bgmPlaying = 'night';
    const melody = [392, 330, 294, 262, 220, 262, 294, 330, 262, 220, 196, 220, 262, 294, 330, 262];
    const noteLen = 0.6;
    function playLoop() {
      if (bgmPlaying !== 'night' || !soundEnabled) return;
      const ac = getAudio();
      const now = ac.currentTime + 0.05;
      melody.forEach((f, i) => {
        _bgmNote(f, now + i * noteLen, noteLen * 1.3, 'sine', 0.035);
      });
      // Dreamy pad
      [131, 196, 262].forEach(f => _bgmNote(f, now, melody.length * noteLen, 'sine', 0.015));
    }
    playLoop();
    bgmLoopTimer = setInterval(playLoop, melody.length * noteLen * 1000);
  }

  // Toggle sound
  function toggleSound() {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) stopBGM();
    return soundEnabled;
  }

  function isSoundEnabled() { return soundEnabled; }

  return {
    W, H, init, ctx: () => ctx, canvas: () => canvas,
    setScene, tween, updateTweens,
    roundRect, drawButton, hitRect, hitCircle,
    sfxTap, sfxSuccess, sfxCoin, sfxHeal, sfxBad,
    sfxDrop, sfxPickup, sfxAnimalHappy, sfxAnimalWhimper,
    sfxSurgery, sfxHeartbeat, sfxPageTurn, sfxDayEnd,
    bgmTitle, bgmClinic, bgmCheckup, bgmSurgery, bgmResult, bgmNight,
    stopBGM, toggleSound, isSoundEnabled,
    toGame, ease,
  };
})();
