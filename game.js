/* ============================================================
   Ems's Vet Clinic — Game Scenes & Logic
   ============================================================ */

(() => {
  const W = Engine.W, H = Engine.H;

  // ════ Save / Load ════
  function save(state) {
    try { localStorage.setItem('ems_vet_save', JSON.stringify(state)); } catch (e) {}
  }
  function load() {
    try { const s = localStorage.getItem('ems_vet_save'); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }

  // ════ Game State ════
  let state = {
    coins: 0,
    day: 1,
    treated: 0,
    reputation: 0,
    totalTreated: 0,
  };

  // ════ Animal & Condition Generators ════
  const DOG_COLORS = ['golden', 'brown', 'white', 'gray', 'black'];
  const CAT_COLORS = ['orange', 'tuxedo', 'siamese', 'gray', 'white'];
  const PET_NAMES_DOG = ['Buddy', 'Max', 'Charlie', 'Cooper', 'Rocky', 'Bear', 'Duke', 'Tucker', 'Biscuit', 'Milo'];
  const PET_NAMES_CAT = ['Luna', 'Bella', 'Whiskers', 'Mochi', 'Simba', 'Nala', 'Oliver', 'Cleo', 'Shadow', 'Ginger'];

  const CONDITIONS = [
    {
      id: 'fever',
      name: 'Fever',
      desc: 'High temperature detected!',
      icon: '🌡️',
      treatment: 'medicine',
      tools: ['stethoscope', 'thermometer', 'medicine'],
      surgerySteps: null,
      reward: 30,
    },
    {
      id: 'wound',
      name: 'Open Wound',
      desc: 'A cut that needs cleaning and stitches.',
      icon: '🩹',
      treatment: 'surgery',
      tools: ['flashlight', 'scalpel', 'suture', 'bandage'],
      surgerySteps: ['Clean wound', 'Apply antiseptic', 'Stitch wound', 'Apply bandage'],
      reward: 60,
    },
    {
      id: 'swallowed_object',
      name: 'Swallowed Object',
      desc: 'Swallowed a small toy! Needs surgery.',
      icon: '⚠️',
      treatment: 'surgery',
      tools: ['syringe', 'scalpel', 'tweezers', 'suture', 'bandage'],
      surgerySteps: ['Administer anesthesia', 'Make incision', 'Remove object', 'Stitch up', 'Apply bandage'],
      reward: 100,
    },
    {
      id: 'broken_bone',
      name: 'Broken Leg',
      desc: 'A fracture that needs setting and a cast.',
      icon: '🦴',
      treatment: 'surgery',
      tools: ['syringe', 'flashlight', 'bandage'],
      surgerySteps: ['Administer pain relief', 'X-ray & align bone', 'Apply cast'],
      reward: 80,
    },
    {
      id: 'dental',
      name: 'Bad Tooth',
      desc: 'A painful cavity that needs extraction.',
      icon: '🦷',
      treatment: 'surgery',
      tools: ['syringe', 'flashlight', 'tweezers', 'bandage'],
      surgerySteps: ['Administer anesthesia', 'Examine mouth', 'Extract tooth', 'Apply gauze'],
      reward: 70,
    },
    {
      id: 'ear_infection',
      name: 'Ear Infection',
      desc: 'Red, inflamed ear. Needs drops.',
      icon: '👂',
      treatment: 'medicine',
      tools: ['flashlight', 'thermometer', 'medicine'],
      surgerySteps: null,
      reward: 35,
    },
  ];

  function randomAnimal() {
    const isDog = Math.random() > 0.45;
    const colors = isDog ? DOG_COLORS : CAT_COLORS;
    const names = isDog ? PET_NAMES_DOG : PET_NAMES_CAT;
    const cond = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    return {
      type: isDog ? 'dog' : 'cat',
      name: names[Math.floor(Math.random() * names.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      condition: cond,
      x: -80,
      y: 0,
      mood: 'sick',
      tailWag: 0,
      legPhase: 0,
      scale: 1,
    };
  }

  // ════════════════════════════════════════════
  //   TITLE SCENE
  // ════════════════════════════════════════════
  const TitleScene = {
    time: 0,
    particles: [],

    enter() {
      this.time = 0;
      this.particles = [];
      for (let i = 0; i < 15; i++) {
        this.particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 20,
          vy: -Math.random() * 40 - 10,
          size: Math.random() * 6 + 3,
          emoji: ['🐾', '💊', '🩺', '❤️', '🐕', '🐈'][Math.floor(Math.random() * 6)],
          alpha: Math.random() * 0.4 + 0.2,
        });
      }
      // Check for save
      const saved = load();
      this.hasSave = !!saved;
      Engine.bgmTitle();
    },

    update(dt) {
      this.time += dt;
      this.particles.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
      });
      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Gradient BG
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#2a8a7a');
      grad.addColorStop(0.5, '#4ecdc4');
      grad.addColorStop(1, '#a8e6cf');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Floating particles
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size * 3}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, p.x, p.y);
      });
      ctx.globalAlpha = 1;

      // Title card
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      Engine.roundRect(ctx, 30, 180, W - 60, 220, 24);
      ctx.fill();
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 20;
      Engine.roundRect(ctx, 30, 180, W - 60, 220, 24);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Logo
      ctx.font = '60px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏥', W / 2, 240);

      // Title text
      ctx.fillStyle = '#2a6a60';
      ctx.font = 'bold 28px -apple-system, sans-serif';
      ctx.fillText("Ems's Vet Clinic", W / 2, 290);

      ctx.fillStyle = '#5a9a90';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.fillText('Help animals feel better!', W / 2, 320);

      // Draw Ems
      const emsFloat = Math.sin(this.time * 2) * 5;
      GFX.drawEms(ctx, W / 2, 370 + emsFloat, 1.2, 'happy');

      // Dog & cat flanking
      GFX.drawDog(ctx, 100, 540, 0.7, 'golden', 'happy', this.time * 5, 0);
      GFX.drawCat(ctx, 310, 540, 0.7, 'orange', 'happy', this.time * 4, 0);

      // Buttons
      Engine.drawButton(ctx, W / 2 - 100, 620, 200, 55, '🎮  New Game', '#4ecdc4', '#fff');
      if (this.hasSave) {
        Engine.drawButton(ctx, W / 2 - 100, 690, 200, 55, '▶️  Continue', '#ff6b6b', '#fff');
      }

      // Sound toggle
      const soundOn = Engine.isSoundEnabled();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      Engine.roundRect(ctx, W - 55, 15, 42, 42, 12);
      ctx.fill();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(soundOn ? '🔊' : '🔇', W - 34, 43);
    },

    onTap(x, y) {
      // Sound toggle
      if (Engine.hitRect(x, y, W - 55, 15, 42, 42)) {
        const on = Engine.toggleSound();
        if (on) Engine.bgmTitle();
        return;
      }
      if (Engine.hitRect(x, y, W / 2 - 100, 620, 200, 55)) {
        Engine.sfxTap();
        state = { coins: 0, day: 1, treated: 0, reputation: 0, totalTreated: 0 };
        Engine.setScene(IntroScene);
      }
      if (this.hasSave && Engine.hitRect(x, y, W / 2 - 100, 690, 200, 55)) {
        Engine.sfxTap();
        const saved = load();
        if (saved) state = saved;
        Engine.setScene(ClinicScene);
      }
    },
  };

  // ════════════════════════════════════════════
  //   INTRO SCENE
  // ════════════════════════════════════════════
  const IntroScene = {
    step: 0,
    lines: [
      "Hi! I'm Dr. Ems! 🩺 I just opened my very own veterinary clinic!",
      "Dogs and cats come to us when they're not feeling well...",
      "We'll examine them, find out what's wrong, and treat them! 💊",
      "Sometimes they'll need medicine, and sometimes even surgery! 🔬",
      "Let's help our first patient! Tap to continue! ❤️",
    ],
    charIndex: 0,
    displayText: '',
    timer: 0,

    enter() {
      this.step = 0;
      this.charIndex = 0;
      this.displayText = '';
      this.timer = 0;
      Engine.bgmClinic();
    },

    update(dt) {
      this.timer += dt;
      // Typewriter effect
      if (this.charIndex < this.lines[this.step].length) {
        this.charIndex += dt * 40;
        this.displayText = this.lines[this.step].substring(0, Math.floor(this.charIndex));
      }
    },

    draw(ctx) {
      // BG
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#f0f8f6');
      grad.addColorStop(1, '#d0e8e4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Draw Ems large
      GFX.drawEms(ctx, W / 2, 280, 2.2, 'happy');

      // Dialog box
      ctx.fillStyle = '#fff';
      Engine.roundRect(ctx, 20, 450, W - 40, 140, 20);
      ctx.fill();
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 15;
      Engine.roundRect(ctx, 20, 450, W - 40, 140, 20);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Name
      ctx.fillStyle = '#4ecdc4';
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Dr. Ems', 40, 478);

      // Text with wrapping
      ctx.fillStyle = '#3a4a48';
      ctx.font = '15px -apple-system, sans-serif';
      this.wrapText(ctx, this.displayText, 40, 505, W - 80, 22);

      // Next button
      const btnText = this.step < this.lines.length - 1 ? 'Next →' : "Let's Go! ✨";
      Engine.drawButton(ctx, W / 2 - 80, 620, 160, 50, btnText, '#4ecdc4');

      // Step dots
      for (let i = 0; i < this.lines.length; i++) {
        ctx.fillStyle = i === this.step ? '#4ecdc4' : '#ccc';
        ctx.beginPath();
        ctx.arc(W / 2 - 24 + i * 12, 690, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },

    wrapText(ctx, text, x, y, maxW, lineH) {
      const words = text.split(' ');
      let line = '';
      let ly = y;
      for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line.trim(), x, ly);
          line = word + ' ';
          ly += lineH;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), x, ly);
    },

    onTap(x, y) {
      // If still typing, complete
      if (this.charIndex < this.lines[this.step].length) {
        this.charIndex = this.lines[this.step].length;
        this.displayText = this.lines[this.step];
        return;
      }
      if (Engine.hitRect(x, y, W / 2 - 80, 620, 160, 50)) {
        Engine.sfxTap();
        Engine.sfxPageTurn();
        this.step++;
        if (this.step >= this.lines.length) {
          Engine.setScene(ClinicScene);
        } else {
          this.charIndex = 0;
          this.displayText = '';
        }
      }
    },
  };

  // ════════════════════════════════════════════
  //   CLINIC SCENE (Waiting Room)
  // ════════════════════════════════════════════
  const ClinicScene = {
    animals: [],
    maxForDay: 3,
    time: 0,
    spawnTimer: 0,
    spawned: 0,
    emsBubble: '',
    emsBubbleTimer: 0,

    enter() {
      this.time = 0;
      this.spawnTimer = 0;
      this.spawned = 0;
      this.animals = [];
      this.maxForDay = Math.min(3 + Math.floor(state.day / 2), 8);
      state.treated = 0;
      this.emsBubble = EMS_BUBBLES[Math.floor(Math.random() * EMS_BUBBLES.length)];
      this.emsBubbleTimer = 3;
      save(state);
      Engine.bgmClinic();
    },

    update(dt) {
      this.time += dt;
      this.emsBubbleTimer -= dt;

      // Spawn animals walking in
      if (this.spawned < this.maxForDay) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
          const a = randomAnimal();
          a.y = 480 + this.animals.length * 70;
          a.targetX = 80 + this.animals.length * 50;
          this.animals.push(a);
          this.spawned++;
          this.spawnTimer = 2 + Math.random() * 2;
        }
      }

      // Animate animals walking in
      this.animals.forEach(a => {
        if (a.x < a.targetX) {
          a.x += 80 * dt;
          a.legPhase += dt * 8;
          if (a.x >= a.targetX) a.x = a.targetX;
        }
        a.tailWag += dt * 3;
      });

      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Draw clinic background
      GFX.drawClinicBG(ctx, W, H);

      // Top HUD
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      Engine.roundRect(ctx, 10, 8, W - 20, 44, 12);
      ctx.fill();

      // Sound toggle in HUD
      const soundOn = Engine.isSoundEnabled();
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(soundOn ? '🔊' : '🔇', W - 14, 36);

      ctx.fillStyle = '#3a4a48';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`💰 ${state.coins}`, 24, 36);
      ctx.textAlign = 'center';
      ctx.fillText(`📅 Day ${state.day}`, W / 2, 36);
      ctx.textAlign = 'right';
      ctx.fillText(`⭐ ${state.reputation}`, W - 24, 36);

      // Ems behind counter
      GFX.drawEms(ctx, W - 60, 350, 1.0, 'happy');

      // Speech bubble
      if (this.emsBubbleTimer > 0) {
        ctx.fillStyle = '#fff';
        Engine.roundRect(ctx, W - 170, 270, 130, 40, 10);
        ctx.fill();
        ctx.fillStyle = '#3a4a48';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.emsBubble, W - 105, 294);
      }

      // Waiting area label
      ctx.fillStyle = 'rgba(78,205,196,0.15)';
      Engine.roundRect(ctx, 15, 420, W - 30, H - 490, 16);
      ctx.fill();
      ctx.fillStyle = '#5a9a90';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🐾 Waiting Room', 28, 445);

      // Draw animals
      this.animals.forEach((a, i) => {
        if (a.type === 'dog') {
          GFX.drawDog(ctx, a.x, a.y, 0.75, a.color, a.mood, a.tailWag, a.legPhase);
        } else {
          GFX.drawCat(ctx, a.x, a.y, 0.75, a.color, a.mood, a.tailWag, a.legPhase);
        }
        // Name & condition label
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        Engine.roundRect(ctx, a.x + 30, a.y - 25, 100, 36, 8);
        ctx.fill();
        ctx.fillStyle = '#3a4a48';
        ctx.font = 'bold 12px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(a.name, a.x + 38, a.y - 8);
        ctx.fillStyle = '#888';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.fillText(`${a.condition.icon} ${a.condition.name}`, a.x + 38, a.y + 5);
      });

      // Day info
      ctx.fillStyle = '#5a9a90';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Patients today: ${state.treated}/${this.maxForDay}`, W / 2, H - 60);

      // Tap instruction
      if (this.animals.length > 0 && this.animals[0].x >= this.animals[0].targetX) {
        ctx.fillStyle = 'rgba(78,205,196,0.8)';
        ctx.font = 'bold 14px -apple-system, sans-serif';
        ctx.fillText('👆 Tap a patient to examine', W / 2, H - 35);
      }

      // Day complete?
      if (state.treated >= this.maxForDay && this.animals.length === 0) {
        Engine.drawButton(ctx, W / 2 - 90, H - 100, 180, 50, '🌙 End Day', '#ff6b6b');
      }
    },

    onTap(x, y) {
      // Sound toggle in HUD
      if (Engine.hitRect(x, y, W - 40, 8, 40, 44)) {
        const on = Engine.toggleSound();
        if (on) Engine.bgmClinic();
        return;
      }
      // End day button
      if (state.treated >= this.maxForDay && this.animals.length === 0) {
        if (Engine.hitRect(x, y, W / 2 - 90, H - 100, 180, 50)) {
          Engine.sfxTap();
          Engine.setScene(DaySummaryScene);
          return;
        }
      }

      // Tap an animal to start checkup
      for (let i = 0; i < this.animals.length; i++) {
        const a = this.animals[i];
        if (a.x < a.targetX) continue; // Still walking in
        if (Engine.hitRect(x, y, a.x - 60, a.y - 40, 160, 90)) {
          Engine.sfxTap();
          CheckupScene.patient = a;
          this.animals.splice(i, 1);
          Engine.setScene(CheckupScene);
          return;
        }
      }
    },
  };

  const EMS_BUBBLES = [
    "Who's next? 😊",
    "Ready to help!",
    "Every pet matters! ❤️",
    "Let me grab my tools!",
    "Don't worry little one!",
    "We'll fix you up! 💪",
  ];

  // ════════════════════════════════════════════
  //   CHECKUP SCENE
  // ════════════════════════════════════════════
  const CheckupScene = {
    patient: null,
    tools: [],
    usedTools: [],
    currentToolIdx: 0,
    phase: 'examine', // 'examine' | 'diagnosis' | 'treatment_choice'
    examProgress: 0,
    time: 0,
    diagnosisRevealed: false,
    toolHighlight: 0,
    toolUseAnim: null,

    enter() {
      this.phase = 'examine';
      this.usedTools = [];
      this.currentToolIdx = 0;
      this.examProgress = 0;
      this.time = 0;
      this.diagnosisRevealed = false;
      this.toolUseAnim = null;

      // Setup checkup tools (first 2-3 are for diagnosis)
      const checkupTools = ['stethoscope', 'thermometer', 'flashlight'];
      this.tools = checkupTools.map((t, i) => ({
        name: t,
        x: 50 + i * 130,
        y: H - 80,
        originX: 50 + i * 130,
        originY: H - 80,
        used: false,
        dragging: false,
      }));
      this.draggingTool = null;
      this.dropZoneHover = false;
      Engine.bgmCheckup();
    },

    update(dt) {
      this.time += dt;
      this.toolHighlight = Math.sin(this.time * 4) * 0.5 + 0.5;

      if (this.toolUseAnim) {
        this.toolUseAnim.timer -= dt;
        if (this.toolUseAnim.timer <= 0) {
          this.toolUseAnim = null;
        }
      }

      if (this.patient) {
        this.patient.tailWag += dt * 2;
      }
      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Room BG
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#e8f4f0');
      grad.addColorStop(1, '#d0e4dc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Floor
      ctx.fillStyle = '#d8d0c8';
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      // Exam table
      GFX.drawExamTable(ctx, 85, H * 0.35);

      // Patient on table
      if (this.patient) {
        const px = 195, py = H * 0.35 - 20;
        if (this.patient.type === 'dog') {
          GFX.drawDog(ctx, px, py, 0.9, this.patient.color, this.patient.mood, this.patient.tailWag, 0);
        } else {
          GFX.drawCat(ctx, px, py, 0.9, this.patient.color, this.patient.mood, this.patient.tailWag, 0);
        }

        // Patient name
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        Engine.roundRect(ctx, 140, H * 0.2, 120, 30, 8);
        ctx.fill();
        ctx.fillStyle = '#3a4a48';
        ctx.font = 'bold 14px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.patient.condition.icon} ${this.patient.name}`, 200, H * 0.2 + 20);
      }

      // Ems standing to the right
      GFX.drawEms(ctx, 330, H * 0.35 + 30, 0.85, this.diagnosisRevealed ? 'concerned' : 'happy');

      // Tool use animation
      if (this.toolUseAnim) {
        const anim = this.toolUseAnim;
        ctx.globalAlpha = Math.min(1, anim.timer * 3);
        GFX.drawToolIcon(ctx, anim.x, anim.y, anim.tool, 2);
        // Sparkle
        ctx.fillStyle = '#4ecdc4';
        for (let i = 0; i < 3; i++) {
          const angle = this.time * 5 + i * 2;
          const sx = anim.x + Math.cos(angle) * 30;
          const sy = anim.y + Math.sin(angle) * 30;
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      if (this.phase === 'examine') {
        // Progress bar
        ctx.fillStyle = '#ddd';
        Engine.roundRect(ctx, 50, H * 0.53, W - 100, 16, 8);
        ctx.fill();
        ctx.fillStyle = '#4ecdc4';
        Engine.roundRect(ctx, 50, H * 0.53, (W - 100) * (this.examProgress / 3), 16, 8);
        ctx.fill();
        ctx.fillStyle = '#3a6a60';
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Examining... ${this.examProgress}/3`, W / 2, H * 0.53 + 12);

        // Drop zone highlight (patient area)
        if (this.draggingTool) {
          const dzAlpha = this.dropZoneHover ? 0.35 : 0.12;
          ctx.fillStyle = `rgba(78,205,196,${dzAlpha})`;
          ctx.strokeStyle = `rgba(78,205,196,${dzAlpha + 0.3})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          Engine.roundRect(ctx, 85, H * 0.2 - 10, 220, 140, 16);
          ctx.fill();
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(78,205,196,0.9)';
          ctx.font = 'bold 12px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Drop here!', 195, H * 0.2 + 120);
        }

        // Tool tray
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        Engine.roundRect(ctx, 15, H - 140, W - 30, 120, 16);
        ctx.fill();
        ctx.fillStyle = '#5a9a90';
        ctx.font = 'bold 13px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔀 Drag tool to patient (or tap)', W / 2, H - 122);

        this.tools.forEach((t, i) => {
          if (t.dragging) return; // drawn separately on top
          if (t.used) {
            ctx.globalAlpha = 0.3;
          } else if (i === this.currentToolIdx) {
            ctx.fillStyle = `rgba(78,205,196,${this.toolHighlight * 0.3})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 35, 0, Math.PI * 2);
            ctx.fill();
          }
          GFX.drawToolIcon(ctx, t.x, t.y, t.name, 1.6);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#5a7a78';
          ctx.font = '10px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(t.name, t.x, t.y + 35);
        });

        // Draw dragging tool on top
        if (this.draggingTool && this.draggingTool.dragging) {
          ctx.globalAlpha = 0.85;
          GFX.drawToolIcon(ctx, this.draggingTool.x, this.draggingTool.y, this.draggingTool.name, 2.2);
          ctx.globalAlpha = 1;
        }

      } else if (this.phase === 'diagnosis') {
        // Diagnosis panel
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        Engine.roundRect(ctx, 20, H * 0.52, W - 40, 200, 20);
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 12;
        Engine.roundRect(ctx, 20, H * 0.52, W - 40, 200, 20);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#e05050';
        ctx.font = 'bold 18px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📋 Diagnosis', W / 2, H * 0.52 + 35);

        ctx.fillStyle = '#3a4a48';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText(`${this.patient.condition.icon} ${this.patient.condition.name}`, W / 2, H * 0.52 + 65);

        ctx.fillStyle = '#6a7a78';
        ctx.font = '14px -apple-system, sans-serif';
        ctx.fillText(this.patient.condition.desc, W / 2, H * 0.52 + 90);

        // Treatment button
        if (this.patient.condition.treatment === 'surgery') {
          Engine.drawButton(ctx, W / 2 - 90, H * 0.52 + 120, 180, 48, '🔬 Start Surgery', '#ff6b6b');
        } else {
          Engine.drawButton(ctx, W / 2 - 90, H * 0.52 + 120, 180, 48, '💊 Give Medicine', '#4ecdc4');
        }
      }

      // Back button
      Engine.drawButton(ctx, 15, 10, 70, 36, '← Back', '#ccc', '#666');
    },

    _useTool(t) {
      t.used = true;
      t.dragging = false;
      this.draggingTool = null;
      this.dropZoneHover = false;
      this.examProgress++;
      this.currentToolIdx = Math.min(this.currentToolIdx + 1, this.tools.length - 1);
      Engine.sfxDrop();
      this.toolUseAnim = { tool: t.name, x: 180, y: H * 0.35 - 20, timer: 1 };
      if (this.examProgress >= 3) {
        setTimeout(() => {
          this.phase = 'diagnosis';
          this.diagnosisRevealed = true;
          Engine.sfxBad();
          Engine.sfxAnimalWhimper();
        }, 800);
      }
    },

    // ── Drag & Drop ──
    onDragStart(x, y) {
      if (this.phase !== 'examine') return null;
      for (const t of this.tools) {
        if (!t.used && Engine.hitCircle(x, y, t.x, t.y, 35)) {
          t.dragging = true;
          this.draggingTool = t;
          Engine.sfxPickup();
          return t;
        }
      }
      return null;
    },

    onDrag(target, x, y) {
      target.x = x;
      target.y = y;
      this.dropZoneHover = Engine.hitRect(x, y, 85, H * 0.2 - 10, 220, 140);
    },

    onDrop(target, x, y) {
      if (this.dropZoneHover && !target.used) {
        this._useTool(target);
      } else {
        // Snap back
        target.x = target.originX;
        target.y = target.originY;
        target.dragging = false;
        this.draggingTool = null;
        this.dropZoneHover = false;
      }
    },

    onTap(x, y) {
      // Back
      if (Engine.hitRect(x, y, 15, 10, 70, 36)) {
        Engine.sfxTap();
        ClinicScene.animals.unshift(this.patient);
        Engine.setScene(ClinicScene);
        return;
      }

      if (this.phase === 'examine') {
        // Tap tools (fallback)
        this.tools.forEach((t, i) => {
          if (!t.used && !t.dragging && Engine.hitCircle(x, y, t.x, t.y, 35)) {
            this._useTool(t);
          }
        });
      } else if (this.phase === 'diagnosis') {
        if (Engine.hitRect(x, y, W / 2 - 90, H * 0.52 + 120, 180, 48)) {
          Engine.sfxTap();
          if (this.patient.condition.treatment === 'surgery') {
            SurgeryScene.patient = this.patient;
            Engine.setScene(SurgeryScene);
          } else {
            MedicineScene.patient = this.patient;
            Engine.setScene(MedicineScene);
          }
        }
      }
    },
  };

  // ════════════════════════════════════════════
  //   MEDICINE SCENE
  // ════════════════════════════════════════════
  const MedicineScene = {
    patient: null,
    phase: 0, // 0: show medicine, 1: apply, 2: done
    time: 0,
    bottleX: W / 2,
    bottleY: 0,
    applied: false,
    healAnim: 0,

    draggingBottle: false,

    enter() {
      this.phase = 0;
      this.time = 0;
      this.applied = false;
      this.healAnim = 0;
      this.draggingBottle = false;
      this.bottleX = W / 2;
      this.bottleY = H + 50;
      this.dropZoneHover = false;
      Engine.tween(this, { bottleY: H * 0.55 }, 0.6, 'easeOut');
      Engine.bgmCheckup();
    },

    update(dt) {
      this.time += dt;
      if (this.applied) {
        this.healAnim += dt;
        if (this.healAnim > 2 && this.phase < 2) {
          this.phase = 2;
          this.patient.mood = 'happy';
        }
      }
      if (this.patient) this.patient.tailWag += dt * 4;
      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Room BG
      ctx.fillStyle = '#e8f0ec';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#d0d8d0';
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      // Table
      GFX.drawExamTable(ctx, 85, H * 0.35);

      // Patient
      if (this.patient) {
        const px = 195, py = H * 0.35 - 20;
        if (this.patient.type === 'dog') {
          GFX.drawDog(ctx, px, py, 0.9, this.patient.color, this.patient.mood, this.patient.tailWag, 0);
        } else {
          GFX.drawCat(ctx, px, py, 0.9, this.patient.color, this.patient.mood, this.patient.tailWag, 0);
        }
      }

      // Drop zone highlight when dragging
      if (this.draggingBottle && !this.applied) {
        const dzAlpha = this.dropZoneHover ? 0.35 : 0.12;
        ctx.fillStyle = `rgba(78,205,196,${dzAlpha})`;
        ctx.strokeStyle = `rgba(78,205,196,${dzAlpha + 0.3})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        Engine.roundRect(ctx, 100, H * 0.2, 200, 130, 16);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(78,205,196,0.9)';
        ctx.font = 'bold 12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Drop medicine here!', 200, H * 0.2 + 120);
      }

      // Medicine bottle
      if (!this.applied) {
        GFX.drawMedicineBottle(ctx, this.bottleX, this.bottleY, 2.5);
        ctx.fillStyle = '#4ecdc4';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔀 Drag medicine to patient (or tap)', W / 2, H * 0.7);
      }

      // Healing particles
      if (this.applied && this.healAnim < 3) {
        const num = Math.min(this.healAnim * 10, 20);
        for (let i = 0; i < num; i++) {
          const angle = (i / num) * Math.PI * 2 + this.time * 2;
          const dist = 30 + this.healAnim * 20;
          const hx = 195 + Math.cos(angle) * dist;
          const hy = H * 0.35 - 20 + Math.sin(angle) * dist * 0.6;
          ctx.fillStyle = `rgba(78,205,196,${1 - this.healAnim / 3})`;
          ctx.font = '16px sans-serif';
          ctx.fillText('✨', hx, hy);
        }
      }

      // Done
      if (this.phase === 2) {
        ctx.fillStyle = 'rgba(78,205,196,0.9)';
        Engine.roundRect(ctx, 40, H * 0.55, W - 80, 60, 16);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.patient.name} feels better! ❤️`, W / 2, H * 0.55 + 36);

        Engine.drawButton(ctx, W / 2 - 80, H * 0.7, 160, 50, '✅ Done!', '#4ecdc4');
      }

      // Ems
      GFX.drawEms(ctx, 50, H * 0.4, 0.7, 'happy');
    },

    _applyMedicine() {
      this.applied = true;
      this.draggingBottle = false;
      this.dropZoneHover = false;
      Engine.sfxHeal();
      Engine.tween(this, { bottleX: 195, bottleY: H * 0.35 - 40 }, 0.3, 'easeIn', () => {
        Engine.tween(this, { bottleY: -50 }, 0.4, 'easeIn');
      });
    },

    onDragStart(x, y) {
      if (!this.applied && Engine.hitCircle(x, y, this.bottleX, this.bottleY, 40)) {
        this.draggingBottle = true;
        Engine.sfxPickup();
        return 'bottle';
      }
      return null;
    },

    onDrag(target, x, y) {
      if (target === 'bottle' && !this.applied) {
        this.bottleX = x;
        this.bottleY = y;
        this.dropZoneHover = Engine.hitRect(x, y, 100, H * 0.2, 200, 130);
      }
    },

    onDrop(target, x, y) {
      if (target === 'bottle' && !this.applied) {
        if (this.dropZoneHover) {
          this._applyMedicine();
        } else {
          // Snap back
          this.draggingBottle = false;
          this.dropZoneHover = false;
          Engine.tween(this, { bottleX: W / 2, bottleY: H * 0.55 }, 0.3, 'easeOut');
        }
      }
    },

    onTap(x, y) {
      if (!this.applied && this.bottleY < H && Engine.hitCircle(x, y, this.bottleX, this.bottleY, 40)) {
        this._applyMedicine();
        return;
      }
      if (this.phase === 2 && Engine.hitRect(x, y, W / 2 - 80, H * 0.7, 160, 50)) {
        Engine.sfxSuccess();
        finishTreatment(this.patient);
      }
    },
  };

  // ════════════════════════════════════════════
  //   SURGERY SCENE
  // ════════════════════════════════════════════
  const SurgeryScene = {
    patient: null,
    step: 0,
    tools: [],
    time: 0,
    surgeryProgress: 0,
    stepComplete: false,
    fadeIn: 0,
    sparkles: [],

    enter() {
      this.step = 0;
      this.time = 0;
      this.stepComplete = false;
      this.fadeIn = 0;
      this.sparkles = [];

      const cond = this.patient.condition;
      this.tools = cond.tools.map((t, i) => ({
        name: t,
        x: 40 + i * 75,
        y: H - 65,
        originX: 40 + i * 75,
        originY: H - 65,
        used: false,
        dragging: false,
      }));
      this.surgeryProgress = 0;
      this.draggingTool = null;
      this.dropZoneHover = false;
      Engine.bgmSurgery();
    },

    update(dt) {
      this.time += dt;
      this.fadeIn = Math.min(this.fadeIn + dt * 2, 1);

      // Sparkles
      this.sparkles = this.sparkles.filter(s => {
        s.y -= 40 * dt;
        s.alpha -= dt;
        return s.alpha > 0;
      });

      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Surgery room BG
      GFX.drawSurgeryBG(ctx, W, H);

      // Left panel — surgery close-up area
      GFX.drawSurgeryArea(ctx, 40, 100, W - 80, 280, this.patient.condition.id, this.surgeryProgress);

      // Step info
      const steps = this.patient.condition.surgerySteps;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      Engine.roundRect(ctx, 20, 400, W - 40, 80, 14);
      ctx.fill();

      ctx.fillStyle = '#2a4a48';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Step ${this.step + 1}/${steps.length}`, W / 2, 425);

      ctx.fillStyle = '#5a7a78';
      ctx.font = '15px -apple-system, sans-serif';
      ctx.fillText(steps[Math.min(this.step, steps.length - 1)], W / 2, 455);

      // Progress dots
      for (let i = 0; i < steps.length; i++) {
        const dotX = W / 2 - (steps.length * 14) / 2 + i * 14;
        ctx.fillStyle = i < this.step ? '#4ecdc4' : i === this.step ? '#ff6b6b' : 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(dotX + 7, 470, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drop zone for surgery area
      if (this.draggingTool && this.step < steps.length) {
        const dzAlpha = this.dropZoneHover ? 0.3 : 0.1;
        ctx.fillStyle = `rgba(78,205,196,${dzAlpha})`;
        ctx.strokeStyle = `rgba(78,205,196,${dzAlpha + 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        Engine.roundRect(ctx, 40, 100, W - 80, 280, 12);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Tool tray
      ctx.fillStyle = 'rgba(40,60,70,0.9)';
      Engine.roundRect(ctx, 10, H - 110, W - 20, 100, 14);
      ctx.fill();

      if (this.step < steps.length) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔀 Drag tool to surgery area (or tap)', W / 2, H - 96);

        const highlight = Math.sin(this.time * 5) * 0.3 + 0.7;
        this.tools.forEach((t, i) => {
          if (t.dragging) return; // drawn on top
          if (t.used) {
            ctx.globalAlpha = 0.25;
          } else if (i === this.step) {
            ctx.fillStyle = `rgba(78,205,196,${highlight * 0.4})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 30, 0, Math.PI * 2);
            ctx.fill();
          }
          GFX.drawToolIcon(ctx, t.x, t.y, t.name, 1.4);
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.font = '9px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(t.name, t.x, t.y + 30);
        });

        // Draw dragging tool on top
        if (this.draggingTool && this.draggingTool.dragging) {
          ctx.globalAlpha = 0.85;
          GFX.drawToolIcon(ctx, this.draggingTool.x, this.draggingTool.y, this.draggingTool.name, 2);
          ctx.globalAlpha = 1;
        }
      }

      // Sparkles
      this.sparkles.forEach(s => {
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.font = '14px sans-serif';
        ctx.fillText(s.emoji, s.x, s.y);
      });
      ctx.globalAlpha = 1;

      // Surgery complete overlay
      if (this.step >= steps.length) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        Engine.roundRect(ctx, 40, H / 2 - 80, W - 80, 180, 20);
        ctx.fill();

        ctx.fillStyle = '#4ecdc4';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✅ Surgery Successful!', W / 2, H / 2 - 30);

        ctx.fillStyle = '#5a7a78';
        ctx.font = '15px -apple-system, sans-serif';
        ctx.fillText(`${this.patient.name} is recovering well!`, W / 2, H / 2 + 5);

        Engine.drawButton(ctx, W / 2 - 80, H / 2 + 40, 160, 48, '❤️ Finish', '#4ecdc4');
      }

      // Ems in surgical gear (small in corner)
      ctx.save();
      ctx.globalAlpha = 0.9;
      GFX.drawEms(ctx, 340, 90, 0.6, 'happy');
      ctx.restore();
    },

    _useSurgeryTool(t) {
      t.used = true;
      t.dragging = false;
      this.draggingTool = null;
      this.dropZoneHover = false;
      this.surgeryProgress++;
      this.step++;
      Engine.sfxSurgery();
      Engine.sfxDrop();
      for (let s = 0; s < 5; s++) {
        this.sparkles.push({
          x: W / 2 + (Math.random() - 0.5) * 60,
          y: 240,
          alpha: 1,
          color: '#4ecdc4',
          emoji: ['✨', '💫', '⭐'][Math.floor(Math.random() * 3)],
        });
      }
      if (this.step >= this.patient.condition.surgerySteps.length) {
        Engine.sfxSuccess();
      }
    },

    // ── Drag & Drop ──
    onDragStart(x, y) {
      const steps = this.patient.condition.surgerySteps;
      if (this.step >= steps.length) return null;
      for (let i = 0; i < this.tools.length; i++) {
        const t = this.tools[i];
        if (!t.used && i === this.step && Engine.hitCircle(x, y, t.x, t.y, 35)) {
          t.dragging = true;
          this.draggingTool = t;
          Engine.sfxPickup();
          return t;
        }
      }
      return null;
    },

    onDrag(target, x, y) {
      target.x = x;
      target.y = y;
      this.dropZoneHover = Engine.hitRect(x, y, 40, 100, W - 80, 280);
    },

    onDrop(target, x, y) {
      if (this.dropZoneHover && !target.used) {
        this._useSurgeryTool(target);
      } else {
        target.x = target.originX;
        target.y = target.originY;
        target.dragging = false;
        this.draggingTool = null;
        this.dropZoneHover = false;
      }
    },

    onTap(x, y) {
      const steps = this.patient.condition.surgerySteps;

      // Surgery complete — finish button
      if (this.step >= steps.length) {
        if (Engine.hitRect(x, y, W / 2 - 80, H / 2 + 40, 160, 48)) {
          Engine.sfxSuccess();
          this.patient.mood = 'happy';
          finishTreatment(this.patient);
        }
        return;
      }

      // Tap the correct tool (fallback)
      this.tools.forEach((t, i) => {
        if (!t.used && !t.dragging && i === this.step && Engine.hitCircle(x, y, t.x, t.y, 35)) {
          this._useSurgeryTool(t);
        }
      });
    },
  };

  // ════════════════════════════════════════════
  //   FINISH TREATMENT (shared)
  // ════════════════════════════════════════════
  function finishTreatment(patient) {
    const reward = patient.condition.reward;
    state.coins += reward;
    state.treated++;
    state.totalTreated++;
    state.reputation += 1;
    save(state);
    Engine.sfxCoin();
    Engine.sfxAnimalHappy();
    Engine.setScene(ResultScene);
    ResultScene.patient = patient;
    ResultScene.reward = reward;
  }

  // ════════════════════════════════════════════
  //   RESULT SCENE (Happy animal!)
  // ════════════════════════════════════════════
  const ResultScene = {
    patient: null,
    reward: 0,
    time: 0,
    hearts: [],

    enter() {
      this.time = 0;
      this.hearts = [];
      if (this.patient) this.patient.mood = 'happy';
      Engine.bgmResult();
      // Spawn floating hearts
      for (let i = 0; i < 8; i++) {
        this.hearts.push({
          x: W * 0.3 + Math.random() * W * 0.4,
          y: H * 0.5 + Math.random() * 60,
          vy: -30 - Math.random() * 40,
          size: 8 + Math.random() * 12,
          alpha: 1,
        });
      }
    },

    update(dt) {
      this.time += dt;
      if (this.patient) this.patient.tailWag += dt * 8;

      this.hearts.forEach(h => {
        h.y += h.vy * dt;
        h.alpha -= dt * 0.3;
      });
      this.hearts = this.hearts.filter(h => h.alpha > 0);

      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Cheerful BG
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#fff9e6');
      grad.addColorStop(1, '#ffe0e0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Confetti
      for (let i = 0; i < 20; i++) {
        const cx = (i * 73 + this.time * 50) % W;
        const cy = (i * 47 + this.time * 30 + Math.sin(i + this.time) * 20) % H;
        ctx.fillStyle = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#6c5ce7', '#a8e6cf'][i % 5];
        ctx.fillRect(cx, cy, 6, 6);
      }

      // Happy animal
      if (this.patient) {
        const px = W / 2, py = H * 0.35;
        if (this.patient.type === 'dog') {
          GFX.drawDog(ctx, px, py, 1.3, this.patient.color, 'happy', this.patient.tailWag, 0);
        } else {
          GFX.drawCat(ctx, px, py, 1.3, this.patient.color, 'happy', this.patient.tailWag, 0);
        }

        // Bandage if was surgery
        if (this.patient.condition.treatment === 'surgery') {
          GFX.drawBandageRoll(ctx, px + 20, py + 10, 0.5);
        }
      }

      // Floating hearts
      this.hearts.forEach(h => {
        ctx.globalAlpha = h.alpha;
        GFX.drawHeart(ctx, h.x, h.y, h.size);
      });
      ctx.globalAlpha = 1;

      // Result card
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      Engine.roundRect(ctx, 30, H * 0.55, W - 60, 160, 20);
      ctx.fill();

      ctx.fillStyle = '#4ecdc4';
      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.patient.name} is healthy! 🎉`, W / 2, H * 0.55 + 40);

      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 28px -apple-system, sans-serif';
      ctx.fillText(`+💰 ${this.reward}`, W / 2, H * 0.55 + 85);

      ctx.fillStyle = '#5a7a78';
      ctx.font = '14px -apple-system, sans-serif';
      ctx.fillText(`Total patients treated: ${state.totalTreated}`, W / 2, H * 0.55 + 115);

      // Continue button
      Engine.drawButton(ctx, W / 2 - 90, H * 0.55 + 135, 180, 50, '🏥 Next Patient', '#4ecdc4');
    },

    onTap(x, y) {
      if (Engine.hitRect(x, y, W / 2 - 90, H * 0.55 + 135, 180, 50)) {
        Engine.sfxTap();
        Engine.setScene(ClinicScene);
      }
    },
  };

  // ════════════════════════════════════════════
  //   DAY SUMMARY SCENE
  // ════════════════════════════════════════════
  const DaySummaryScene = {
    time: 0,

    enter() {
      this.time = 0;
      Engine.sfxDayEnd();
      Engine.bgmNight();
    },

    update(dt) {
      this.time += dt;
      Engine.updateTweens(dt);
    },

    draw(ctx) {
      // Night gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0a1628');
      grad.addColorStop(0.5, '#1a2a48');
      grad.addColorStop(1, '#2a3a58');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 30; i++) {
        const sx = (i * 97) % W;
        const sy = (i * 53) % (H * 0.5);
        const twinkle = Math.sin(this.time * 3 + i) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Moon
      ctx.fillStyle = '#ffeedd';
      ctx.beginPath();
      ctx.arc(W - 60, 60, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a1628';
      ctx.beginPath();
      ctx.arc(W - 48, 50, 26, 0, Math.PI * 2);
      ctx.fill();

      // Summary card
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      Engine.roundRect(ctx, 30, 180, W - 60, 360, 24);
      ctx.fill();

      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌙 Day Complete!', W / 2, 230);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.fillText(`Day ${state.day}`, W / 2, 265);

      // Stats
      const stats = [
        { icon: '🐾', label: 'Patients Treated', value: state.treated },
        { icon: '💰', label: 'Total Coins', value: state.coins },
        { icon: '⭐', label: 'Reputation', value: state.reputation },
        { icon: '📊', label: 'Career Total', value: state.totalTreated },
      ];

      stats.forEach((s, i) => {
        const sy = 300 + i * 48;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '15px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${s.icon} ${s.label}`, 60, sy);
        ctx.fillStyle = '#ffd93d';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${s.value}`, W - 60, sy);
      });

      // Ems sleeping
      ctx.save();
      ctx.globalAlpha = 0.8;
      GFX.drawEms(ctx, W / 2, H - 180, 1, 'happy');
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💤', W / 2 + 30, H - 210);
      ctx.restore();

      // Next day button
      Engine.drawButton(ctx, W / 2 - 100, H - 90, 200, 55, '☀️ Next Day', '#4ecdc4');
    },

    onTap(x, y) {
      if (Engine.hitRect(x, y, W / 2 - 100, H - 90, 200, 55)) {
        Engine.sfxTap();
        state.day++;
        save(state);
        Engine.setScene(ClinicScene);
      }
    },
  };

  // ════ Start ════
  Engine.init();
  Engine.setScene(TitleScene);

  // Register SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
