/**
 * MIPS Maritime Image Assets Generator
 * Renders 4 high-resolution, production-grade visual assets using SVG + Sharp:
 *  1. vessel-hero.png (1920x1080) - MV Nusantara entering Tanjung Priok at sunset
 *  2. officer-gunawan.png (800x800) - Capt. H. Gunawan formal portrait with VTS background
 *  3. terminal-panorama.png (1920x600) - Tanjung Priok container terminal dusk panorama
 *  4. seal-competency.png (600x600) - Embossed gold maritime competency verification seal
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'images');

// XML safe escape
function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Helper to render text along an arc (calculates exact character positions & rotations)
function renderArcText(text, cx, cy, radius, startAngleDeg, endAngleDeg, options = {}) {
  const {
    fontSize = 16,
    fill = '#FFF',
    fontFamily = 'Arial, sans-serif',
    fontWeight = 'bold',
    letterSpacing = 0,
    inward = true,
    filter = ''
  } = options;

  const chars = [...text];
  if (chars.length === 0) return '';
  const totalAngle = endAngleDeg - startAngleDeg;
  const step = chars.length > 1 ? totalAngle / (chars.length - 1) : 0;

  return chars.map((ch, idx) => {
    const angleDeg = startAngleDeg + idx * step;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + radius * Math.cos(angleRad);
    const y = cy + radius * Math.sin(angleRad);
    const rot = inward ? angleDeg + 90 : angleDeg - 90;
    const safeCh = escapeXml(ch);
    const filterAttr = filter ? `filter="${filter}"` : '';

    return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" font-family="${fontFamily}" font-weight="${fontWeight}" font-size="${fontSize}" fill="${fill}" text-anchor="middle" dominant-baseline="central" transform="rotate(${rot.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})" ${filterAttr}>${safeCh}</text>`;
  }).join('\n');
}

// Helper to render a 5-pointed faceted gold star
function renderStar(cx, cy, outerR, innerR, fillLight = '#FFF9D2', fillDark = '#D4AF37') {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a0 = (i * 72 - 90) * (Math.PI / 180);
    const a1 = (i * 72 + 36 - 90) * (Math.PI / 180);
    const a2 = ((i + 1) * 72 - 90) * (Math.PI / 180);

    const x0 = cx + outerR * Math.cos(a0);
    const y0 = cy + outerR * Math.sin(a0);
    const x1 = cx + innerR * Math.cos(a1);
    const y1 = cy + innerR * Math.sin(a1);
    const x2 = cx + outerR * Math.cos(a2);
    const y2 = cy + outerR * Math.sin(a2);

    // Left facet (light)
    s += `<polygon points="${cx},${cy} ${x0.toFixed(2)},${y0.toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}" fill="${fillLight}" />`;
    // Right facet (dark)
    s += `<polygon points="${cx},${cy} ${x1.toFixed(2)},${y1.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}" fill="${fillDark}" />`;
  }
  return s;
}

// ============================================================================
// 1. VESSEL HERO (1920x1080)
// ============================================================================
function generateVesselHeroSvg() {
  const W = 1920;
  const H = 1080;

  // Sun specular water ripples
  const waterRipples = [];
  for (let y = 610; y < 1080; y += 7) {
    const spread = (y - 590) * 1.1;
    const xCenter = 500 + Math.sin(y * 0.05) * 40;
    const count = Math.floor(1 + Math.random() * 3);
    for (let c = 0; c < count; c++) {
      const rx = 15 + Math.random() * spread * 0.9;
      const ry = 1.2 + Math.random() * 2.2;
      const x = xCenter + (Math.random() - 0.5) * spread * 1.8;
      const opacity = Math.max(0.15, 0.85 - (y - 610) / 700);
      const color = y < 720 ? '#FFD166' : y < 850 ? '#F4A261' : '#E76F51';
      waterRipples.push(`<ellipse cx="${x.toFixed(1)}" cy="${y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`);
    }
  }

  // General ambient ocean ripples
  const oceanRipples = [];
  for (let y = 630; y < 1080; y += 18) {
    for (let x = 60; x < W; x += 140) {
      if (x > 680 && x < 1720 && y > 660 && y < 980) continue; // Behind ship
      const rx = 40 + Math.sin(x + y) * 25;
      const ry = 1.5 + Math.cos(x * 0.01) * 1.0;
      oceanRipples.push(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1B4965" opacity="0.35" />`);
    }
  }

  // Container stack generator
  // Generates rows of colorful containers with corrugated lines, lock rods, and brand styling
  function generateContainerBay(startX, startY, cols, tiers, bayName = '') {
    const boxW = 46;
    const boxH = 34;
    const colors = [
      { name: 'MAERSK', fill: '#002B49', border: '#1B75BC', text: '#E0F2FE' },
      { name: 'EVERGREEN', fill: '#005A36', border: '#008751', text: '#ECFDF5' },
      { name: 'HAPAG', fill: '#D9531E', border: '#F15A24', text: '#FFF7ED' },
      { name: 'CMA CGM', fill: '#002664', border: '#0055A5', text: '#EFF6FF' },
      { name: 'K-LINE', fill: '#991B1B', border: '#DC2626', text: '#FEF2F2' },
      { name: 'ONE', fill: '#9D174D', border: '#DB2777', text: '#FDF2F8' },
      { name: 'MSC', fill: '#B45309', border: '#F59E0B', text: '#FFFBEB' },
      { name: 'COSCO', fill: '#1E3A8A', border: '#3B82F6', text: '#EFF6FF' },
    ];

    let out = `<g class="bay-${bayName}">`;
    for (let c = 0; c < cols; c++) {
      for (let t = 0; t < tiers; t++) {
        // Pseudo-random but deterministic container color
        const colorIdx = (c * 7 + t * 13 + startX) % colors.length;
        const color = colors[colorIdx];
        const bx = startX + c * (boxW + 2);
        const by = startY - t * (boxH + 2);

        // Main container box
        out += `<rect x="${bx}" y="${by}" width="${boxW}" height="${boxH}" rx="1.5" fill="${color.fill}" stroke="${color.border}" stroke-width="1.2" />`;

        // Corrugated vertical ridges
        for (let r = bx + 6; r < bx + boxW - 6; r += 5) {
          out += `<line x1="${r}" y1="${by + 3}" x2="${r}" y2="${by + boxH - 3}" stroke="rgba(0,0,0,0.4)" stroke-width="1" />`;
          out += `<line x1="${r + 1}" y1="${by + 3}" x2="${r + 1}" y2="${by + boxH - 3}" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" />`;
        }

        // Corner castings
        out += `<rect x="${bx + 1}" y="${by + 1}" width="4" height="4" fill="#64748B" />`;
        out += `<rect x="${bx + boxW - 5}" y="${by + 1}" width="4" height="4" fill="#64748B" />`;
        out += `<rect x="${bx + 1}" y="${by + boxH - 5}" width="4" height="4" fill="#64748B" />`;
        out += `<rect x="${bx + boxW - 5}" y="${by + boxH - 5}" width="4" height="4" fill="#64748B" />`;

        // Door vertical locking rods
        out += `<line x1="${bx + 16}" y1="${by + 2}" x2="${bx + 16}" y2="${by + boxH - 2}" stroke="#94A3B8" stroke-width="1.5" />`;
        out += `<line x1="${bx + 30}" y1="${by + 2}" x2="${bx + 30}" y2="${by + boxH - 2}" stroke="#94A3B8" stroke-width="1.5" />`;

        // Sunset highlight on container top
        out += `<line x1="${bx}" y1="${by}" x2="${bx + boxW}" y2="${by}" stroke="#FFD166" stroke-width="1" opacity="0.8" />`;
      }
    }
    out += `</g>`;
    return out;
  }

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Sunset Gradient -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#081426" />
      <stop offset="25%" stop-color="#1E1E3F" />
      <stop offset="50%" stop-color="#4C1D45" />
      <stop offset="68%" stop-color="#8C2D35" />
      <stop offset="82%" stop-color="#D9531E" />
      <stop offset="92%" stop-color="#F77F00" />
      <stop offset="100%" stop-color="#FFD166" />
    </linearGradient>

    <!-- Sun Halo Gradient -->
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="15%" stop-color="#FFF3B0" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#F4A261" stop-opacity="0.6" />
      <stop offset="70%" stop-color="#E76F51" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#E76F51" stop-opacity="0" />
    </radialGradient>

    <!-- Ocean Water Gradient -->
    <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#081A2F" />
      <stop offset="20%" stop-color="#0C253E" />
      <stop offset="50%" stop-color="#0A1D33" />
      <stop offset="80%" stop-color="#061324" />
      <stop offset="100%" stop-color="#020914" />
    </linearGradient>

    <!-- Ship Hull Gradient -->
    <linearGradient id="hullDark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0B131B" />
      <stop offset="40%" stop-color="#16222F" />
      <stop offset="80%" stop-color="#1F2F40" />
      <stop offset="100%" stop-color="#2D4259" />
    </linearGradient>

    <!-- Ship Red Antifouling Bottom -->
    <linearGradient id="hullRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7F1D1D" />
      <stop offset="50%" stop-color="#991B1B" />
      <stop offset="100%" stop-color="#450A0A" />
    </linearGradient>

    <!-- Superstructure White Gradient -->
    <linearGradient id="bridgeWhite" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#CBD5E1" />
      <stop offset="30%" stop-color="#F1F5F9" />
      <stop offset="80%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F8FAFC" />
    </linearGradient>

    <!-- Glass Windows Tint -->
    <linearGradient id="bridgeGlass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="60%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>

    <!-- Soft Cloud Filter -->
    <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" />
    </filter>

    <!-- Soft Mist Filter -->
    <filter id="mistBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>

  <!-- SKY BACKGROUND -->
  <rect width="${W}" height="605" fill="url(#skyGrad)" />

  <!-- DISTANT SUN AND CREPUSCULAR RAYS -->
  <g opacity="0.35">
    <polygon points="490,560 0,0 200,0" fill="#FFEAA7" opacity="0.25" />
    <polygon points="490,560 400,0 750,0" fill="#FFEAA7" opacity="0.2" />
    <polygon points="490,560 900,0 1300,0" fill="#FFEAA7" opacity="0.15" />
  </g>

  <!-- SUN ORB AND CORONA -->
  <circle cx="490" cy="555" r="260" fill="url(#sunGlow)" />
  <circle cx="490" cy="555" r="58" fill="#FFFDF0" />

  <!-- DUSK STRATUS CLOUDS -->
  <g filter="url(#cloudBlur)">
    <!-- High clouds -->
    <path d="M 0,220 Q 350,190 700,230 T 1400,200 T 1920,240 L 1920,280 Q 1450,250 1000,290 T 0,260 Z" fill="#6B21A8" opacity="0.3" />
    <path d="M 100,260 Q 500,230 950,280 T 1800,250 L 1800,310 Q 1100,280 500,330 Z" fill="#9D174D" opacity="0.4" />
    <!-- Golden mid-clouds near horizon -->
    <path d="M 0,420 Q 300,390 650,430 T 1350,400 T 1920,440 L 1920,490 Q 1200,450 700,490 T 0,460 Z" fill="#BE185D" opacity="0.5" />
    <path d="M 50,480 Q 400,450 800,490 T 1600,470 L 1600,530 Q 900,500 300,540 Z" fill="#D97706" opacity="0.6" />
    <path d="M 200,520 Q 550,500 850,530 T 1500,515 L 1500,555 Q 950,535 450,560 Z" fill="#F59E0B" opacity="0.75" />
  </g>

  <!-- DISTANT TANJUNG PRIOK HARBOR SILHOUETTE (PORT HORIZON) -->
  <g fill="#141E28">
    <!-- Breakwater & low land -->
    <rect x="0" y="585" width="410" height="22" />
    <rect x="1580" y="585" width="340" height="22" />

    <!-- Distant container cranes on horizon left -->
    <path d="M 60,585 L 60,530 L 95,530 L 95,585 Z M 70,530 L 130,505 L 155,505 M 78,545 L 88,545" stroke="#1E293B" stroke-width="2" />
    <path d="M 160,585 L 160,525 L 195,525 L 195,585 Z M 170,525 L 230,500 L 255,500" stroke="#1E293B" stroke-width="2" />
    <path d="M 270,585 L 270,535 L 305,535 L 305,585 Z M 280,535 L 340,510 L 365,510" stroke="#1E293B" stroke-width="2" />

    <!-- Tanjung Priok West Lighthouse on breakwater -->
    <rect x="375" y="540" width="16" height="48" fill="#F8FAFC" />
    <polygon points="372,540 383,525 394,540" fill="#DC2626" />
    <circle cx="383" cy="535" r="4" fill="#FEF08A" />
    <!-- Lighthouse beam -->
    <polygon points="383,535 0,550 0,580" fill="#FEF08A" opacity="0.25" />

    <!-- Distant cranes on horizon right -->
    <path d="M 1650,585 L 1650,530 L 1685,530 L 1685,585 Z M 1660,530 L 1720,505 L 1745,505" stroke="#1E293B" stroke-width="2" />
    <path d="M 1760,585 L 1760,520 L 1795,520 L 1795,585 Z M 1770,520 L 1830,495 L 1855,495" stroke="#1E293B" stroke-width="2" />
  </g>

  <!-- SEA / WATER BACKGROUND -->
  <rect x="0" y="598" width="${W}" height="482" fill="url(#seaGrad)" />

  <!-- OCEAN WATER TEXTURE & SUN SPECULAR REFLECTION -->
  <g>${oceanRipples.join('\n')}</g>
  <g>${waterRipples.join('\n')}</g>

  <!-- HARBOR NAVIGATIONAL BUOYS -->
  <!-- Port red buoy (left) -->
  <g transform="translate(260, 715)">
    <polygon points="0,0 -8,-24 8,-24" fill="#DC2626" />
    <rect x="-3" y="-30" width="6" height="6" fill="#EF4444" />
    <circle cx="0" cy="-34" r="3.5" fill="#EF4444" />
    <ellipse cx="0" cy="2" rx="14" ry="4" fill="#000" opacity="0.4" />
    <!-- Flashing red glow -->
    <circle cx="0" cy="-34" r="10" fill="#EF4444" opacity="0.35" />
  </g>

  <!-- Starboard green buoy (right) -->
  <g transform="translate(1760, 680)">
    <polygon points="0,0 -8,-26 8,-26" fill="#16A34A" />
    <circle cx="0" cy="-36" r="3.5" fill="#22C55E" />
    <ellipse cx="0" cy="2" rx="14" ry="4" fill="#000" opacity="0.4" />
    <!-- Flashing green glow -->
    <circle cx="0" cy="-36" r="10" fill="#22C55E" opacity="0.35" />
  </g>

  <!-- ===================================================================== -->
  <!-- CONTAINER SHIP: MV NUSANTARA -->
  <!-- ===================================================================== -->
  <g id="vessel-mv-nusantara">

    <!-- AFT SUPERSTRUCTURE / ACCOMMODATION BLOCK & BRIDGE -->
    <g id="superstructure" transform="translate(1360, 310)">
      <!-- Deckhouse Base Block (Tier 1-4) -->
      <rect x="0" y="160" width="220" height="190" fill="url(#bridgeWhite)" stroke="#94A3B8" stroke-width="1.5" />
      
      <!-- Portholes / Cabin Windows (Rows) -->
      ${Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) =>
          `<rect x="${20 + c * 21}" y="${180 + r * 38}" width="11" height="15" rx="1.5" fill="#0F172A" stroke="#475569" stroke-width="0.8" />`
        ).join('')
      ).join('')}

      <!-- Bridge Deck (Tier 5) -->
      <rect x="-15" y="105" width="250" height="55" fill="url(#bridgeWhite)" stroke="#94A3B8" stroke-width="1.5" />
      
      <!-- Extended Bridge Wings -->
      <polygon points="-55,115 -15,115 -15,145 -45,145" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
      <polygon points="235,115 275,115 265,145 235,145" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
      <!-- Safety Railings on Bridge Wings -->
      <line x1="-55" y1="112" x2="-15" y2="112" stroke="#64748B" stroke-width="1.2" />
      <line x1="235" y1="112" x2="275" y2="112" stroke="#64748B" stroke-width="1.2" />

      <!-- Slanted Navigation Bridge Glass Windows -->
      <polygon points="-5,112 225,112 220,138 0,138" fill="url(#bridgeGlass)" stroke="#0369A1" stroke-width="1.5" />
      <!-- Interior Console Green/Cyan Glow -->
      <line x1="15" y1="128" x2="205" y2="128" stroke="#38BDF8" stroke-width="2.5" opacity="0.8" />

      <!-- Bridge Roof / Monkey Island Deck (Tier 6) -->
      <rect x="5" y="90" width="210" height="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1" />

      <!-- RADAR & COMMUNICATIONS MAST -->
      <g id="radar-mast" stroke="#64748B" stroke-width="2">
        <line x1="110" y1="90" x2="110" y2="10" />
        <line x1="90" y1="90" x2="110" y2="35" />
        <line x1="130" y1="90" x2="110" y2="35" />
        <line x1="75" y1="50" x2="145" y2="50" />
        <line x1="85" y1="30" x2="135" y2="30" />

        <!-- Rotating X-Band Radar Scanner -->
        <rect x="80" y="24" width="60" height="5" rx="1.5" fill="#E2E8F0" stroke="#334155" stroke-width="1" />
        <circle cx="110" cy="26" r="3" fill="#3B82F6" />

        <!-- Rotating S-Band Radar Scanner -->
        <rect x="75" y="44" width="70" height="5" rx="1.5" fill="#E2E8F0" stroke="#334155" stroke-width="1" />

        <!-- SATCOM Domes (White Radomes) -->
        <circle cx="65" cy="82" r="10" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.2" />
        <circle cx="155" cy="82" r="10" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.2" />

        <!-- Masthead White Navigation Light -->
        <circle cx="110" cy="8" r="4" fill="#FFFFFF" />
        <circle cx="110" cy="8" r="12" fill="#FFFFFF" opacity="0.4" />
      </g>

      <!-- EXHAUST FUNNEL (SMOKESTACK) -->
      <g id="funnel" transform="translate(170, 75)">
        <polygon points="0,85 30,0 68,0 52,85" fill="#0A3A6B" stroke="#002147" stroke-width="1.5" />
        <!-- Pelindo Red & White Bands -->
        <polygon points="9,60 21,26 47,26 39,60" fill="#DC2626" />
        <polygon points="15,44 24,18 43,18 36,44" fill="#FFFFFF" />
        <!-- Exhaust Pipe & Heat Haze -->
        <rect x="36" y="-8" width="16" height="10" fill="#1E293B" />
        <ellipse cx="44" cy="-14" rx="12" ry="5" fill="#64748B" opacity="0.25" filter="url(#mistBlur)" />
      </g>

      <!-- ENCLOSED ORANGE FREE-FALL LIFEBOAT (Stern) -->
      <g transform="translate(205, 230)">
        <polygon points="0,15 28,0 38,4 32,24 4,28" fill="#EA580C" stroke="#C2410C" stroke-width="1.5" />
        <line x1="0" y1="20" x2="35" y2="35" stroke="#475569" stroke-width="2" />
      </g>
    </g>

    <!-- DECK CONTAINER BAYS (Cargo stacks on vessel) -->
    <g id="container-stacks">
      <!-- Bay 4 (Aft-Mid, 5 tiers high) -->
      ${generateContainerBay(1170, 620, 4, 5, 'bay-4')}

      <!-- Bay 3 (Midships, 5 tiers high) -->
      ${generateContainerBay(970, 630, 4, 5, 'bay-3')}

      <!-- Bay 2 (Forward-Mid, 4 tiers high) -->
      ${generateContainerBay(820, 650, 3, 4, 'bay-2')}

      <!-- Bay 1 (Forward, 3 tiers high - stepped for bridge visibility) -->
      ${generateContainerBay(740, 675, 1, 3, 'bay-1')}
    </g>

    <!-- MAIN SHIP HULL -->
    <g id="main-hull">
      <!-- Upper Hull Profile (Freeboard & Bow Flare) -->
      <!-- Stern at 1740,650 -> sheer line descending forward to bow at 660,740 -> bulbous stem at 650,880 -->
      <path d="M 660,740 
               L 1740,650 
               L 1740,840 
               L 1300,855 
               L 800,865 
               L 655,870 
               Z" 
            fill="url(#hullDark)" 
            stroke="#334155" 
            stroke-width="2" />

      <!-- Hull Plate Weld Seams & Longitudinal Stiffeners -->
      <path d="M 680,780 L 1740,710" stroke="#0F172A" stroke-width="1.8" />
      <path d="M 670,820 L 1740,770" stroke="#0F172A" stroke-width="1.8" />
      <path d="M 660,850 L 1740,820" stroke="#0F172A" stroke-width="1.8" />

      <!-- Lower Hull (Red Antifouling Bottom below waterline) -->
      <path d="M 655,870 
               Q 635,900 660,935 
               L 720,950 
               L 1250,910 
               L 1740,855 
               L 1740,840 
               L 655,870 Z" 
            fill="url(#hullRed)" 
            stroke="#450A0A" 
            stroke-width="1.5" />

      <!-- Bulbous Bow Contour -->
      <ellipse cx="660" cy="910" rx="35" ry="25" fill="#7F1D1D" stroke="#991B1B" stroke-width="1.5" />

      <!-- White Boot-Topping Waterline Stripe -->
      <path d="M 655,868 L 1740,840" stroke="#F8FAFC" stroke-width="3" />

      <!-- White Draft Markings on Bow Stem (Meters) -->
      <g fill="#F8FAFC" font-family="Arial, sans-serif" font-size="7" font-weight="bold">
        <text x="670" y="810">14M</text>
        <text x="668" y="825">13M</text>
        <text x="666" y="840">12M</text>
        <text x="664" y="855">11M</text>
        <text x="662" y="870">10M</text>
      </g>

      <!-- Anchor Hawse Pipe & Admiralty Stockless Anchor (Port Bow) -->
      <ellipse cx="715" cy="780" rx="14" ry="9" fill="#020617" stroke="#475569" stroke-width="1.5" />
      <!-- Anchor Flukes & Shank hanging in hawse -->
      <polygon points="710,778 720,778 718,795 712,795" fill="#334155" />
      <polygon points="704,792 726,792 722,802 708,802" fill="#1E293B" stroke="#475569" stroke-width="1" />

      <!-- FORECASTLE DECK & BOW DETAILS -->
      <polygon points="660,740 735,715 760,735 675,760" fill="#334155" stroke="#64748B" stroke-width="1" />
      <!-- Forecastle Breakwater Coaming -->
      <polygon points="725,720 755,730 750,742 720,732" fill="#E2E8F0" />
      <!-- Jackstaff & Indonesian National Flag (Merah Putih) -->
      <line x1="662" y1="740" x2="662" y2="695" stroke="#CBD5E1" stroke-width="1.8" />
      <rect x="663" y="698" width="24" height="8" fill="#DC2626" />
      <rect x="663" y="706" width="24" height="8" fill="#FFFFFF" />

      <!-- VESSEL NAME & PORT OF REGISTRY ON BOW -->
      <g transform="translate(745, 778) rotate(3)">
        <text x="0" y="0" font-family="Arial, 'Segoe UI', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="3">MV NUSANTARA</text>
        <text x="3" y="15" font-family="Arial, 'Segoe UI', sans-serif" font-weight="700" font-size="9" fill="#94A3B8" letter-spacing="2">JAKARTA • IMO 9874521</text>
      </g>

      <!-- SUNSET GOLDEN RIM LIGHTING ALONG SHEER LINE -->
      <path d="M 660,740 L 1740,650" stroke="#FFD166" stroke-width="2" opacity="0.9" />
    </g>

    <!-- DYNAMIC BOW WAVE & WATER SPRAY (Hydrodynamic Wake) -->
    <g id="bow-wave">
      <!-- Translucent turquoise aerated water under wave -->
      <path d="M 650,870 
               Q 600,900 520,920 
               Q 450,940 380,980 
               Q 480,950 630,940 
               Q 690,920 730,910 Z" 
            fill="#00B4D8" 
            opacity="0.65" />

      <!-- Main white frothy curling bow crest -->
      <path d="M 655,870 
               C 620,885 570,910 510,935 
               C 440,965 360,990 300,1040 
               C 380,1010 460,980 540,960 
               C 620,940 690,925 760,915 Z" 
            fill="#FFFFFF" 
            opacity="0.9" />

      <!-- Secondary splash crest & spray droplets -->
      <path d="M 620,890 C 560,915 480,950 410,1005 C 470,970 540,945 610,930 Z" fill="#E0F7FA" opacity="0.8" />
      <path d="M 670,895 C 640,930 600,965 520,1015 C 570,985 620,955 670,935 Z" fill="#FFFFFF" opacity="0.7" />

      <!-- Trailing foam wakes along hull -->
      <path d="M 760,915 Q 1000,905 1300,890 Q 1550,875 1740,865" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="14 6" opacity="0.75" />
      <path d="M 780,925 Q 1050,915 1350,900 Q 1600,885 1740,875" stroke="#38BDF8" stroke-width="8" stroke-dasharray="20 8" opacity="0.5" />
    </g>
  </g>

  <!-- FOREGROUND VIGNETTE & SUBTLE POLISH OVERLAY -->
  <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#000" stop-opacity="0.1" />
    <stop offset="70%" stop-color="#000" stop-opacity="0" />
    <stop offset="100%" stop-color="#000" stop-opacity="0.5" />
  </linearGradient>
  <rect width="${W}" height="${H}" fill="url(#vignette)" pointer-events="none" />
</svg>
`;
}

// ============================================================================
// 2. OFFICER GUNAWAN (800x800)
// ============================================================================
function generateOfficerGunawanSvg() {
  const W = 800;
  const H = 800;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Command Center Gradient -->
    <radialGradient id="vtsBg" cx="0.45" cy="0.4" r="0.65">
      <stop offset="0%" stop-color="#112239" />
      <stop offset="45%" stop-color="#0B1728" />
      <stop offset="85%" stop-color="#050C17" />
      <stop offset="100%" stop-color="#02060D" />
    </radialGradient>

    <!-- Radar Glow Gradients -->
    <radialGradient id="radarGreenGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#059669" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0" />
    </radialGradient>

    <!-- Skin Tone Gradients -->
    <linearGradient id="skinBase" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A86134" />
      <stop offset="25%" stop-color="#C57D4C" />
      <stop offset="65%" stop-color="#E09F6E" />
      <stop offset="90%" stop-color="#F2B98E" />
      <stop offset="100%" stop-color="#D98A55" />
    </linearGradient>

    <linearGradient id="skinShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C57D4C" />
      <stop offset="100%" stop-color="#7C3B18" />
    </linearGradient>

    <!-- Officer Cap Peak Patent Leather -->
    <linearGradient id="capVisor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="40%" stop-color="#1E293B" />
      <stop offset="70%" stop-color="#334155" />
      <stop offset="85%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Gold Bullion Gradient -->
    <linearGradient id="goldBullion" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFF9D2" />
      <stop offset="25%" stop-color="#FCE38A" />
      <stop offset="55%" stop-color="#F1C40F" />
      <stop offset="85%" stop-color="#B7791F" />
      <stop offset="100%" stop-color="#744210" />
    </linearGradient>

    <!-- Officer Tunic White Fabric -->
    <linearGradient id="tunicWhite" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#CBD5E1" />
      <stop offset="20%" stop-color="#E2E8F0" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="85%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>

    <!-- Soft Depth Blur -->
    <filter id="bgConsoleBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" />
    </filter>

    <filter id="bokehGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>

  <!-- BACKGROUND: VTS MARITIME CONTROL CENTER -->
  <rect width="${W}" height="${H}" fill="url(#vtsBg)" />

  <!-- RADAR PPI DISPLAY (LEFT BACKGROUND) -->
  <g id="radar-screen" transform="translate(140, 220)" filter="url(#bgConsoleBlur)">
    <!-- Radar outer bezel -->
    <circle cx="0" cy="0" r="130" fill="#04121E" stroke="#1E3A5F" stroke-width="4" />
    <circle cx="0" cy="0" r="126" fill="url(#radarGreenGlow)" />
    
    <!-- Range Rings (3nm, 6nm, 9nm, 12nm) -->
    <circle cx="0" cy="0" r="30" fill="none" stroke="#10B981" stroke-width="0.8" opacity="0.4" />
    <circle cx="0" cy="0" r="60" fill="none" stroke="#10B981" stroke-width="0.8" opacity="0.4" />
    <circle cx="0" cy="0" r="90" fill="none" stroke="#10B981" stroke-width="0.8" opacity="0.4" />
    <circle cx="0" cy="0" r="120" fill="none" stroke="#10B981" stroke-width="1.2" opacity="0.6" />

    <!-- Crosshairs & Bearing Lines -->
    <line x1="-125" y1="0" x2="125" y2="0" stroke="#10B981" stroke-width="0.8" opacity="0.4" />
    <line x1="0" y1="-125" x2="0" y2="125" stroke="#10B981" stroke-width="0.8" opacity="0.4" />

    <!-- Tanjung Priok Coastline Vector on Radar -->
    <path d="M -80,-90 Q -40,-60 10,-80 T 80,-40 T 110,20 L 120,80" fill="none" stroke="#34D399" stroke-width="2.5" opacity="0.8" />
    <!-- Harbor Breakwater Pier -->
    <line x1="10" y1="-80" x2="-20" y2="-40" stroke="#34D399" stroke-width="3" opacity="0.85" />

    <!-- AIS Vessel Targets & Heading Vectors -->
    <circle cx="25" cy="-20" r="3.5" fill="#FBBF24" />
    <line x1="25" y1="-20" x2="40" y2="-35" stroke="#FBBF24" stroke-width="1.5" />
    <text x="45" y="-35" font-family="monospace" font-size="8" fill="#FBBF24">MV NUSANTARA [12.4K]</text>

    <circle cx="-45" cy="40" r="3" fill="#38BDF8" />
    <line x1="-45" y1="40" x2="-30" y2="50" stroke="#38BDF8" stroke-width="1.2" />
    <text x="-25" y="55" font-family="monospace" font-size="7" fill="#38BDF8">TB BIMA 02</text>

    <!-- Radar Sweep Beam (Wedge) -->
    <path d="M 0,0 L 95,-85 A 126,126 0 0,1 126,0 Z" fill="#10B981" opacity="0.18" />
  </g>

  <!-- ECDIS / NAUTICAL CHART MONITOR (RIGHT BACKGROUND) -->
  <g id="ecdis-screen" transform="translate(640, 240)" filter="url(#bgConsoleBlur)">
    <!-- Monitor frame -->
    <rect x="-110" y="-100" width="180" height="150" rx="6" fill="#0A192F" stroke="#334155" stroke-width="3" />
    
    <!-- Nautical Depth Contours (Blue bathymetry) -->
    <path d="M -110,-40 Q -50,-20 0,-60 T 70,-40" fill="none" stroke="#0284C7" stroke-width="2" opacity="0.6" />
    <path d="M -110,10 Q -40,30 20,-10 T 70,20" fill="none" stroke="#0369A1" stroke-width="2" opacity="0.6" />
    <path d="M -110,60 Q -30,80 30,50 T 70,70" fill="none" stroke="#0C4A6E" stroke-width="2" opacity="0.6" />

    <!-- Traffic Separation Scheme (TSS) Fairway Channel (Magenta Lines) -->
    <line x1="-110" y1="-20" x2="70" y2="10" stroke="#D946EF" stroke-width="1.8" stroke-dasharray="6 4" opacity="0.7" />
    <line x1="-110" y1="0" x2="70" y2="30" stroke="#D946EF" stroke-width="1.8" stroke-dasharray="6 4" opacity="0.7" />
    <!-- Nav Buoy Symbols -->
    <circle cx="-20" cy="-5" r="3" fill="#EF4444" />
    <circle cx="20" cy="20" r="3" fill="#22C55E" />
  </g>

  <!-- BOKEH HARBOR LIGHTS IN DISTANCE (Through observation glass) -->
  <g filter="url(#bokehGlow)">
    <circle cx="220" cy="80" r="14" fill="#F59E0B" opacity="0.35" />
    <circle cx="280" cy="65" r="9" fill="#38BDF8" opacity="0.3" />
    <circle cx="520" cy="75" r="16" fill="#10B981" opacity="0.3" />
    <circle cx="590" cy="90" r="12" fill="#EF4444" opacity="0.35" />
    <circle cx="650" cy="70" r="18" fill="#FBBF24" opacity="0.4" />
  </g>

  <!-- ===================================================================== -->
  <!-- FOREGROUND PORTRAIT: CAPT. H. GUNAWAN -->
  <!-- ===================================================================== -->
  <g id="officer-gunawan">

    <!-- OFFICER UNIFORM BODY / SHOULDERS -->
    <g id="uniform-tunic">
      <!-- Torso & Shoulders Base -->
      <path d="M 170,800 
               L 185,550 
               L 255,490 
               L 330,470 
               L 400,530 
               L 470,470 
               L 545,490 
               L 615,550 
               L 630,800 Z" 
            fill="url(#tunicWhite)" 
            stroke="#94A3B8" 
            stroke-width="1.5" />

      <!-- Chest Center Placket & Seams -->
      <line x1="400" y1="530" x2="400" y2="800" stroke="#CBD5E1" stroke-width="2.5" />

      <!-- Polished Gold Maritime Anchor Buttons -->
      ${[565, 625, 685, 745].map((y) => `
        <g transform="translate(400, ${y})">
          <circle cx="0" cy="0" r="7.5" fill="url(#goldBullion)" stroke="#744210" stroke-width="1" />
          <!-- Anchor motif on button -->
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#451A03" stroke-width="1.2" />
          <path d="M -3,2 Q 0,4.5 3,2" fill="none" stroke="#451A03" stroke-width="1.2" />
        </g>
      `).join('')}

      <!-- Tunic Collar (Stand-and-fall structured collar) -->
      <polygon points="320,470 400,530 380,480" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
      <polygon points="480,470 400,530 420,480" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />

      <!-- Left Chest: Master Mariner Pilot Wings & Ribbons -->
      <!-- Pilot Wings (Golden Eagle/Anchor Wings) -->
      <g transform="translate(490, 560)">
        <polygon points="0,0 -30,-6 -15,5 0,2 15,5 30,-6" fill="url(#goldBullion)" stroke="#744210" stroke-width="0.8" />
        <circle cx="0" cy="0" r="4.5" fill="#0A3A6B" />
        <circle cx="0" cy="0" r="2.5" fill="#D97706" />
      </g>

      <!-- 4-Tier Ribbon Bar (12 Ribbons total) -->
      <g id="ribbon-bar" transform="translate(455, 580)">
        <!-- Row 1 -->
        <rect x="0" y="0" width="22" height="9" fill="#DC2626" stroke="#1E293B" stroke-width="0.5" />
        <rect x="23" y="0" width="22" height="9" fill="#2563EB" stroke="#1E293B" stroke-width="0.5" />
        <rect x="46" y="0" width="22" height="9" fill="#F59E0B" stroke="#1E293B" stroke-width="0.5" />
        <!-- Row 2 -->
        <rect x="0" y="10" width="22" height="9" fill="#16A34A" stroke="#1E293B" stroke-width="0.5" />
        <rect x="23" y="10" width="22" height="9" fill="#9333EA" stroke="#1E293B" stroke-width="0.5" />
        <rect x="46" y="10" width="22" height="9" fill="#0284C7" stroke="#1E293B" stroke-width="0.5" />
        <!-- Row 3 -->
        <rect x="0" y="20" width="22" height="9" fill="#EA580C" stroke="#1E293B" stroke-width="0.5" />
        <rect x="23" y="20" width="22" height="9" fill="#475569" stroke="#1E293B" stroke-width="0.5" />
        <rect x="46" y="20" width="22" height="9" fill="#E11D48" stroke="#1E293B" stroke-width="0.5" />
        <!-- Row 4 -->
        <rect x="0" y="30" width="22" height="9" fill="#0D9488" stroke="#1E293B" stroke-width="0.5" />
        <rect x="23" y="30" width="22" height="9" fill="#CA8A04" stroke="#1E293B" stroke-width="0.5" />
        <rect x="46" y="30" width="22" height="9" fill="#1E3A8A" stroke="#1E293B" stroke-width="0.5" />
      </g>

      <!-- Right Chest: Engraved Gold Name Plate -->
      <g id="name-plate" transform="translate(260, 580)">
        <rect x="0" y="0" width="105" height="28" rx="2" fill="url(#goldBullion)" stroke="#744210" stroke-width="1.2" />
        <text x="52" y="12" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="7.5" fill="#0F172A" text-anchor="middle">CAPT. H. GUNAWAN, M.Mar</text>
        <text x="52" y="22" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="5.5" fill="#1E3A8A" text-anchor="middle">PELINDO • SENIOR VTS INSTRUCTOR</text>
      </g>

      <!-- GOLD SHOULDER EPAULETTES (CAPTAIN RANK - 4 STRIPES + CURL) -->
      <!-- Left Shoulder Epaulette -->
      <g transform="translate(200, 485) rotate(15)">
        <rect x="0" y="0" width="80" height="34" rx="4" fill="#020617" stroke="#334155" stroke-width="1" />
        <!-- 4 Gold Bullion Stripes -->
        <rect x="14" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <rect x="24" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <rect x="34" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <rect x="44" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <!-- Executive Diamond / Star -->
        <polygon points="62,17 67,10 72,17 67,24" fill="url(#goldBullion)" />
        <!-- Epaulette button -->
        <circle cx="6" cy="17" r="4" fill="url(#goldBullion)" />
      </g>

      <!-- Right Shoulder Epaulette -->
      <g transform="translate(520, 505) rotate(-15)">
        <rect x="0" y="0" width="80" height="34" rx="4" fill="#020617" stroke="#334155" stroke-width="1" />
        <!-- 4 Gold Bullion Stripes -->
        <rect x="14" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <rect x="24" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <rect x="34" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <rect x="44" y="2" width="6" height="30" fill="url(#goldBullion)" />
        <!-- Executive Diamond / Star -->
        <polygon points="62,17 67,10 72,17 67,24" fill="url(#goldBullion)" />
        <!-- Epaulette button -->
        <circle cx="6" cy="17" r="4" fill="url(#goldBullion)" />
      </g>
    </g>

    <!-- NECK & HEAD -->
    <g id="head-and-face">
      <!-- Neck -->
      <path d="M 355,420 L 355,500 Q 400,520 445,500 L 445,420 Z" fill="url(#skinShadow)" />
      <path d="M 365,420 L 365,485 Q 400,505 435,485 L 435,420 Z" fill="url(#skinBase)" />

      <!-- Head / Face Oval Structure -->
      <path d="M 330,300 
               C 330,220 470,220 470,300 
               C 470,360 450,440 400,450 
               C 350,440 330,360 330,300 Z" 
            fill="url(#skinBase)" />

      <!-- Ears -->
      <ellipse cx="328" cy="325" rx="10" ry="22" fill="#B96D3D" />
      <ellipse cx="472" cy="325" rx="10" ry="22" fill="#C57D4C" />

      <!-- Facial Features -->
      <!-- Eyes & Eyelids -->
      <!-- Left Eye -->
      <ellipse cx="365" cy="305" rx="13" ry="8" fill="#FFFFFF" />
      <circle cx="366" cy="305" r="6" fill="#3D2314" />
      <circle cx="366" cy="305" r="3" fill="#0A0604" />
      <circle cx="368" cy="303" r="1.5" fill="#FFFFFF" />
      <path d="M 350,302 Q 365,295 380,302" stroke="#451A03" stroke-width="2" fill="none" />
      <path d="M 350,290 Q 365,284 380,288" stroke="#331A0C" stroke-width="3" fill="none" /> <!-- Eyebrow -->

      <!-- Right Eye -->
      <ellipse cx="435" cy="305" rx="13" ry="8" fill="#FFFFFF" />
      <circle cx="434" cy="305" r="6" fill="#3D2314" />
      <circle cx="434" cy="305" r="3" fill="#0A0604" />
      <circle cx="436" cy="303" r="1.5" fill="#FFFFFF" />
      <path d="M 420,302 Q 435,295 450,302" stroke="#451A03" stroke-width="2" fill="none" />
      <path d="M 420,288 Q 435,284 450,290" stroke="#331A0C" stroke-width="3" fill="none" /> <!-- Eyebrow -->

      <!-- Nose -->
      <path d="M 400,295 L 396,345 Q 400,352 404,345 Z" fill="#B96D3D" opacity="0.6" />
      <path d="M 390,345 Q 400,355 410,345" stroke="#7C3B18" stroke-width="1.8" fill="none" />
      <ellipse cx="392" cy="347" rx="3.5" ry="2" fill="#52230A" />
      <ellipse cx="408" cy="347" rx="3.5" ry="2" fill="#52230A" />

      <!-- Indonesian Mustache (Neatly trimmed, salt-and-pepper) -->
      <path d="M 370,366 
               Q 400,358 430,366 
               Q 415,378 400,373 
               Q 385,378 370,366 Z" 
            fill="#1E1E1E" 
            stroke="#475569" 
            stroke-width="0.8" />
      <!-- Mustache subtle grey strands -->
      <line x1="380" y1="368" x2="395" y2="371" stroke="#94A3B8" stroke-width="0.8" />
      <line x1="405" y1="371" x2="420" y2="368" stroke="#94A3B8" stroke-width="0.8" />

      <!-- Lips -->
      <path d="M 382,385 Q 400,392 418,385" stroke="#8C4420" stroke-width="2" fill="none" />
      <path d="M 388,393 Q 400,398 412,393" stroke="#A8522A" stroke-width="1.5" fill="none" />

      <!-- Subtle smile lines & facial contouring -->
      <path d="M 358,325 Q 365,355 375,375" stroke="#A86134" stroke-width="1" fill="none" opacity="0.5" />
      <path d="M 442,325 Q 435,355 425,375" stroke="#A86134" stroke-width="1" fill="none" opacity="0.5" />
    </g>

    <!-- SENIOR OFFICER PEAK CAP -->
    <g id="officer-cap">
      <!-- White Crown (Cap Top) -->
      <path d="M 300,230 
               C 290,120 510,120 500,230 
               Q 400,240 300,230 Z" 
            fill="url(#tunicWhite)" 
            stroke="#CBD5E1" 
            stroke-width="1.5" />

      <!-- Cap Band (Black Cloth) -->
      <path d="M 305,225 
               Q 400,238 495,225 
               L 495,255 
               Q 400,268 305,255 Z" 
            fill="#0F172A" 
            stroke="#020617" 
            stroke-width="1" />

      <!-- Gold Chin Strap (Braided Bullion) -->
      <path d="M 310,250 Q 400,265 490,250" stroke="url(#goldBullion)" stroke-width="5" fill="none" />
      <!-- Strap Side Buttons -->
      <circle cx="312" cy="250" r="4.5" fill="url(#goldBullion)" />
      <circle cx="488" cy="250" r="4.5" fill="url(#goldBullion)" />

      <!-- Black Patent Leather Visor / Peak -->
      <path d="M 305,252 
               Q 400,285 495,252 
               C 490,295 310,295 305,252 Z" 
            fill="url(#capVisor)" 
            stroke="#020617" 
            stroke-width="1.5" />

      <!-- Gold Bullion Oak Leaves ("Scrambled Eggs") on Visor (Senior Master Mariner) -->
      <g stroke="url(#goldBullion)" stroke-width="1.8" fill="url(#goldBullion)">
        <!-- Left Visor Leaves -->
        <path d="M 330,268 Q 345,274 360,268 Q 345,263 330,268 Z" />
        <path d="M 355,271 Q 370,277 385,272 Q 370,266 355,271 Z" />
        <line x1="330" y1="268" x2="385" y2="272" stroke-width="1" />

        <!-- Right Visor Leaves -->
        <path d="M 470,268 Q 455,274 440,268 Q 455,263 470,268 Z" />
        <path d="M 445,271 Q 430,277 415,272 Q 430,266 445,271 Z" />
        <line x1="470" y1="268" x2="415" y2="272" stroke-width="1" />
      </g>

      <!-- Embroidered Gold Cap Badge (Center of Cap Band) -->
      <g id="cap-badge" transform="translate(400, 205)">
        <!-- Laurel Wreath in Gold -->
        <path d="M -26,10 C -35,-5 -25,-25 0,-30 C 25,-25 35,-5 26,10" fill="none" stroke="url(#goldBullion)" stroke-width="3" />
        
        <!-- Center Silver / Gold Foul Anchor -->
        <line x1="0" y1="-26" x2="0" y2="12" stroke="#E2E8F0" stroke-width="3" />
        <path d="M -12,2 Q 0,16 12,2" fill="none" stroke="#E2E8F0" stroke-width="3" />
        <polygon points="-16,-1 -11,4 -8,-1" fill="#E2E8F0" />
        <polygon points="16,-1 11,4 8,-1" fill="#E2E8F0" />
        <!-- Anchor Stock -->
        <line x1="-12" y1="-18" x2="12" y2="-18" stroke="url(#goldBullion)" stroke-width="2.5" />
        <!-- Entwined Cable Rope in Gold -->
        <path d="M -7,-20 Q 5,-12 -4,0 Q 6,8 0,14" fill="none" stroke="url(#goldBullion)" stroke-width="1.5" />

        <!-- Indonesian Maritime Star of Excellence at Top of Badge -->
        ${renderStar(0, -32, 6, 2.5, '#FFF9D2', '#D4AF37')}
      </g>
    </g>

    <!-- RIM LIGHTING (Cool Cyan on left, Warm Gold on right) -->
    <!-- Left cool rim -->
    <path d="M 185,550 L 170,800" stroke="#38BDF8" stroke-width="3" opacity="0.6" filter="url(#bgConsoleBlur)" />
    <!-- Right warm gold rim -->
    <path d="M 615,550 L 630,800" stroke="#F59E0B" stroke-width="3" opacity="0.6" filter="url(#bgConsoleBlur)" />
  </g>

  <!-- VIGNETTE BORDER -->
  <rect width="${W}" height="${H}" fill="none" stroke="#0B132B" stroke-width="12" />
</svg>
`;
}

// ============================================================================
// 3. TERMINAL PANORAMA (1920x600)
// ============================================================================
function generateTerminalPanoramaSvg() {
  const W = 1920;
  const H = 600;

  // Generate STS (Ship-to-Shore) Cranes
  function renderStsCrane(x, height = 340, boomLifted = false) {
    const boomY = 220;
    const apexY = 110;
    const cabY = boomY + 8;
    const boomEndX = x - 220; // Reaches over water

    return `
    <g class="sts-crane" transform="translate(${x}, 0)">
      <!-- Main Portal Legs (Blue with diagonal bracing) -->
      <polygon points="-45,430 -35,260 -25,260 -30,430" fill="#0F3B6C" stroke="#1E293B" stroke-width="1" />
      <polygon points="45,430 35,260 25,260 30,430" fill="#0F3B6C" stroke="#1E293B" stroke-width="1" />
      <!-- Diagonal bracing -->
      <line x1="-40" y1="400" x2="30" y2="280" stroke="#1E40AF" stroke-width="2.5" />
      <line x1="40" y1="400" x2="-30" y2="280" stroke="#1E40AF" stroke-width="2.5" />
      <line x1="-35" y1="340" x2="35" y2="340" stroke="#1E40AF" stroke-width="3" />

      <!-- Portal Leg Base - Yellow/Black Hazard Stripes -->
      <rect x="-48" y="420" width="18" height="12" fill="#FACC15" />
      <line x1="-48" y1="432" x2="-36" y2="420" stroke="#000" stroke-width="2" />
      <rect x="30" y="420" width="18" height="12" fill="#FACC15" />
      <line x1="30" y1="432" x2="42" y2="420" stroke="#000" stroke-width="2" />

      <!-- Machinery House / Apex Tower (Pelindo Blue & Safety Orange) -->
      <polygon points="-30,260 0,${apexY} 30,260" fill="#0F3B6C" stroke="#1E293B" stroke-width="1.5" />
      <rect x="-22" y="${apexY + 20}" width="44" height="28" fill="#F15A24" rx="2" />
      <text x="0" y="${apexY + 38}" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="#FFF" text-anchor="middle">PELINDO</text>

      <!-- Red Aircraft Obstruction Beacon at Apex -->
      <circle cx="0" cy="${apexY - 2}" r="3" fill="#EF4444" />
      <circle cx="0" cy="${apexY - 2}" r="8" fill="#EF4444" opacity="0.4" />

      <!-- Crane Boom Trusses (Extended over ship berth) -->
      ${boomLifted ?
        `<line x1="0" y1="240" x2="${boomEndX}" y2="120" stroke="#F15A24" stroke-width="5" />
         <line x1="0" y1="240" x2="${boomEndX}" y2="120" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="8 8" />` :
        `<polygon points="-35,${boomY} ${boomEndX},${boomY} ${boomEndX},${boomY + 12} -35,${boomY + 14}" fill="#F15A24" stroke="#C2410C" stroke-width="1" />
         <!-- Boom Lattice Lines -->
         <line x1="0" y1="${apexY + 30}" x2="${boomEndX + 40}" y2="${boomY}" stroke="#94A3B8" stroke-width="2" />
         <line x1="0" y1="${apexY + 30}" x2="${boomEndX + 120}" y2="${boomY}" stroke="#94A3B8" stroke-width="2" />
         <!-- Trolley & Spreader Bar -->
         <rect x="${boomEndX + 70}" y="${boomY + 12}" width="22" height="10" fill="#0F172A" />
         <line x1="${boomEndX + 75}" y1="${boomY + 22}" x2="${boomEndX + 75}" y2="${boomY + 80}" stroke="#E2E8F0" stroke-width="1" />
         <line x1="${boomEndX + 87}" y1="${boomY + 22}" x2="${boomEndX + 87}" y2="${boomY + 80}" stroke="#E2E8F0" stroke-width="1" />
         <!-- Hoisted 40ft Container -->
         <rect x="${boomEndX + 65}" y="${boomY + 80}" width="32" height="18" fill="#1B75BC" rx="1" />
         <!-- Operator Cab with Interior Yellow Light -->
         <rect x="${boomEndX + 95}" y="${cabY}" width="14" height="12" fill="#FEF08A" opacity="0.85" rx="1" />
        `
      }
    </g>
    `;
  }

  // Water reflections of floodlights
  const floodlightGlints = [];
  for (let x = 120; x < W; x += 180) {
    for (let y = 460; y < H; y += 12) {
      const rx = 8 + Math.random() * 20;
      const ry = 1.2 + Math.random() * 1.8;
      const xOff = x + (Math.random() - 0.5) * 45;
      const op = Math.max(0.1, 0.7 - (y - 450) / 250);
      floodlightGlints.push(`<ellipse cx="${xOff.toFixed(1)}" cy="${y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#FEF3C7" opacity="${op.toFixed(2)}" />`);
    }
  }

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dusk Sky Gradient -->
    <linearGradient id="twilightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050B14" />
      <stop offset="35%" stop-color="#0F1F38" />
      <stop offset="70%" stop-color="#1E3A63" />
      <stop offset="88%" stop-color="#7C2D12" />
      <stop offset="96%" stop-color="#C2410C" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <!-- Floodlight Volumetric Beam Gradient -->
    <linearGradient id="floodBeam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FEF9C3" stop-opacity="0.85" />
      <stop offset="25%" stop-color="#FEF08A" stop-opacity="0.45" />
      <stop offset="70%" stop-color="#BAE6FD" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#BAE6FD" stop-opacity="0" />
    </linearGradient>

    <!-- Basin Deep Water Gradient -->
    <linearGradient id="basinWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A1D33" />
      <stop offset="30%" stop-color="#071526" />
      <stop offset="70%" stop-color="#030A14" />
      <stop offset="100%" stop-color="#010408" />
    </linearGradient>

    <!-- Floodlight Glow Filter -->
    <filter id="lightGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>

  <!-- SKY: DUSK HORIZON -->
  <rect width="${W}" height="440" fill="url(#twilightSky)" />

  <!-- DISTANT HORIZON HARBOR SILHOUETTE & WAREHOUSES -->
  <polygon points="0,410 400,410 420,390 480,390 500,410 900,410 930,380 990,380 1020,410 1920,410 1920,440 0,440" fill="#0A1422" />

  <!-- CONTAINER YARD STACKS (Massive multi-tier storage yard) -->
  <g id="yard-container-stacks">
    <!-- Background rows of containers (smaller perspective) -->
    ${Array.from({ length: 42 }).map((_, i) => {
      const x = 80 + i * 44;
      const height = 18 + (i % 4) * 14;
      const colors = ['#1E3A8A', '#065F46', '#991B1B', '#B45309', '#1F2937', '#0284C7', '#D97706'];
      const c = colors[i % colors.length];
      return `<rect x="${x}" y="${415 - height}" width="38" height="${height}" fill="${c}" stroke="#0F172A" stroke-width="0.8" />`;
    }).join('\n')}

    <!-- Midground rows of containers (taller, 3-5 tiers) -->
    ${Array.from({ length: 32 }).map((_, i) => {
      const x = 120 + i * 56;
      const height = 30 + (i % 5) * 16;
      const colors = ['#002444', '#006837', '#F15A24', '#B71C1C', '#FFB300', '#0A3A6B', '#374151'];
      const c = colors[(i * 3) % colors.length];
      return `
        <rect x="${x}" y="${425 - height}" width="50" height="${height}" fill="${c}" stroke="#0F172A" stroke-width="1" />
        <line x1="${x}" y1="${425 - height}" x2="${x + 50}" y2="${425 - height}" stroke="#FEF08A" stroke-width="0.8" opacity="0.6" />
      `;
    }).join('\n')}

    <!-- Rubber-Tyred Gantry (RTG) Cranes in Yard -->
    ${[400, 850, 1350].map((rx) => `
      <g transform="translate(${rx}, 320)">
        <!-- RTG portal frame -->
        <rect x="0" y="0" width="70" height="10" fill="#FACC15" />
        <line x1="5" y1="10" x2="5" y2="105" stroke="#FACC15" stroke-width="4" />
        <line x1="65" y1="10" x2="65" y2="105" stroke="#FACC15" stroke-width="4" />
        <!-- Rubber tyres -->
        <ellipse cx="5" cy="107" rx="6" ry="4" fill="#000" />
        <ellipse cx="65" cy="107" rx="6" ry="4" fill="#000" />
        <!-- Amber flashing beacon -->
        <circle cx="35" cy="-2" r="3" fill="#F59E0B" />
      </g>
    `).join('')}

    <!-- Terminal Internal Tractors (ITVs / Yard Trucks with Headlights) -->
    ${[320, 720, 1150, 1600].map((tx) => `
      <g transform="translate(${tx}, 418)">
        <rect x="0" y="0" width="32" height="12" rx="2" fill="#E2E8F0" />
        <rect x="4" y="2" width="8" height="6" fill="#0284C7" />
        <!-- Headlights -->
        <circle cx="30" cy="8" r="2.5" fill="#FEF08A" />
        <polygon points="32,8 90,2 90,16" fill="url(#floodBeam)" opacity="0.4" />
      </g>
    `).join('')}
  </g>

  <!-- OVERHEAD SIGNAGE GANTRY (TERMINAL PETIKEMAS TANJUNG PRIOK) -->
  <g transform="translate(760, 360)">
    <rect x="0" y="0" width="380" height="26" rx="3" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5" />
    <text x="190" y="14" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="10" fill="#F8FAFC" text-anchor="middle" letter-spacing="2">PELINDO • TERMINAL PETIKEMAS TANJUNG PRIOK</text>
    <text x="190" y="22" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="6.5" fill="#38BDF8" text-anchor="middle" letter-spacing="1.5">BERTH 01 - 04 • JAKARTA INTERNATIONAL CONTAINER TERMINAL</text>
  </g>

  <!-- LINE OF SHIP-TO-SHORE (STS) GANTRY CRANES ALONG QUAY -->
  <g id="sts-cranes">
    ${renderStsCrane(340, 340, false)}
    ${renderStsCrane(620, 340, false)}
    ${renderStsCrane(900, 340, false)}
    ${renderStsCrane(1220, 340, true)} <!-- Boom up for ship maneuvering -->
    ${renderStsCrane(1540, 340, false)}
  </g>

  <!-- HIGH-MAST FLOODLIGHT TOWERS & CONICAL LIGHT BEAMS -->
  <g id="floodlight-towers">
    ${[200, 480, 780, 1080, 1380, 1700].map((fx) => `
      <!-- 30m Steel Lattice Tower -->
      <line x1="${fx}" y1="120" x2="${fx}" y2="430" stroke="#94A3B8" stroke-width="3" />
      <!-- Crossbars -->
      <line x1="${fx - 14}" y1="120" x2="${fx + 14}" y2="120" stroke="#CBD5E1" stroke-width="3" />
      <line x1="${fx - 18}" y1="130" x2="${fx + 18}" y2="130" stroke="#CBD5E1" stroke-width="3" />
      
      <!-- Volumetric Light Cones Shining Down -->
      <polygon points="${fx},125 ${fx - 140},440 ${fx + 140},440" fill="url(#floodBeam)" />
      
      <!-- Lamp Bank Intense Glowing Source -->
      <circle cx="${fx}" cy="122" r="6" fill="#FFFFFF" filter="url(#lightGlow)" />
      <circle cx="${fx}" cy="122" r="3" fill="#FEF08A" />
    `).join('')}
  </g>

  <!-- WHARF APRON (Concrete Quay Wall Deck) -->
  <g id="wharf-quay">
    <!-- Concrete wharf surface -->
    <rect x="0" y="430" width="${W}" height="22" fill="#334155" stroke="#1E293B" stroke-width="1" />
    
    <!-- Crane Rail Tracks embedded in concrete -->
    <line x1="0" y1="434" x2="${W}" y2="434" stroke="#64748B" stroke-width="2" />
    <line x1="0" y1="442" x2="${W}" y2="442" stroke="#64748B" stroke-width="2" />

    <!-- Yellow-and-Black Hazard Striped Curb along water edge -->
    <rect x="0" y="448" width="${W}" height="6" fill="#FACC15" />
    ${Array.from({ length: 96 }).map((_, i) =>
      `<line x1="${i * 20}" y1="454" x2="${i * 20 + 10}" y2="448" stroke="#000" stroke-width="2.5" />`
    ).join('')}

    <!-- Heavy Cast-Iron Mooring Bollards along edge -->
    ${[120, 360, 600, 840, 1080, 1320, 1560, 1800].map((bx) => `
      <g transform="translate(${bx}, 445)">
        <rect x="-4" y="-8" width="8" height="10" rx="1.5" fill="#0F172A" />
        <ellipse cx="0" cy="-8" rx="7" ry="2.5" fill="#1E293B" />
      </g>
    `).join('')}
  </g>

  <!-- BASIN WATER (Foreground Harbor Basin) -->
  <rect x="0" y="454" width="${W}" height="146" fill="url(#basinWater)" />

  <!-- WATER SPECULAR LIGHT REFLECTIONS -->
  <g>${floodlightGlints.join('\n')}</g>

  <!-- CRANE REFLECTIONS ON WATER SURFACE -->
  <g opacity="0.35">
    <line x1="340" y1="454" x2="340" y2="580" stroke="#F15A24" stroke-width="12" stroke-dasharray="6 8" />
    <line x1="620" y1="454" x2="620" y2="580" stroke="#0F3B6C" stroke-width="12" stroke-dasharray="6 8" />
    <line x1="900" y1="454" x2="900" y2="580" stroke="#F15A24" stroke-width="12" stroke-dasharray="6 8" />
    <line x1="1540" y1="454" x2="1540" y2="580" stroke="#F15A24" stroke-width="12" stroke-dasharray="6 8" />
  </g>

  <!-- SUBTLE VIGNETTE AT EDGES -->
  <linearGradient id="panoVignette" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#000" stop-opacity="0.4" />
    <stop offset="10%" stop-color="#000" stop-opacity="0" />
    <stop offset="90%" stop-color="#000" stop-opacity="0" />
    <stop offset="100%" stop-color="#000" stop-opacity="0.4" />
  </linearGradient>
  <rect width="${W}" height="${H}" fill="url(#panoVignette)" pointer-events="none" />
</svg>
`;
}

// ============================================================================
// 4. SEAL OF COMPETENCY (600x600)
// ============================================================================
function generateSealCompetencySvg() {
  const W = 600;
  const H = 600;
  const cx = 300;
  const cy = 300;

  // Nautical Rope Border (generates 64 interlocking rope segments around circle)
  const ropeCount = 64;
  const ropeRadius = 254;
  const ropeSegments = [];
  for (let i = 0; i < ropeCount; i++) {
    const angleDeg = (i * 360) / ropeCount;
    const angleRad = (angleDeg * Math.PI) / 180;
    const rx = cx + ropeRadius * Math.cos(angleRad);
    const ry = cy + ropeRadius * Math.sin(angleRad);
    const rot = angleDeg + 35; // Slant for rope twist
    ropeSegments.push(
      `<ellipse cx="${rx.toFixed(2)}" cy="${ry.toFixed(2)}" rx="5.5" ry="9.5" fill="url(#goldRope)" stroke="#5B3806" stroke-width="0.8" transform="rotate(${rot.toFixed(1)}, ${rx.toFixed(2)}, ${ry.toFixed(2)})" />`
    );
  }

  // Beaded Stud Border (generates 52 golden beads/rivets around circle)
  const beadCount = 52;
  const beadRadius = 238;
  const beads = [];
  for (let i = 0; i < beadCount; i++) {
    const angleDeg = (i * 360) / beadCount;
    const angleRad = (angleDeg * Math.PI) / 180;
    const bx = cx + beadRadius * Math.cos(angleRad);
    const by = cy + beadRadius * Math.sin(angleRad);
    beads.push(`
      <circle cx="${bx.toFixed(2)}" cy="${by.toFixed(2)}" r="3.2" fill="url(#goldBall)" stroke="#603808" stroke-width="0.5" />
      <circle cx="${(bx - 0.8).toFixed(2)}" cy="${(by - 0.8).toFixed(2)}" r="1" fill="#FFFFFF" opacity="0.9" />
    `);
  }

  // Fluted Outer Edge Teeth (72 teeth on outer perimeter)
  const toothCount = 72;
  const teeth = [];
  for (let i = 0; i < toothCount; i++) {
    const a0 = ((i * 360) / toothCount) * (Math.PI / 180);
    const a1 = (((i + 0.5) * 360) / toothCount) * (Math.PI / 180);
    const x0 = cx + 276 * Math.cos(a0);
    const y0 = cy + 276 * Math.sin(a0);
    const x1 = cx + 282 * Math.cos(a1);
    const y1 = cy + 282 * Math.sin(a1);
    teeth.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="url(#goldRimLight)" stroke-width="2.2" />`);
  }

  // Inner Guilloche Security Lathe Pattern Lines
  const guillochePaths = [];
  for (let k = 0; k < 18; k++) {
    const rot = k * 20;
    guillochePaths.push(`
      <ellipse cx="${cx}" cy="${cy}" rx="145" ry="55" fill="none" stroke="#D4AF37" stroke-width="0.65" opacity="0.32" transform="rotate(${rot}, ${cx}, ${cy})" />
    `);
  }

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Metallic Gold Multi-Stop Linear Gradient -->
    <linearGradient id="goldMetallic" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="15%" stop-color="#FDE68A" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="60%" stop-color="#B45309" />
      <stop offset="85%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>

    <!-- Coin Rim Gradient -->
    <radialGradient id="goldRimLight" cx="0.35" cy="0.35" r="0.65">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="30%" stop-color="#FDE047" />
      <stop offset="65%" stop-color="#D97706" />
      <stop offset="85%" stop-color="#92400E" />
      <stop offset="100%" stop-color="#451A03" />
    </radialGradient>

    <!-- Rope Texture Gradient -->
    <linearGradient id="goldRope" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="40%" stop-color="#FBBF24" />
      <stop offset="80%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#5B3806" />
    </linearGradient>

    <!-- 3D Ball Bead Gradient -->
    <radialGradient id="goldBall" cx="0.35" cy="0.35" r="0.5">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="40%" stop-color="#FBBF24" />
      <stop offset="80%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#451A03" />
    </radialGradient>

    <!-- Central Medallion Navy Gradient -->
    <radialGradient id="medallionNavy" cx="0.45" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="#1E3A5F" />
      <stop offset="45%" stop-color="#0E2238" />
      <stop offset="85%" stop-color="#071321" />
      <stop offset="100%" stop-color="#020810" />
    </radialGradient>

    <!-- Ribbon 3D Fold Gradient -->
    <linearGradient id="ribbonGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="25%" stop-color="#FDE047" />
      <stop offset="60%" stop-color="#D97706" />
      <stop offset="90%" stop-color="#92400E" />
      <stop offset="100%" stop-color="#451A03" />
    </linearGradient>

    <!-- Drop Shadow Filter for 3D Medal Depth -->
    <filter id="medalShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.65" />
    </filter>

    <!-- Subtle Bevel Shadow for Typography -->
    <filter id="textBevel" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="1.5" stdDeviation="0.8" flood-color="#3B2203" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- MASTER SEAL EMBOSSED DISK -->
  <g filter="url(#medalShadow)">

    <!-- 1. Outermost Fluted / Reeded Rim Edge -->
    <circle cx="${cx}" cy="${cy}" r="280" fill="url(#goldRimLight)" stroke="#451A03" stroke-width="2" />
    <g>${teeth.join('\n')}</g>

    <!-- 2. Deep Beveled Shadow Ring -->
    <circle cx="${cx}" cy="${cy}" r="270" fill="none" stroke="#381D02" stroke-width="3.5" />
    <circle cx="${cx}" cy="${cy}" r="268" fill="url(#goldMetallic)" stroke="#FDE68A" stroke-width="1.5" />

    <!-- 3. Heavy 3D Nautical Rope / Cable Braid Border -->
    <g id="rope-border">${ropeSegments.join('\n')}</g>

    <!-- 4. Inner Ring with Studded Beading -->
    <circle cx="${cx}" cy="${cy}" r="244" fill="none" stroke="#451A03" stroke-width="2" />
    <circle cx="${cx}" cy="${cy}" r="242" fill="url(#goldMetallic)" stroke="#FEF08A" stroke-width="1.5" />
    <g id="beaded-border">${beads.join('\n')}</g>
    <circle cx="${cx}" cy="${cy}" r="232" fill="none" stroke="#451A03" stroke-width="2" />

    <!-- 5. Concentric Outer Text Band (Deep Dark Gold) -->
    <circle cx="${cx}" cy="${cy}" r="230" fill="#2B1802" stroke="#D97706" stroke-width="1.5" />
    <circle cx="${cx}" cy="${cy}" r="176" fill="none" stroke="#FDE047" stroke-width="2" />

    <!-- CIRCUMFERENTIAL TEXT (Top and Bottom Arcs) -->
    <!-- Upper Arc: MARITIME INSTRUCTION & PORT SYSTEM -->
    ${renderArcText('MARITIME INSTRUCTION & PORT SYSTEM', cx, cy, 204, -156, -24, {
      fontSize: 16.5,
      fill: '#FFFBEB',
      fontFamily: 'Arial, sans-serif',
      fontWeight: '900',
      letterSpacing: 2,
      filter: 'url(#textBevel)'
    })}

    <!-- Flanking 5-Point Stars on text band -->
    ${renderStar(98, 300, 9, 3.5, '#FFF9D2', '#D4AF37')}
    ${renderStar(502, 300, 9, 3.5, '#FFF9D2', '#D4AF37')}

    <!-- Lower Arc: OFFICIAL CERTIFICATION • REPUBLIK INDONESIA -->
    ${renderArcText('OFFICIAL CERTIFICATION • REPUBLIK INDONESIA', cx, cy, 204, 156, 24, {
      fontSize: 14.5,
      fill: '#FDE68A',
      fontFamily: 'Arial, sans-serif',
      fontWeight: '800',
      inward: false,
      filter: 'url(#textBevel)'
    })}

    <!-- 6. Inner Security Disc (Navy / Charcoal with Guilloche Rosette) -->
    <circle cx="${cx}" cy="${cy}" r="174" fill="url(#medallionNavy)" stroke="#D4AF37" stroke-width="2.5" />

    <!-- Guilloche Security Lathe Lines -->
    <g id="guilloche-pattern">${guillochePaths.join('\n')}</g>

    <!-- 7. CENTRAL EMBLEM: CROSSED ADMIRALTY FOUL ANCHORS -->
    <g id="crossed-anchors" transform="translate(${cx}, ${cy})">

      <!-- ANCHOR 1 (Tilted -35 deg) -->
      <g transform="rotate(-35)">
        <!-- Shank -->
        <rect x="-5" y="-120" width="10" height="210" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1" />
        <line x1="0" y1="-120" x2="0" y2="90" stroke="#FFFBEB" stroke-width="1.5" />
        
        <!-- Cross-Stock (Wooden/Iron stock at top) -->
        <polygon points="-55,-88 55,-88 52,-78 -52,-78" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1" />
        <!-- Stock Ball Ends -->
        <circle cx="-54" cy="-83" r="5" fill="url(#goldBall)" />
        <circle cx="54" cy="-83" r="5" fill="url(#goldBall)" />

        <!-- Anchor Crown & Curved Arms -->
        <path d="M -60,50 Q 0,110 60,50 Q 0,90 -60,50 Z" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1.2" />

        <!-- Triangular Palms / Flukes -->
        <polygon points="-65,45 -80,25 -52,38" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1.2" />
        <polygon points="65,45 80,25 52,38" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1.2" />

        <!-- Top Shackle Ring -->
        <circle cx="0" cy="-125" r="14" fill="none" stroke="url(#goldMetallic)" stroke-width="4.5" />
        <circle cx="0" cy="-125" r="14" fill="none" stroke="#451A03" stroke-width="1" />

        <!-- Entwined Cable Rope (Manila foul cable) -->
        <path d="M 0,-125 Q 25,-90 -10,-60 Q 20,-10 -15,40 Q 10,75 -60,45" fill="none" stroke="url(#goldRope)" stroke-width="4.5" />
        <path d="M 0,-125 Q 25,-90 -10,-60 Q 20,-10 -15,40 Q 10,75 -60,45" fill="none" stroke="#451A03" stroke-width="0.8" />
      </g>

      <!-- ANCHOR 2 (Tilted +35 deg) -->
      <g transform="rotate(35)">
        <!-- Shank -->
        <rect x="-5" y="-120" width="10" height="210" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1" />
        <line x1="0" y1="-120" x2="0" y2="90" stroke="#FFFBEB" stroke-width="1.5" />

        <!-- Cross-Stock -->
        <polygon points="-55,-88 55,-88 52,-78 -52,-78" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1" />
        <circle cx="-54" cy="-83" r="5" fill="url(#goldBall)" />
        <circle cx="54" cy="-83" r="5" fill="url(#goldBall)" />

        <!-- Arms & Flukes -->
        <path d="M -60,50 Q 0,110 60,50 Q 0,90 -60,50 Z" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1.2" />
        <polygon points="-65,45 -80,25 -52,38" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1.2" />
        <polygon points="65,45 80,25 52,38" fill="url(#goldMetallic)" stroke="#451A03" stroke-width="1.2" />

        <!-- Top Shackle Ring -->
        <circle cx="0" cy="-125" r="14" fill="none" stroke="url(#goldMetallic)" stroke-width="4.5" />
        <circle cx="0" cy="-125" r="14" fill="none" stroke="#451A03" stroke-width="1" />

        <!-- Cable Rope -->
        <path d="M 0,-125 Q -25,-90 10,-60 Q -20,-10 15,40 Q -10,75 60,45" fill="none" stroke="url(#goldRope)" stroke-width="4.5" />
        <path d="M 0,-125 Q -25,-90 10,-60 Q -20,-10 15,40 Q -10,75 60,45" fill="none" stroke="#451A03" stroke-width="0.8" />
      </g>

      <!-- 8. MARINER'S COMPASS ROSE (Center Nexus) -->
      <g id="compass-rose">
        <!-- 4 Cardinal Points (N, S, E, W) -->
        <polygon points="0,0 0,-52 8,-8" fill="#FFF9D2" />
        <polygon points="0,0 0,-52 -8,-8" fill="#B45309" />

        <polygon points="0,0 0,52 -8,8" fill="#FFF9D2" />
        <polygon points="0,0 0,52 8,8" fill="#B45309" />

        <polygon points="0,0 52,0 8,8" fill="#FFF9D2" />
        <polygon points="0,0 52,0 8,-8" fill="#B45309" />

        <polygon points="0,0 -52,0 -8,-8" fill="#FFF9D2" />
        <polygon points="0,0 -52,0 -8,8" fill="#B45309" />

        <!-- 4 Intercardinal Points (NE, SE, SW, NW) -->
        <polygon points="0,0 28,-28 6,-1" fill="#FDE047" />
        <polygon points="0,0 28,-28 1,-6" fill="#92400E" />

        <polygon points="0,0 28,28 1,6" fill="#FDE047" />
        <polygon points="0,0 28,28 6,1" fill="#92400E" />

        <polygon points="0,0 -28,28 -6,1" fill="#FDE047" />
        <polygon points="0,0 -28,28 -1,6" fill="#92400E" />

        <polygon points="0,0 -28,-28 -1,-6" fill="#FDE047" />
        <polygon points="0,0 -28,-28 -6,-1" fill="#92400E" />

        <!-- Central Golden Cabochon Dome -->
        <circle cx="0" cy="0" r="14" fill="url(#goldBall)" stroke="#451A03" stroke-width="1.2" />
        <circle cx="-3" cy="-3" r="4.5" fill="#FFFFFF" opacity="0.8" />
      </g>

      <!-- TOP EMBLEM: STAR OF MARITIME EXCELLENCE & LAUREL WREATH -->
      <g transform="translate(0, -115)">
        ${renderStar(0, 0, 14, 5.5, '#FFFBEB', '#D97706')}
        <!-- Laurel Sprigs flanking star -->
        <path d="M -16,6 Q -30,-4 -20,-16" fill="none" stroke="url(#goldMetallic)" stroke-width="2.2" />
        <path d="M 16,6 Q 30,-4 20,-16" fill="none" stroke="url(#goldMetallic)" stroke-width="2.2" />
      </g>
    </g>

    <!-- 9. 3D FOLDED HERALDIC BANNER / RIBBON (Lower Medallion) -->
    <g id="ribbon-banner" transform="translate(${cx}, 455)">
      <!-- Left Swallowtail Ribbon Tail -->
      <polygon points="-240,-10 -170,-10 -185,25 -250,25 -235,8" fill="#78350F" stroke="#451A03" stroke-width="1" />
      <polygon points="-190,-10 -150,-10 -160,25 -200,25" fill="#B45309" stroke="#451A03" stroke-width="1" />

      <!-- Right Swallowtail Ribbon Tail -->
      <polygon points="240,-10 170,-10 185,25 250,25 235,8" fill="#78350F" stroke="#451A03" stroke-width="1" />
      <polygon points="190,-10 150,-10 160,25 200,25" fill="#B45309" stroke="#451A03" stroke-width="1" />

      <!-- Ribbon Center Main Banner Body -->
      <path d="M -170,-15 
               Q 0,-32 170,-15 
               L 165,25 
               Q 0,8 -165,25 Z" 
            fill="url(#ribbonGold)" 
            stroke="#451A03" 
            stroke-width="1.8" />

      <!-- Banner Inner Gold Border Trim -->
      <path d="M -162,-11 Q 0,-27 162,-11" stroke="#FFFBEB" stroke-width="1.2" fill="none" />
      <path d="M -158,20 Q 0,4 158,20" stroke="#78350F" stroke-width="1.2" fill="none" />

      <!-- Ribbon Inscription Text -->
      <text x="0" y="6" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="14" fill="#0A1828" text-anchor="middle" letter-spacing="2" filter="url(#textBevel)">
        PELINDO • VERIFIED COMPETENCY • CLASS 1
      </text>
    </g>

    <!-- 10. POLISHED DOME GLASS SPECULAR HIGHLIGHT (Sweeping crescent) -->
    <path d="M 120,160 
             C 180,90 380,80 470,140 
             C 390,110 210,120 120,160 Z" 
          fill="#FFFFFF" 
          opacity="0.28" />
  </g>
</svg>
`;
}

// ============================================================================
// MAIN GENERATION RUNNER
// ============================================================================
async function main() {
  console.log('🚀 Starting MIPS Maritime Image Assets Generator...');
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const tasks = [
    {
      name: 'vessel-hero.png',
      width: 1920,
      height: 1080,
      generator: generateVesselHeroSvg,
      desc: 'Cinematic 3D container ship MV Nusantara entering Tanjung Priok at sunset'
    },
    {
      name: 'officer-gunawan.png',
      width: 800,
      height: 800,
      generator: generateOfficerGunawanSvg,
      desc: 'Capt. H. Gunawan formal portrait with VTS background'
    },
    {
      name: 'terminal-panorama.png',
      width: 1920,
      height: 600,
      generator: generateTerminalPanoramaSvg,
      desc: 'Tanjung Priok container terminal dusk panorama'
    },
    {
      name: 'seal-competency.png',
      width: 600,
      height: 600,
      generator: generateSealCompetencySvg,
      desc: 'Embossed gold maritime competency verification seal'
    }
  ];

  const results = [];

  for (const task of tasks) {
    console.log(`\n⏳ Generating ${task.name} (${task.width}x${task.height})...`);
    console.log(`   Description: ${task.desc}`);
    const svg = task.generator();
    const destPath = path.join(OUTPUT_DIR, task.name);

    const buffer = await sharp(Buffer.from(svg))
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(destPath);

    const stats = await fs.stat(destPath);
    const sizeKb = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ Created ${task.name}: ${sizeKb} KB (${stats.size} bytes)`);

    results.push({
      name: task.name,
      width: task.width,
      height: task.height,
      sizeBytes: stats.size,
      sizeKb: `${sizeKb} KB`,
      path: destPath
    });
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 4 MARITIME ASSETS GENERATED SUCCESSFULLY:');
  console.table(results.map(r => ({ File: r.name, Dimensions: `${r.width}x${r.height}`, Size: r.sizeKb })));
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
