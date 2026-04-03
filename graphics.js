/* ============================================================
   Ems's Vet Clinic — Vector Graphics Library
   All animals, tools, environments drawn with Canvas 2D paths
   ============================================================ */

const GFX = (() => {

  // ── Color Palettes ──
  const PAL = {
    // Dogs
    goldenFur: '#e8b84b',
    goldenDark: '#c49530',
    brownFur: '#8B5E3C',
    brownDark: '#6B3F1F',
    whiteFur: '#f5f0e8',
    grayFur: '#9e9e9e',
    grayDark: '#707070',
    blackFur: '#3a3a3a',
    // Cats
    orangeFur: '#e8943a',
    orangeDark: '#c47020',
    tuxedoBlack: '#2a2a2a',
    siameseCream: '#f0e0c8',
    siameseBrown: '#8a6848',
    // Faces
    nose: '#2a1a1a',
    tongue: '#e87080',
    eyeWhite: '#fff',
    eyeIris: '#3a2a1a',
    eyeGreen: '#5a8a40',
    blush: 'rgba(255,120,120,0.3)',
    // Environment
    floorLight: '#e8e0d8',
    floorDark: '#d8cfc4',
    wallTop: '#b8ddd8',
    wallBot: '#98c8c0',
    tableTop: '#d0d8e0',
    tableLeg: '#a0a8b0',
    // Medical
    steel: '#c8d0d8',
    steelDark: '#a0a8b0',
    steelLight: '#e8ecf0',
    rubber: '#505860',
    medicine: '#60a8e8',
    medicineRed: '#e06060',
    bandageWhite: '#f8f4f0',
    bandageTan: '#e8d8c0',
    blood: '#cc3333',
    suture: '#1a1a2a',
    greenScrub: '#4ecdc4',
    greenDark: '#3aaa9a',
    // UI
    heartRed: '#e05060',
    coinGold: '#ffd700',
    starYellow: '#ffcc00',
  };

  // ══════════════════════════════════════════
  //   DRAW EMS (Veterinarian)
  // ══════════════════════════════════════════
  function drawEms(ctx, x, y, scale = 1, expression = 'happy') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Body / scrubs
    ctx.fillStyle = PAL.greenScrub;
    ctx.beginPath();
    ctx.ellipse(0, 30, 28, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PAL.greenDark;
    ctx.lineWidth = 2;
    ctx.stroke();

    // V-neck detail
    ctx.strokeStyle = PAL.greenDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(0, 8);
    ctx.lineTo(8, -4);
    ctx.stroke();

    // Head
    ctx.fillStyle = '#f5d0a8';
    ctx.beginPath();
    ctx.ellipse(0, -20, 22, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d8b088';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hair (dark brown, medium length)
    ctx.fillStyle = '#4a2a18';
    ctx.beginPath();
    ctx.ellipse(0, -36, 24, 16, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Side hair
    ctx.beginPath();
    ctx.ellipse(-20, -24, 8, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, -24, 8, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeY = -22;
    // Left eye
    ctx.fillStyle = PAL.eyeWhite;
    ctx.beginPath();
    ctx.ellipse(-8, eyeY, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a2518';
    ctx.beginPath();
    ctx.ellipse(-8, eyeY, 2.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-7, eyeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.fillStyle = PAL.eyeWhite;
    ctx.beginPath();
    ctx.ellipse(8, eyeY, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a2518';
    ctx.beginPath();
    ctx.ellipse(8, eyeY, 2.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(9, eyeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();

    // Expression
    if (expression === 'happy') {
      // Smile
      ctx.strokeStyle = '#8a5a3a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -14, 8, 0.1, Math.PI - 0.1);
      ctx.stroke();
      // Blush
      ctx.fillStyle = PAL.blush;
      ctx.beginPath();
      ctx.ellipse(-14, -14, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(14, -14, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (expression === 'concerned') {
      ctx.strokeStyle = '#8a5a3a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(6, -12);
      ctx.stroke();
    }

    // Stethoscope around neck
    ctx.strokeStyle = PAL.rubber;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.quadraticCurveTo(-15, 20, -5, 40);
    ctx.stroke();
    ctx.fillStyle = PAL.steel;
    ctx.beginPath();
    ctx.arc(-5, 40, 5, 0, Math.PI * 2);
    ctx.fill();

    // Name tag
    ctx.fillStyle = '#fff';
    Engine.roundRect(ctx, -18, 10, 36, 14, 4);
    ctx.fill();
    ctx.fillStyle = PAL.greenDark;
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Dr. Ems', 0, 17);

    ctx.restore();
  }

  // ══════════════════════════════════════════
  //   DRAW DOG
  // ══════════════════════════════════════════
  function drawDog(ctx, x, y, scale = 1, color = 'golden', mood = 'normal', tailWag = 0, legPhase = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const fur = color === 'golden' ? PAL.goldenFur : color === 'brown' ? PAL.brownFur : color === 'white' ? PAL.whiteFur : color === 'gray' ? PAL.grayFur : PAL.blackFur;
    const furDark = color === 'golden' ? PAL.goldenDark : color === 'brown' ? PAL.brownDark : color === 'white' ? '#e0d8d0' : color === 'gray' ? PAL.grayDark : '#1a1a1a';

    // Tail (behind body)
    ctx.save();
    ctx.translate(45, -15);
    ctx.rotate(Math.sin(tailWag) * 0.5);
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(20, -25, 15, -35);
    ctx.quadraticCurveTo(10, -25, -2, -5);
    ctx.fill();
    ctx.restore();

    // Back legs
    const backLegOffset = Math.sin(legPhase) * 4;
    ctx.fillStyle = furDark;
    // Back left
    ctx.beginPath();
    ctx.ellipse(30, 30 + backLegOffset, 8, 18, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Back right
    ctx.beginPath();
    ctx.ellipse(35, 30 - backLegOffset, 7, 16, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(10, 5, 40, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = furDark;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Belly (lighter)
    ctx.fillStyle = color === 'black' ? '#4a4a4a' : '#fff8f0';
    ctx.beginPath();
    ctx.ellipse(5, 15, 25, 14, 0, 0, Math.PI);
    ctx.fill();

    // Front legs
    const frontLegOffset = Math.sin(legPhase + Math.PI) * 4;
    ctx.fillStyle = fur;
    // Front left
    ctx.beginPath();
    ctx.ellipse(-20, 30 + frontLegOffset, 8, 18, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // Front right
    ctx.beginPath();
    ctx.ellipse(-15, 30 - frontLegOffset, 7, 16, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Paws
    ctx.fillStyle = furDark;
    ctx.beginPath();
    ctx.ellipse(-20, 46 + frontLegOffset, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-15, 44 - frontLegOffset, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(30, 46 + backLegOffset, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(35, 44 - backLegOffset, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(-35, -10, 22, 20, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = furDark;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ears (floppy)
    ctx.fillStyle = furDark;
    ctx.beginPath();
    ctx.ellipse(-50, -18, 10, 18, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-22, -20, 10, 18, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = color === 'black' ? '#4a4a4a' : '#f0dcc4';
    ctx.beginPath();
    ctx.ellipse(-48, -4, 14, 10, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.fillStyle = PAL.nose;
    ctx.beginPath();
    ctx.ellipse(-56, -6, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(-55, -8, 2, 1.5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeY = -16;
    if (mood === 'sick') {
      // Droopy eyes
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-42, eyeY, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeIris;
      ctx.beginPath();
      ctx.arc(-42, eyeY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-30, eyeY, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeIris;
      ctx.beginPath();
      ctx.arc(-30, eyeY, 2, 0, Math.PI * 2);
      ctx.fill();
      // Sad eyebrows
      ctx.strokeStyle = furDark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-46, eyeY - 5);
      ctx.lineTo(-38, eyeY - 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-26, eyeY - 7);
      ctx.lineTo(-34, eyeY - 5);
      ctx.stroke();
    } else if (mood === 'happy') {
      // Happy closed eyes (^_^)
      ctx.strokeStyle = PAL.eyeIris;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-42, eyeY, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-30, eyeY, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
    } else {
      // Normal eyes
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-42, eyeY, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeIris;
      ctx.beginPath();
      ctx.arc(-42, eyeY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-41, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-30, eyeY, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeIris;
      ctx.beginPath();
      ctx.arc(-30, eyeY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-29, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    if (mood === 'happy') {
      ctx.strokeStyle = '#6a4030';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-48, 0, 6, 0.2, Math.PI - 0.2);
      ctx.stroke();
      // Tongue
      ctx.fillStyle = PAL.tongue;
      ctx.beginPath();
      ctx.ellipse(-48, 5, 4, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (mood === 'sick') {
      ctx.strokeStyle = '#6a4030';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-48, 4, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
    }

    // Sick indicators
    if (mood === 'sick') {
      // Sweat drop
      ctx.fillStyle = 'rgba(100,180,255,0.6)';
      ctx.beginPath();
      ctx.moveTo(-24, -28);
      ctx.quadraticCurveTo(-22, -22, -24, -18);
      ctx.quadraticCurveTo(-28, -22, -24, -28);
      ctx.fill();
      // Dizzy swirls
      ctx.strokeStyle = 'rgba(200,150,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-56, -20, 5, 0, Math.PI * 1.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ══════════════════════════════════════════
  //   DRAW CAT
  // ══════════════════════════════════════════
  function drawCat(ctx, x, y, scale = 1, color = 'orange', mood = 'normal', tailWag = 0, legPhase = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const fur = color === 'orange' ? PAL.orangeFur : color === 'tuxedo' ? PAL.tuxedoBlack : color === 'siamese' ? PAL.siameseCream : color === 'gray' ? PAL.grayFur : PAL.whiteFur;
    const furDark = color === 'orange' ? PAL.orangeDark : color === 'tuxedo' ? '#1a1a1a' : color === 'siamese' ? PAL.siameseBrown : color === 'gray' ? PAL.grayDark : '#ddd4c8';

    // Tail (curvy, behind body)
    ctx.save();
    ctx.translate(38, -10);
    ctx.rotate(Math.sin(tailWag) * 0.3);
    ctx.strokeStyle = fur;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(15, -35, 25, -45);
    ctx.stroke();
    ctx.strokeStyle = furDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(15, -35, 25, -45);
    ctx.stroke();
    ctx.restore();

    // Back legs
    const backOff = Math.sin(legPhase) * 3;
    ctx.fillStyle = furDark;
    ctx.beginPath();
    ctx.ellipse(25, 22 + backOff, 7, 14, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(30, 22 - backOff, 6, 13, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Body (sleeker than dog)
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(5, 2, 34, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = furDark;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tuxedo chest
    if (color === 'tuxedo') {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-5, 8, 12, 14, 0, -0.5, Math.PI + 0.5);
      ctx.fill();
    }

    // Front legs
    const frontOff = Math.sin(legPhase + Math.PI) * 3;
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(-18, 22 + frontOff, 6, 14, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-13, 22 - frontOff, 6, 13, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Tiny paws
    ctx.fillStyle = color === 'tuxedo' ? '#fff' : furDark;
    ctx.beginPath();
    ctx.ellipse(-18, 35 + frontOff, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-13, 34 - frontOff, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(25, 35 + backOff, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(30, 34 - backOff, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (rounder than dog)
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(-28, -12, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pointed ears
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.moveTo(-42, -24);
    ctx.lineTo(-46, -44);
    ctx.lineTo(-34, -28);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-16, -24);
    ctx.lineTo(-12, -44);
    ctx.lineTo(-22, -28);
    ctx.closePath();
    ctx.fill();
    // Inner ears
    ctx.fillStyle = '#f0a0a0';
    ctx.beginPath();
    ctx.moveTo(-41, -25);
    ctx.lineTo(-44, -39);
    ctx.lineTo(-35, -27);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-17, -25);
    ctx.lineTo(-14, -39);
    ctx.lineTo(-23, -27);
    ctx.closePath();
    ctx.fill();

    // Siamese face markings
    if (color === 'siamese') {
      ctx.fillStyle = PAL.siameseBrown;
      ctx.beginPath();
      ctx.ellipse(-35, -6, 12, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose (tiny triangle)
    ctx.fillStyle = '#e08080';
    ctx.beginPath();
    ctx.moveTo(-32, -8);
    ctx.lineTo(-28, -8);
    ctx.lineTo(-30, -5);
    ctx.closePath();
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = color === 'white' || color === 'siamese' ? '#bbb' : '#ddd';
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-42, -4 + i * 4);
      ctx.lineTo(-58, -8 + i * 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, -4 + i * 4);
      ctx.lineTo(-4, -8 + i * 5);
      ctx.stroke();
    }

    // Eyes
    const eyeY = -16;
    if (mood === 'happy') {
      ctx.strokeStyle = PAL.eyeGreen;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-36, eyeY, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-22, eyeY, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
    } else if (mood === 'sick') {
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-36, eyeY, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeGreen;
      ctx.beginPath();
      ctx.ellipse(-36, eyeY, 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(-36, eyeY, 1, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-22, eyeY, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeGreen;
      ctx.beginPath();
      ctx.ellipse(-22, eyeY, 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(-22, eyeY, 1, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal cat eyes (slit pupils)
      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-36, eyeY, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeGreen;
      ctx.beginPath();
      ctx.ellipse(-36, eyeY, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(-36, eyeY, 1.2, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-35, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PAL.eyeWhite;
      ctx.beginPath();
      ctx.ellipse(-22, eyeY, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.eyeGreen;
      ctx.beginPath();
      ctx.ellipse(-22, eyeY, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(-22, eyeY, 1.2, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-21, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sick indicators
    if (mood === 'sick') {
      ctx.fillStyle = 'rgba(100,180,255,0.6)';
      ctx.beginPath();
      ctx.moveTo(-14, -32);
      ctx.quadraticCurveTo(-12, -26, -14, -22);
      ctx.quadraticCurveTo(-18, -26, -14, -32);
      ctx.fill();
    }

    ctx.restore();
  }

  // ══════════════════════════════════════════
  //   MEDICAL TOOLS
  // ══════════════════════════════════════════

  function drawStethoscope(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Earpieces
    ctx.fillStyle = PAL.steel;
    ctx.beginPath();
    ctx.ellipse(-8, -30, 3, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -30, 3, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Tubes
    ctx.strokeStyle = PAL.rubber;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, -25);
    ctx.quadraticCurveTo(-10, 0, 0, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, -25);
    ctx.quadraticCurveTo(10, 0, 0, 15);
    ctx.stroke();
    // Chest piece
    ctx.fillStyle = PAL.steel;
    ctx.beginPath();
    ctx.arc(0, 22, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAL.steelLight;
    ctx.beginPath();
    ctx.arc(0, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAL.steelDark;
    ctx.beginPath();
    ctx.arc(0, 22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawThermometer(ctx, x, y, scale = 1, temp = 0.5) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Body
    ctx.fillStyle = '#fff';
    Engine.roundRect(ctx, -4, -35, 8, 60, 4);
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    Engine.roundRect(ctx, -4, -35, 8, 60, 4);
    ctx.stroke();
    // Mercury well
    ctx.fillStyle = PAL.medicineRed;
    ctx.beginPath();
    ctx.arc(0, 25, 6, 0, Math.PI * 2);
    ctx.fill();
    // Mercury level
    const h = temp * 45;
    ctx.fillStyle = PAL.medicineRed;
    ctx.fillRect(-2, 25 - h, 4, h);
    // Tick marks
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 6; i++) {
      const yy = 20 - i * 8;
      ctx.beginPath();
      ctx.moveTo(4, yy);
      ctx.lineTo(7, yy);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSyringe(ctx, x, y, scale = 1, filled = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Barrel
    ctx.fillStyle = 'rgba(200,220,255,0.5)';
    Engine.roundRect(ctx, -6, -30, 12, 45, 3);
    ctx.fill();
    ctx.strokeStyle = PAL.steelDark;
    ctx.lineWidth = 1.5;
    Engine.roundRect(ctx, -6, -30, 12, 45, 3);
    ctx.stroke();
    // Liquid
    const h = filled * 40;
    ctx.fillStyle = 'rgba(100,180,255,0.6)';
    ctx.fillRect(-4, 15 - h, 8, h);
    // Plunger
    ctx.fillStyle = PAL.steel;
    ctx.fillRect(-2, -35, 4, 10);
    ctx.fillStyle = PAL.rubber;
    ctx.fillRect(-6, -36, 12, 4);
    // Needle
    ctx.strokeStyle = PAL.steel;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 30);
    ctx.stroke();
    // Tip
    ctx.fillStyle = PAL.steelLight;
    ctx.beginPath();
    ctx.moveTo(-1, 30);
    ctx.lineTo(0, 35);
    ctx.lineTo(1, 30);
    ctx.fill();
    // Dose marks
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const yy = 10 - i * 8;
      ctx.beginPath();
      ctx.moveTo(6, yy);
      ctx.lineTo(9, yy);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawScalpel(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Handle
    ctx.fillStyle = PAL.steel;
    Engine.roundRect(ctx, -3, -10, 6, 35, 2);
    ctx.fill();
    ctx.fillStyle = PAL.rubber;
    Engine.roundRect(ctx, -4, 5, 8, 18, 2);
    ctx.fill();
    // Grip lines
    ctx.strokeStyle = PAL.steelDark;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-3, 8 + i * 4);
      ctx.lineTo(3, 8 + i * 4);
      ctx.stroke();
    }
    // Blade
    ctx.fillStyle = PAL.steelLight;
    ctx.beginPath();
    ctx.moveTo(-2, -10);
    ctx.lineTo(0, -28);
    ctx.quadraticCurveTo(6, -20, 3, -10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PAL.steelDark;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Shine
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(1, -14);
    ctx.stroke();
    ctx.restore();
  }

  function drawTweezers(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = PAL.steel;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    // Left arm
    ctx.beginPath();
    ctx.moveTo(-3, -25);
    ctx.quadraticCurveTo(-8, 0, -2, 20);
    ctx.stroke();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(3, -25);
    ctx.quadraticCurveTo(8, 0, 2, 20);
    ctx.stroke();
    // Tips
    ctx.fillStyle = PAL.steelLight;
    ctx.beginPath();
    ctx.ellipse(-2, 20, 2, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(2, 20, 2, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Ridged grip
    ctx.strokeStyle = PAL.steelDark;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-5, -20 + i * 3);
      ctx.lineTo(-1, -20 + i * 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1, -20 + i * 3);
      ctx.lineTo(5, -20 + i * 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBandageRoll(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Roll
    ctx.fillStyle = PAL.bandageWhite;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PAL.bandageTan;
    ctx.lineWidth = 1;
    ctx.stroke();
    // Center hole
    ctx.fillStyle = PAL.bandageTan;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    // Wrap lines
    ctx.strokeStyle = 'rgba(200,185,165,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, 7 + i * 2.5, i * 0.8, i * 0.8 + Math.PI * 1.2);
      ctx.stroke();
    }
    // Trailing end
    ctx.strokeStyle = PAL.bandageWhite;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(12, 5);
    ctx.quadraticCurveTo(20, 10, 18, 18);
    ctx.stroke();
    ctx.strokeStyle = PAL.bandageTan;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, 5);
    ctx.quadraticCurveTo(20, 10, 18, 18);
    ctx.stroke();
    ctx.restore();
  }

  function drawMedicineBottle(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Bottle body
    ctx.fillStyle = '#e8f4ff';
    Engine.roundRect(ctx, -10, -10, 20, 30, 4);
    ctx.fill();
    ctx.strokeStyle = '#b0c8e0';
    ctx.lineWidth = 1.5;
    Engine.roundRect(ctx, -10, -10, 20, 30, 4);
    ctx.stroke();
    // Liquid
    ctx.fillStyle = 'rgba(100,160,230,0.4)';
    Engine.roundRect(ctx, -8, 4, 16, 14, 3);
    ctx.fill();
    // Cap
    ctx.fillStyle = '#fff';
    Engine.roundRect(ctx, -7, -18, 14, 10, 3);
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    Engine.roundRect(ctx, -7, -18, 14, 10, 3);
    ctx.stroke();
    // Label
    ctx.fillStyle = '#fff';
    Engine.roundRect(ctx, -8, -6, 16, 14, 2);
    ctx.fill();
    // Cross
    ctx.fillStyle = PAL.medicineRed;
    ctx.fillRect(-2, -4, 4, 10);
    ctx.fillRect(-5, -1, 10, 4);
    // Rx text
    ctx.fillStyle = '#6090c0';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Rx', 0, 12);
    ctx.restore();
  }

  function drawFlashlight(ctx, x, y, scale = 1, on = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Light beam
    if (on) {
      ctx.fillStyle = 'rgba(255,255,200,0.3)';
      ctx.beginPath();
      ctx.moveTo(-6, -20);
      ctx.lineTo(-20, -50);
      ctx.lineTo(20, -50);
      ctx.lineTo(6, -20);
      ctx.closePath();
      ctx.fill();
    }
    // Body
    ctx.fillStyle = PAL.steel;
    Engine.roundRect(ctx, -5, -5, 10, 35, 3);
    ctx.fill();
    // Head
    ctx.fillStyle = PAL.steelDark;
    Engine.roundRect(ctx, -7, -20, 14, 18, 4);
    ctx.fill();
    // Lens
    ctx.fillStyle = on ? '#fffde0' : '#e8e8e0';
    ctx.beginPath();
    ctx.arc(0, -18, 5, 0, Math.PI * 2);
    ctx.fill();
    // Button
    ctx.fillStyle = PAL.rubber;
    ctx.beginPath();
    ctx.ellipse(0, 10, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSutureTool(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Needle (curved)
    ctx.strokeStyle = PAL.steel;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 5, 15, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
    // Tip
    ctx.fillStyle = PAL.steelLight;
    const tipAngle = -Math.PI * 0.2;
    const tx = 15 * Math.cos(tipAngle);
    const ty = 5 + 15 * Math.sin(tipAngle);
    ctx.beginPath();
    ctx.arc(tx, ty, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Thread
    ctx.strokeStyle = PAL.suture;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.quadraticCurveTo(-5, -20, 10, -15);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ══════════════════════════════════════════
  //   ENVIRONMENTS
  // ══════════════════════════════════════════

  function drawClinicBG(ctx, W, H) {
    // Wall
    const grad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    grad.addColorStop(0, '#d4f0ed');
    grad.addColorStop(1, '#a8ddd6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H * 0.6);

    // Wainscoting
    ctx.fillStyle = '#90c8c0';
    ctx.fillRect(0, H * 0.35, W, 8);

    // Floor
    const floorY = H * 0.6;
    ctx.fillStyle = PAL.floorLight;
    ctx.fillRect(0, floorY, W, H * 0.4);
    // Floor tiles
    ctx.strokeStyle = PAL.floorDark;
    ctx.lineWidth = 1;
    const tileSize = 50;
    for (let tx = 0; tx < W; tx += tileSize) {
      ctx.beginPath();
      ctx.moveTo(tx, floorY);
      ctx.lineTo(tx, H);
      ctx.stroke();
    }
    for (let ty = floorY; ty < H; ty += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, ty);
      ctx.lineTo(W, ty);
      ctx.stroke();
    }

    // Window
    ctx.fillStyle = '#c8e8ff';
    Engine.roundRect(ctx, 20, 40, 80, 60, 6);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    Engine.roundRect(ctx, 20, 40, 80, 60, 6);
    ctx.stroke();
    // Crossbar
    ctx.beginPath();
    ctx.moveTo(60, 40);
    ctx.lineTo(60, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(100, 70);
    ctx.stroke();

    // Potted plant
    ctx.fillStyle = '#8B5E3C';
    Engine.roundRect(ctx, 290, H * 0.6 - 50, 35, 40, 5);
    ctx.fill();
    ctx.fillStyle = '#60aa50';
    ctx.beginPath();
    ctx.ellipse(307, H * 0.6 - 60, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#70c060';
    ctx.beginPath();
    ctx.ellipse(300, H * 0.6 - 70, 12, 14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(315, H * 0.6 - 65, 10, 12, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Clinic sign
    ctx.fillStyle = '#fff';
    Engine.roundRect(ctx, 120, 25, 160, 40, 10);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 8;
    Engine.roundRect(ctx, 120, 25, 160, 40, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = PAL.greenDark;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("🏥 Ems's Vet Clinic", 200, 50);
  }

  function drawExamTable(ctx, x, y) {
    // Table shadow
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    Engine.roundRect(ctx, x - 2, y + 4, 220, 28, 8);
    ctx.fill();
    // Table top
    const tGrad = ctx.createLinearGradient(x, y, x, y + 24);
    tGrad.addColorStop(0, '#e0e8f0');
    tGrad.addColorStop(1, '#c8d0d8');
    ctx.fillStyle = tGrad;
    Engine.roundRect(ctx, x, y, 216, 24, 8);
    ctx.fill();
    ctx.strokeStyle = '#b0b8c0';
    ctx.lineWidth = 1.5;
    Engine.roundRect(ctx, x, y, 216, 24, 8);
    ctx.stroke();
    // Legs
    ctx.fillStyle = PAL.tableLeg;
    Engine.roundRect(ctx, x + 15, y + 24, 10, 50, 3);
    ctx.fill();
    Engine.roundRect(ctx, x + 190, y + 24, 10, 50, 3);
    ctx.fill();
    // Leg crossbar
    ctx.fillStyle = PAL.steelDark;
    ctx.fillRect(x + 20, y + 55, 180, 4);
    // Pad on table
    ctx.fillStyle = 'rgba(200,230,220,0.5)';
    Engine.roundRect(ctx, x + 10, y + 2, 196, 18, 5);
    ctx.fill();
  }

  function drawSurgeryBG(ctx, W, H) {
    // Dark surgical room
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a3040');
    grad.addColorStop(1, '#0a2030');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Overhead surgical light
    ctx.fillStyle = '#304050';
    ctx.fillRect(W / 2 - 3, 0, 6, 50);
    // Light housing
    ctx.fillStyle = '#405060';
    ctx.beginPath();
    ctx.ellipse(W / 2, 60, 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Light glow
    ctx.fillStyle = 'rgba(255,255,240,0.08)';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 40, 65);
    ctx.lineTo(W / 2 - 100, H * 0.5);
    ctx.lineTo(W / 2 + 100, H * 0.5);
    ctx.lineTo(W / 2 + 40, 65);
    ctx.closePath();
    ctx.fill();
    // Light bulbs
    ctx.fillStyle = '#fffde0';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(W / 2 + i * 12, 65, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Monitor
    ctx.fillStyle = '#1a2a35';
    Engine.roundRect(ctx, 15, 80, 80, 55, 6);
    ctx.fill();
    ctx.fillStyle = '#0a3a2a';
    Engine.roundRect(ctx, 20, 85, 70, 40, 4);
    ctx.fill();
    // Heart rate line
    ctx.strokeStyle = '#40ff80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const t = Date.now() / 200;
    for (let i = 0; i < 60; i++) {
      const px = 25 + i;
      const peak = (i + t) % 30;
      let py = 105;
      if (peak > 12 && peak < 16) py -= (peak - 12) * 5;
      else if (peak >= 16 && peak < 20) py += (peak - 16) * 3;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // ══════════════════════════════════════════
  //   SURGERY CLOSE-UP VIEWS
  // ══════════════════════════════════════════

  function drawSurgeryArea(ctx, x, y, w, h, condition, progress = 0) {
    ctx.save();
    ctx.translate(x, y);

    // Surgical drape
    ctx.fillStyle = '#2a6a60';
    Engine.roundRect(ctx, 0, 0, w, h, 12);
    ctx.fill();

    // Opening in drape
    ctx.fillStyle = '#f5c8a8';  // skin color
    Engine.roundRect(ctx, 20, 20, w - 40, h - 40, 8);
    ctx.fill();

    if (condition === 'swallowed_object') {
      // Belly view
      ctx.fillStyle = '#f0bca0';
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 60, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      // Incision line (if progress > 0)
      if (progress >= 1) {
        ctx.strokeStyle = PAL.blood;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 40, h / 2);
        ctx.lineTo(w / 2 + 40, h / 2);
        ctx.stroke();
      }
      // Inside visible (if progress >= 2)
      if (progress >= 2) {
        ctx.fillStyle = '#e0a088';
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, 35, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        // The swallowed object (ball)
        if (progress < 3) {
          ctx.fillStyle = '#4488ff';
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.arc(w / 2 - 3, h / 2 - 3, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Stitched up (progress >= 4)
      if (progress >= 4) {
        ctx.strokeStyle = PAL.suture;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          const sx = w / 2 - 30 + i * 12;
          ctx.beginPath();
          ctx.moveTo(sx, h / 2 - 4);
          ctx.lineTo(sx + 6, h / 2 + 4);
          ctx.stroke();
        }
      }
    } else if (condition === 'broken_bone') {
      // Leg view with bone visible
      ctx.fillStyle = '#f0bca0';
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 30, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      // Bone (X-ray style overlay)
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2 - 40);
      ctx.lineTo(w / 2, h / 2 - 5);
      ctx.stroke();
      if (progress < 2) {
        // Broken part (offset)
        ctx.beginPath();
        ctx.moveTo(w / 2 + 4, h / 2 + 5);
        ctx.lineTo(w / 2 + 4, h / 2 + 40);
        ctx.stroke();
        // Crack lines
        ctx.strokeStyle = 'rgba(255,100,100,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 5, h / 2 - 5);
        ctx.lineTo(w / 2 + 8, h / 2 + 5);
        ctx.stroke();
      } else {
        // Aligned bone
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2 + 5);
        ctx.lineTo(w / 2, h / 2 + 40);
        ctx.stroke();
      }
      // Cast/splint (progress >= 3)
      if (progress >= 3) {
        ctx.fillStyle = '#f0f0f0';
        Engine.roundRect(ctx, w / 2 - 18, h / 2 - 45, 36, 90, 8);
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        Engine.roundRect(ctx, w / 2 - 18, h / 2 - 45, 36, 90, 8);
        ctx.stroke();
      }
    } else if (condition === 'wound') {
      // Skin surface with wound
      ctx.fillStyle = '#f0bca0';
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 65, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wound
      if (progress < 3) {
        ctx.strokeStyle = PAL.blood;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 25, h / 2 + 5);
        ctx.quadraticCurveTo(w / 2, h / 2 - 10, w / 2 + 25, h / 2 + 5);
        ctx.stroke();
        // Blood drops
        ctx.fillStyle = 'rgba(200,40,40,0.5)';
        ctx.beginPath();
        ctx.arc(w / 2 - 10, h / 2 + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w / 2 + 5, h / 2 + 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Cleaned (progress >= 1)
      if (progress >= 1 && progress < 3) {
        ctx.strokeStyle = 'rgba(200,40,40,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 25, h / 2 + 5);
        ctx.quadraticCurveTo(w / 2, h / 2 - 10, w / 2 + 25, h / 2 + 5);
        ctx.stroke();
      }
      // Stitches (progress >= 2)
      if (progress >= 2) {
        ctx.strokeStyle = PAL.suture;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
          const ratio = (i + 0.5) / 5;
          const sx = w / 2 - 22 + ratio * 44;
          const curveMid = -10 * Math.sin(ratio * Math.PI);
          const sy = h / 2 + 5 + curveMid * 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - 3, sy - 5);
          ctx.lineTo(sx + 3, sy + 5);
          ctx.stroke();
        }
      }
      // Bandaged (progress >= 3)
      if (progress >= 3) {
        ctx.fillStyle = 'rgba(248,244,240,0.8)';
        Engine.roundRect(ctx, w / 2 - 35, h / 2 - 15, 70, 30, 6);
        ctx.fill();
        ctx.strokeStyle = PAL.bandageTan;
        ctx.lineWidth = 1;
        Engine.roundRect(ctx, w / 2 - 35, h / 2 - 15, 70, 30, 6);
        ctx.stroke();
        // Cross
        ctx.fillStyle = PAL.medicineRed;
        ctx.fillRect(w / 2 - 4, h / 2 - 10, 8, 20);
        ctx.fillRect(w / 2 - 10, h / 2 - 4, 20, 8);
      }
    } else if (condition === 'dental') {
      // Open mouth view
      ctx.fillStyle = '#d4908a';
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 55, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tongue
      ctx.fillStyle = PAL.tongue;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 + 15, 25, 18, 0, 0, Math.PI);
      ctx.fill();
      // Teeth row (top)
      for (let i = 0; i < 8; i++) {
        const tx = w / 2 - 35 + i * 10;
        ctx.fillStyle = (i === 3 && progress < 2) ? '#c8a830' : '#f8f4f0'; // Bad tooth
        Engine.roundRect(ctx, tx, h / 2 - 28, 8, 14, 2);
        ctx.fill();
        if (i === 3 && progress < 2) {
          // Cavity marking
          ctx.fillStyle = '#4a3020';
          ctx.beginPath();
          ctx.arc(tx + 4, h / 2 - 22, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Bottom teeth
      for (let i = 0; i < 8; i++) {
        const tx = w / 2 - 35 + i * 10;
        ctx.fillStyle = '#f8f4f0';
        Engine.roundRect(ctx, tx, h / 2 + 14, 8, 12, 2);
        ctx.fill();
      }
      // Tooth removed (progress >= 2)
      if (progress >= 2) {
        ctx.fillStyle = '#d4908a';
        ctx.fillRect(w / 2 - 35 + 30, h / 2 - 28, 10, 16);
      }
    }

    ctx.restore();
  }

  // ══════════════════════════════════════════
  //   UI ELEMENTS
  // ══════════════════════════════════════════

  function drawHeart(ctx, x, y, size, filled = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-10, -8, -20, 0, -10, 10);
    ctx.lineTo(0, 18);
    ctx.lineTo(10, 10);
    ctx.bezierCurveTo(20, 0, 10, -8, 0, 5);
    ctx.closePath();
    ctx.fillStyle = filled ? PAL.heartRed : 'rgba(200,200,200,0.5)';
    ctx.fill();
    ctx.restore();
  }

  function drawCoin(ctx, x, y, size) {
    ctx.save();
    ctx.fillStyle = PAL.coinGold;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c8a800';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#b8960a';
    ctx.font = `bold ${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', x, y + 1);
    ctx.restore();
  }

  function drawStar(ctx, x, y, size, progress = 1) {
    ctx.save();
    ctx.translate(x, y);
    const s = size;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180;
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
      ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
      ctx.lineTo(Math.cos(innerAngle) * s * 0.4, Math.sin(innerAngle) * s * 0.4);
    }
    ctx.closePath();
    ctx.fillStyle = progress >= 1 ? PAL.starYellow : 'rgba(200,200,200,0.4)';
    ctx.fill();
    ctx.strokeStyle = progress >= 1 ? '#e0aa00' : '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // Tool icon labels for the tool tray
  function drawToolIcon(ctx, x, y, toolName, size = 1) {
    switch (toolName) {
      case 'stethoscope': drawStethoscope(ctx, x, y, size * 0.5); break;
      case 'thermometer': drawThermometer(ctx, x, y, size * 0.5); break;
      case 'syringe': drawSyringe(ctx, x, y, size * 0.5); break;
      case 'scalpel': drawScalpel(ctx, x, y, size * 0.5); break;
      case 'tweezers': drawTweezers(ctx, x, y, size * 0.5); break;
      case 'bandage': drawBandageRoll(ctx, x, y, size * 0.5); break;
      case 'medicine': drawMedicineBottle(ctx, x, y, size * 0.5); break;
      case 'flashlight': drawFlashlight(ctx, x, y, size * 0.5, true); break;
      case 'suture': drawSutureTool(ctx, x, y, size * 0.5); break;
    }
  }

  return {
    PAL,
    drawEms, drawDog, drawCat,
    drawStethoscope, drawThermometer, drawSyringe, drawScalpel,
    drawTweezers, drawBandageRoll, drawMedicineBottle, drawFlashlight, drawSutureTool,
    drawClinicBG, drawExamTable, drawSurgeryBG, drawSurgeryArea,
    drawHeart, drawCoin, drawStar, drawToolIcon,
  };
})();
