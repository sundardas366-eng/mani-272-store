const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}


const productsToGenerate = [
  {
    slug: 'cover-silent-exe',
    name: 'COVER-SILENT-EXE',
    category: 'SILENT AIM',
    subtitle: 'STANDALONE EXECUTABLE BUILD',
    badge: 'EXE RUNTIME',
    icon: `
      <rect x="230" y="160" width="140" height="110" rx="10" fill="#120505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <path d="M250 200 L270 200 M250 220 L310 220 M250 240 L290 240" stroke="#ff4444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="340" cy="185" r="5" fill="#00ff66"/>
      <circle cx="355" cy="185" r="5" fill="#F50B00"/>
      <text x="300" y="310" fill="#ffffff" font-family="'Courier New', monospace" font-size="18" font-weight="bold" text-anchor="middle">.EXE</text>
    `
  },
  {
    slug: 'cover-silent-apk',
    name: 'COVER-SILENT-APK',
    category: 'SILENT AIM',
    subtitle: 'ANDROID MOBILE EDITION',
    badge: 'MOBILE APK',
    icon: `
      <rect x="250" y="140" width="100" height="170" rx="16" fill="#120505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <circle cx="300" cy="160" r="4" fill="#ffffff" opacity="0.6"/>
      <rect x="265" y="175" width="70" height="100" rx="4" fill="#200808" stroke="#ff3333" stroke-width="1.5"/>
      <circle cx="300" cy="225" r="20" fill="none" stroke="#F50B00" stroke-width="2" stroke-dasharray="4,4"/>
      <line x1="300" y1="200" x2="300" y2="250" stroke="#F50B00" stroke-width="2"/>
      <line x1="275" y1="225" x2="325" y2="225" stroke="#F50B00" stroke-width="2"/>
      <circle cx="300" cy="295" r="6" fill="#F50B00"/>
    `
  },
  {
    slug: 'force-aim',
    name: 'FORCE-AIM',
    category: 'AIM ASSIST',
    subtitle: 'MAGNETIC TRAJECTORY LOCK',
    badge: 'FORCE LOCK',
    icon: `
      <circle cx="300" cy="210" r="75" fill="none" stroke="#F50B00" stroke-width="2" stroke-dasharray="10,6" opacity="0.5"/>
      <circle cx="300" cy="210" r="50" fill="none" stroke="#ff3333" stroke-width="3" filter="url(#glow)"/>
      <circle cx="300" cy="210" r="16" fill="#F50B00" opacity="0.4"/>
      <circle cx="300" cy="210" r="6" fill="#ffffff"/>
      <line x1="180" y1="210" x2="250" y2="210" stroke="#F50B00" stroke-width="3"/>
      <line x1="350" y1="210" x2="420" y2="210" stroke="#F50B00" stroke-width="3"/>
      <line x1="300" y1="90" x2="300" y2="160" stroke="#F50B00" stroke-width="3"/>
      <line x1="300" y1="260" x2="300" y2="330" stroke="#F50B00" stroke-width="3"/>
      <path d="M240 170 L220 150 M360 170 L380 150 M240 250 L220 270 M360 250 L380 270" stroke="#ff6666" stroke-width="2"/>
    `
  },
  {
    slug: 'aimkill',
    name: 'AIMKILL',
    category: 'COMBAT CORE',
    subtitle: 'CLASSIC PRECISION ELIMINATOR',
    badge: 'PRO SERIES',
    icon: `
      <path d="M260 160 C260 130 340 130 340 160 C340 190 325 210 320 230 L280 230 C275 210 260 190 260 160 Z" fill="#200606" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <circle cx="280" cy="165" r="8" fill="#F50B00"/>
      <circle cx="320" cy="165" r="8" fill="#F50B00"/>
      <path d="M285 240 L285 255 M300 240 L300 255 M315 240 L315 255" stroke="#F50B00" stroke-width="3"/>
      <circle cx="300" cy="200" r="70" fill="none" stroke="#ff3333" stroke-width="1.5" stroke-dasharray="5,8"/>
      <line x1="220" y1="200" x2="245" y2="200" stroke="#ff4444" stroke-width="3"/>
      <line x1="355" y1="200" x2="380" y2="200" stroke="#ff4444" stroke-width="3"/>
    `
  },
  {
    slug: 'aimkill-max',
    name: 'AIMKILL-MAX',
    category: 'COMBAT CORE',
    subtitle: 'OVERCLOCKED MULTI-TARGET CORE',
    badge: 'MAX OVERCLOCK',
    icon: `
      <polygon points="300,120 370,165 370,255 300,300 230,255 230,165" fill="#180404" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <polygon points="300,145 345,175 345,235 300,265 255,235 255,175" fill="#2d0808" stroke="#ff4444" stroke-width="1.5"/>
      <circle cx="300" cy="210" r="14" fill="#F50B00"/>
      <circle cx="300" cy="210" r="4" fill="#ffffff"/>
      <path d="M210 150 L235 150 L235 125" fill="none" stroke="#F50B00" stroke-width="3"/>
      <path d="M390 150 L365 150 L365 125" fill="none" stroke="#F50B00" stroke-width="3"/>
      <path d="M210 270 L235 270 L235 295" fill="none" stroke="#F50B00" stroke-width="3"/>
      <path d="M390 270 L365 270 L365 295" fill="none" stroke="#F50B00" stroke-width="3"/>
    `
  },
  {
    slug: 'aimkill-exe',
    name: 'AIMKILL-EXE',
    category: 'COMBAT CORE',
    subtitle: 'PORTABLE PLUG & RUN SYSTEM',
    badge: 'DIRECT EXE',
    icon: `
      <rect x="220" y="140" width="160" height="130" rx="12" fill="#150505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <line x1="220" y1="175" x2="380" y2="175" stroke="#441111" stroke-width="2"/>
      <circle cx="240" cy="158" r="4" fill="#ff4444"/>
      <circle cx="255" cy="158" r="4" fill="#ffaa00"/>
      <circle cx="270" cy="158" r="4" fill="#00ff66"/>
      <text x="300" y="235" fill="#F50B00" font-family="'Courier New', monospace" font-size="28" font-weight="900" text-anchor="middle">> AIM</text>
    `
  },
  {
    slug: 'aimbot-visible-panel',
    name: 'AIMBOT-VISIBLE-PANEL',
    category: 'TACTICAL OVERLAY',
    subtitle: 'ON-SCREEN HUD & FOV SELECTOR',
    badge: 'VISIBLE HUD',
    icon: `
      <circle cx="300" cy="210" r="85" fill="none" stroke="#F50B00" stroke-width="2" stroke-dasharray="15,8" opacity="0.6"/>
      <circle cx="300" cy="210" r="45" fill="none" stroke="#ff3333" stroke-width="2.5" filter="url(#glow)"/>
      <line x1="300" y1="150" x2="300" y2="270" stroke="#F50B00" stroke-width="2"/>
      <line x1="240" y1="210" x2="360" y2="210" stroke="#F50B00" stroke-width="2"/>
      <rect x="275" y="185" width="50" height="50" fill="none" stroke="#ffffff" stroke-width="1.5"/>
      <text x="300" y="320" fill="#ff6666" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">FOV: 120° [LOCKED]</text>
    `
  },
  {
    slug: 'mobile-panel',
    name: 'MOBILE-PANEL',
    category: 'CONTROL PANEL',
    subtitle: 'TOUCH-OPTIMIZED INTERFACE',
    badge: 'TOUCH GUI',
    icon: `
      <rect x="235" y="130" width="130" height="175" rx="18" fill="#140505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <rect x="250" y="160" width="100" height="24" rx="6" fill="#2d0808" stroke="#ff3333" stroke-width="1"/>
      <circle cx="330" cy="172" r="8" fill="#F50B00"/>
      <rect x="250" y="195" width="100" height="24" rx="6" fill="#2d0808" stroke="#ff3333" stroke-width="1"/>
      <circle cx="330" cy="207" r="8" fill="#F50B00"/>
      <rect x="250" y="230" width="100" height="24" rx="6" fill="#2d0808" stroke="#ff3333" stroke-width="1"/>
      <circle cx="270" cy="242" r="8" fill="#444444"/>
    `
  },
  {
    slug: 'streamer-panel',
    name: 'STREAMER-PANEL',
    category: 'STREAM PRO',
    subtitle: 'OBS / DISCORD CAPTURE BYPASS',
    badge: '100% STEALTH',
    icon: `
      <path d="M220 210 Q300 130 380 210 Q300 290 220 210 Z" fill="#150505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <circle cx="300" cy="210" r="30" fill="#2b0707" stroke="#ff3333" stroke-width="2"/>
      <circle cx="300" cy="210" r="12" fill="#F50B00"/>
      <line x1="210" y1="280" x2="390" y2="140" stroke="#F50B00" stroke-width="3"/>
      <text x="300" y="325" fill="#ff5555" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">STREAM CLEAN</text>
    `
  },
  {
    slug: 'vault-panel',
    name: 'VAULT-PANEL',
    category: 'SECURITY VAULT',
    subtitle: 'ENCRYPTED PROFILE ARCHIVE',
    badge: 'AES-256 VAULT',
    icon: `
      <circle cx="300" cy="210" r="75" fill="#180505" stroke="#F50B00" stroke-width="4" filter="url(#glow)"/>
      <circle cx="300" cy="210" r="45" fill="#2b0808" stroke="#ff3333" stroke-width="2"/>
      <line x1="300" y1="135" x2="300" y2="165" stroke="#F50B00" stroke-width="4"/>
      <line x1="300" y1="255" x2="300" y2="285" stroke="#F50B00" stroke-width="4"/>
      <line x1="225" y1="210" x2="255" y2="210" stroke="#F50B00" stroke-width="4"/>
      <line x1="345" y1="210" x2="375" y2="210" stroke="#F50B00" stroke-width="4"/>
      <circle cx="300" cy="210" r="12" fill="#F50B00"/>
    `
  },
  {
    slug: 'basic-panel',
    name: 'BASIC-PANEL',
    category: 'STARTER SUITE',
    subtitle: 'ESSENTIAL CALIBRATION TOOLS',
    badge: 'STARTER TIER',
    icon: `
      <rect x="220" y="140" width="160" height="140" rx="12" fill="#150505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <line x1="250" y1="180" x2="350" y2="180" stroke="#333" stroke-width="6" stroke-linecap="round"/>
      <circle cx="280" cy="180" r="8" fill="#F50B00"/>
      <line x1="250" y1="220" x2="350" y2="220" stroke="#333" stroke-width="6" stroke-linecap="round"/>
      <circle cx="320" cy="220" r="8" fill="#F50B00"/>
      <text x="300" y="315" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">CALIBRATED</text>
    `
  },
  {
    slug: 'brutal-panel',
    name: 'BRUTAL-PANEL',
    category: 'HARDCORE PANEL',
    subtitle: 'AGGRESSIVE FULL TUNING ARSENAL',
    badge: 'BRUTAL FORCE',
    icon: `
      <polygon points="300,120 380,180 350,280 250,280 220,180" fill="#200505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <path d="M260 210 L300 160 L340 210 L320 250 L280 250 Z" fill="#440a0a" stroke="#ff3333" stroke-width="2"/>
      <line x1="200" y1="130" x2="230" y2="160" stroke="#F50B00" stroke-width="3"/>
      <line x1="400" y1="130" x2="370" y2="160" stroke="#F50B00" stroke-width="3"/>
      <text x="300" y="315" fill="#ff3333" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">OVERDRIVE</text>
    `
  },
  {
    slug: 'premium-panel',
    name: 'PREMIUM-PANEL',
    category: 'ALL-ACCESS VIP',
    subtitle: 'COMPLETE UNLOCKED ECOSYSTEM',
    badge: 'VIP EDITION',
    icon: `
      <path d="M240 240 L220 160 L270 200 L300 140 L330 200 L380 160 L360 240 Z" fill="#2b0707" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <circle cx="220" cy="155" r="6" fill="#ffd700"/>
      <circle cx="300" cy="135" r="7" fill="#ffd700"/>
      <circle cx="380" cy="155" r="6" fill="#ffd700"/>
      <circle cx="270" cy="200" r="4" fill="#F50B00"/>
      <circle cx="330" cy="200" r="4" fill="#F50B00"/>
      <rect x="250" y="245" width="100" height="16" rx="4" fill="#ffd700" opacity="0.8"/>
      <text x="300" y="258" fill="#000000" font-family="sans-serif" font-size="11" font-weight="900" text-anchor="middle">VIP UNLOCK</text>
    `
  },
  {
    slug: 'loader-panel',
    name: 'LOADER-PANEL',
    category: 'STEALTH INJECTOR',
    subtitle: 'MEMORY INJECTION ENGINE',
    badge: 'ZERO TRACE',
    icon: `
      <rect x="260" y="140" width="80" height="150" rx="8" fill="#150505" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <line x1="300" y1="100" x2="300" y2="140" stroke="#ff4444" stroke-width="4"/>
      <circle cx="300" cy="95" r="6" fill="#F50B00"/>
      <rect x="275" y="165" width="50" height="40" rx="4" fill="#3d0a0a" stroke="#ff3333" stroke-width="1.5"/>
      <line x1="285" y1="185" x2="315" y2="185" stroke="#00ff88" stroke-width="2"/>
      <text x="300" y="325" fill="#ffffff" font-family="'Courier New', monospace" font-size="12" font-weight="bold" text-anchor="middle">INJECT OK</text>
    `
  },
  {
    slug: 'internal-panel',
    name: 'INTERNAL-PANEL',
    category: 'DIRECT HOOK',
    subtitle: 'DIRECT GPU OVERLAY INTEGRATION',
    badge: 'DIRECTX HOOK',
    icon: `
      <polygon points="300,140 370,180 370,250 300,290 230,250 230,180" fill="none" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <line x1="300" y1="140" x2="300" y2="215" stroke="#F50B00" stroke-width="2"/>
      <line x1="370" y1="180" x2="300" y2="215" stroke="#F50B00" stroke-width="2"/>
      <line x1="230" y1="180" x2="300" y2="215" stroke="#F50B00" stroke-width="2"/>
      <line x1="300" y1="215" x2="300" y2="290" stroke="#F50B00" stroke-width="2"/>
      <circle cx="300" cy="215" r="8" fill="#ff4444"/>
      <text x="300" y="325" fill="#ff4444" font-family="'Courier New', monospace" font-size="12" font-weight="bold" text-anchor="middle">RENDER HOOK</text>
    `
  },
  {
    slug: 'id-store',
    name: 'ID-STORE',
    category: 'CREDENTIAL MGR',
    subtitle: 'ENCRYPTED ACCOUNT REPOSITORY',
    badge: 'KEY VAULT',
    icon: `
      <rect x="230" y="150" width="140" height="90" rx="10" fill="#180606" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <rect x="245" y="170" width="30" height="24" rx="4" fill="#ffd700"/>
      <line x1="290" y1="175" x2="350" y2="175" stroke="#ffffff" stroke-width="2"/>
      <line x1="290" y1="190" x2="330" y2="190" stroke="#ffffff" opacity="0.6" stroke-width="2"/>
      <line x1="245" y1="215" x2="350" y2="215" stroke="#F50B00" stroke-width="2"/>
      <text x="300" y="280" fill="#ff6666" font-family="'Courier New', monospace" font-size="12" font-weight="bold" text-anchor="middle">SESSION_STORE</text>
    `
  },
  {
    slug: 'fps-boost',
    name: 'FPS-BOOST',
    category: 'SYSTEM OPTIMIZER',
    subtitle: 'FRAME ACCELERATION UTILITY',
    badge: '240+ FPS',
    icon: `
      <path d="M220 250 A90 90 0 1 1 380 250" fill="none" stroke="#331111" stroke-width="14" stroke-linecap="round"/>
      <path d="M220 250 A90 90 0 0 1 360 170" fill="none" stroke="#F50B00" stroke-width="14" stroke-linecap="round" filter="url(#glow)"/>
      <line x1="300" y1="250" x2="350" y2="180" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <circle cx="300" cy="250" r="10" fill="#F50B00"/>
      <text x="300" y="220" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="900" text-anchor="middle">240</text>
      <text x="300" y="295" fill="#ff4444" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">FRAMES / SEC</text>
    `
  },
  {
    slug: 'selling-stuff',
    name: 'SELLING-STUFF',
    category: 'BULK PACK',
    subtitle: 'DISTRIBUTION & RESELLER ASSETS',
    badge: 'MERCHANT PACK',
    icon: `
      <polygon points="300,140 370,180 370,250 300,290 230,250 230,180" fill="#200606" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
      <line x1="300" y1="140" x2="300" y2="290" stroke="#ff3333" stroke-width="2"/>
      <line x1="230" y1="180" x2="370" y2="250" stroke="#ff3333" stroke-width="1.5"/>
      <line x1="370" y1="180" x2="230" y2="250" stroke="#ff3333" stroke-width="1.5"/>
      <text x="300" y="325" fill="#ffd700" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">SUPPLY CRATE</text>
    `
  },
  {
    slug: 'nitro-seller',
    name: 'NITRO-SELLER',
    category: 'TURBO SALES',
    subtitle: 'AUTOMATED FULFILLMENT TOOLKIT',
    badge: 'TURBO ENGINE',
    icon: `
      <polygon points="310,130 250,210 295,210 280,280 350,195 305,195" fill="#F50B00" stroke="#ffffff" stroke-width="2" filter="url(#glow)"/>
      <circle cx="300" cy="205" r="75" fill="none" stroke="#ff4444" stroke-width="2" stroke-dasharray="8,6" opacity="0.6"/>
      <text x="300" y="320" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle">NITRO BOOST</text>
    `
  }
];

function generateSVG(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0303"/>
      <stop offset="50%" stop-color="#140505"/>
      <stop offset="100%" stop-color="#050101"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="48%" r="45%">
      <stop offset="0%" stop-color="#F50B00" stop-opacity="0.32"/>
      <stop offset="55%" stop-color="#F50B00" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <pattern id="hexGrid" width="30" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
      <path d="M15 0 L30 8.66 L30 26 L15 34.64 L0 26 L0 8.66 Z" fill="none" stroke="#F50B00" stroke-width="0.6" stroke-opacity="0.12"/>
      <path d="M15 52 L30 43.34 L30 26 L15 17.36 L0 26 L0 43.34 Z" fill="none" stroke="#F50B00" stroke-width="0.6" stroke-opacity="0.12"/>
    </pattern>
  </defs>

  <!-- Dark Background -->
  <rect width="600" height="420" fill="url(#bgGrad)"/>
  <rect width="600" height="420" fill="url(#hexGrid)"/>
  <rect width="600" height="420" fill="url(#centerGlow)"/>

  <!-- Tech Frame Borders -->
  <path d="M 20 50 L 20 20 L 50 20" fill="none" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
  <path d="M 580 50 L 580 20 L 550 20" fill="none" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
  <path d="M 20 370 L 20 400 L 50 400" fill="none" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>
  <path d="M 580 370 L 580 400 L 550 400" fill="none" stroke="#F50B00" stroke-width="3" filter="url(#glow)"/>

  <!-- Top Status Bar -->
  <line x1="60" y1="30" x2="540" y2="30" stroke="#331111" stroke-width="1"/>
  <circle cx="70" cy="30" r="3" fill="#00ff66"/>
  <text x="80" y="34" fill="#888888" font-family="'Courier New', monospace" font-size="10" letter-spacing="2">MANI 272 OFFICIAL PRODUCT</text>
  <rect x="460" y="21" width="80" height="18" rx="4" fill="#F50B00" fill-opacity="0.2" stroke="#F50B00" stroke-width="1"/>
  <text x="500" y="34" fill="#ff4444" font-family="'Courier New', monospace" font-size="9" font-weight="bold" text-anchor="middle" letter-spacing="1">${p.badge}</text>

  <!-- Central Visual Graphic -->
  <g>
    ${p.icon}
  </g>

  <!-- Bottom Details Bar -->
  <rect x="30" y="340" width="540" height="52" rx="8" fill="#100303" fill-opacity="0.85" stroke="#F50B00" stroke-width="1.2"/>
  <text x="50" y="362" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1">${p.name}</text>
  <text x="50" y="380" fill="#888888" font-family="'Courier New', monospace" font-size="10" letter-spacing="1.5">${p.subtitle}</text>
  
  <rect x="465" y="352" width="90" height="28" rx="6" fill="#F50B00" filter="url(#glow)"/>
  <text x="510" y="371" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="1">PREMIUM</text>
</svg>`;
}

for (const prod of productsToGenerate) {
  const filePath = path.join(outDir, `${prod.slug}.svg`);
  fs.writeFileSync(filePath, generateSVG(prod), 'utf-8');
  console.log(`Generated: ${prod.slug}.svg`);
}

console.log('All product artworks generated successfully!');
