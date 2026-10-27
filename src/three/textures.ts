import * as THREE from 'three';

/**
 * Procedural texture generator for signs, labels, book covers, and props.
 * All textures are rendered to HTML5 canvas and converted to CanvasTexture.
 */

export function createTextBadgeTexture(
  text: string,
  options: {
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    fontSize?: number;
    subText?: string;
    subTextColor?: string;
    width?: number;
    height?: number;
    isPill?: boolean;
    monospace?: boolean;
  } = {}
): THREE.CanvasTexture {
  const width = options.width || 512;
  const height = options.height || 160;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    const radius = options.isPill ? height / 2 : 24;
    const pad = 8;
    const bg = options.bgColor || 'rgba(18, 14, 34, 0.88)';
    const border = options.borderColor || 'rgba(168, 85, 247, 0.7)';

    // Rounded rectangle background
    ctx.beginPath();
    ctx.moveTo(pad + radius, pad);
    ctx.lineTo(width - pad - radius, pad);
    ctx.quadraticCurveTo(width - pad, pad, width - pad, pad + radius);
    ctx.lineTo(width - pad, height - pad - radius);
    ctx.quadraticCurveTo(width - pad, height - pad, width - pad - radius, height - pad);
    ctx.lineTo(pad + radius, height - pad);
    ctx.quadraticCurveTo(pad, height - pad, pad, height - pad - radius);
    ctx.lineTo(pad, pad + radius);
    ctx.quadraticCurveTo(pad, pad, pad + radius, pad);
    ctx.closePath();

    ctx.fillStyle = bg;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = border;
    ctx.stroke();

    // Main text
    const fontFam = options.monospace ? '"JetBrains Mono", monospace' : '"Plus Jakarta Sans", sans-serif';
    const fontSize = options.fontSize || 38;
    ctx.font = `bold ${fontSize}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = options.textColor || '#ffffff';

    const centerY = options.subText ? height * 0.4 : height * 0.5;
    ctx.fillText(text, width / 2, centerY);

    // Subtext if provided
    if (options.subText) {
      ctx.font = `600 22px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = options.subTextColor || '#a78bfa';
      ctx.fillText(options.subText, width / 2, height * 0.74);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export function createFloatingLabelTexture(
  text: string,
  theme: 'purple' | 'teal' = 'purple'
): THREE.CanvasTexture {
  const width = 512;
  const height = 110;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);

  const isPurple = theme === 'purple';
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (isPurple) {
    bgGrad.addColorStop(0, 'rgba(46, 16, 80, 0.92)');
    bgGrad.addColorStop(1, 'rgba(28, 10, 52, 0.96)');
  } else {
    bgGrad.addColorStop(0, 'rgba(13, 74, 70, 0.92)');
    bgGrad.addColorStop(1, 'rgba(9, 44, 42, 0.96)');
  }

  // Draw pill
  const r = 26;
  const pad = 6;
  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.lineTo(width - pad - r, pad);
  ctx.quadraticCurveTo(width - pad, pad, width - pad, pad + r);
  ctx.lineTo(width - pad, height - pad - r);
  ctx.quadraticCurveTo(width - pad, height - pad, width - pad - r, height - pad);
  ctx.lineTo(pad + r, height - pad);
  ctx.quadraticCurveTo(pad, height - pad, pad, height - pad - r);
  ctx.lineTo(pad, pad + r);
  ctx.quadraticCurveTo(pad, pad, pad + r, pad);
  ctx.closePath();

  ctx.fillStyle = bgGrad;
  ctx.fill();

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = isPurple ? '#c084fc' : '#2dd4bf';
  ctx.stroke();

  // Glow dot indicator
  const dotX = pad + 32;
  const dotY = height / 2;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
  ctx.fillStyle = isPurple ? '#e879f9' : '#5eead4';
  ctx.fill();

  // Text
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, dotX + 22, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createOperatorTileTexture(opText: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Gradient tile
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#115e59');
  grad.addColorStop(1, '#042f2e');
  ctx.fillStyle = grad;
  ctx.roundRect(12, 12, size - 24, size - 24, 28);
  ctx.fill();

  // Glowing border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#2dd4bf';
  ctx.stroke();

  // Inner inset border
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.roundRect(22, 22, size - 44, size - 44, 20);
  ctx.stroke();

  // Operator code font
  const fontSize = opText.length > 7 ? 36 : opText.length > 4 ? 44 : 58;
  ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0fdfa';
  ctx.fillText(opText, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createDataTypeCubeTexture(typeName: string, color: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(20, 10, 36, 0.95)';
  ctx.fillRect(0, 0, size, size);

  ctx.lineWidth = 10;
  ctx.strokeStyle = color;
  ctx.strokeRect(5, 5, size - 10, size - 10);

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.strokeRect(18, 18, size - 36, size - 36);

  ctx.font = 'bold 64px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(typeName, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTimerDialTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#38bdf8';
  ctx.stroke();

  // Hour/minute tick marks
  ctx.translate(size / 2, size / 2);
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.beginPath();
    ctx.moveTo(0, -(size / 2 - 20));
    ctx.lineTo(0, -(size / 2 - 32));
    ctx.lineWidth = i % 3 === 0 ? 5 : 2;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
  }

  // Dial text
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('45:00', 0, 20);

  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('EXAM TIMER', 0, -25);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCheatSheetTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 700;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Parchment / high-tech summary paper
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#0d9488';
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Header banner
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(18, 18, width - 36, 75);

  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('PYTHON END-SEM CHEAT SHEET', width / 2, 52);

  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#99f6e4';
  ctx.fillText('1-Page High-Yield Revision Matrix', width / 2, 76);

  // Code sections
  ctx.textAlign = 'left';
  const lines = [
    { title: 'OPERATOR PRECEDENCE', code: '() > ** > unary (+,-) > *,/,//,% > +,- > comparisons > not > and > or' },
    { title: 'INTEGER TRUNCATION', code: '7 // 2 = 3   |   -7 // 2 = -4 (floors to -inf)' },
    { title: 'EQUALITY VS IDENTITY', code: 'a == b (values)  vs  a is b (memory id())' },
    { title: 'IMMUTABLE TYPES', code: 'int, float, bool, str, tuple, frozenset' },
    { title: 'MUTABLE TYPES', code: 'list, dict, set (modify in place)' },
    { title: 'LOOP-ELSE CLAUSE', code: 'for ... else: runs ONLY if loop exits WITHOUT break' },
    { title: 'RANGE BOUNDS', code: 'range(start=0, stop, step=1) -> excludes stop!' },
    { title: 'STRING SLICING', code: 's[start:stop:step] -> s[::-1] reverses string' },
  ];

  let y = 125;
  lines.forEach((item) => {
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0f766e';
    ctx.fillText(item.title, 32, y);

    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(item.code, 32, y + 20);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, y + 32);
    ctx.lineTo(width - 32, y + 32);
    ctx.stroke();

    y += 52;
  });

  // Footer stamp
  ctx.fillStyle = '#14b8a6';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('★ 100% EXAM READY ★ ALL UNITS MASTERED ★', width / 2, height - 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFlagTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 160;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#14b8a6');
  grad.addColorStop(1, '#0f766e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PY 100', width / 2, height * 0.42);

  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('END-SEM READY', width / 2, height * 0.74);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createExamPaperTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 340;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Top header
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('END-SEM EXAM: PYTHON', width / 2, 28);

  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Time: 3 Hrs | Max Marks: 100', width / 2, 45);

  ctx.strokeStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(18, 55);
  ctx.lineTo(width - 18, 55);
  ctx.stroke();

  // Simulated code & questions lines
  for (let y = 75; y < height - 30; y += 14) {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const lineW = (y * 37) % 70 + 120;
    ctx.moveTo(22, y);
    ctx.lineTo(22 + lineW, y);
    ctx.stroke();
  }

  // Grade stamp
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(width - 70, height - 60, 50, 32);
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.fillText('A+', width - 45, height - 38);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const radGrad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  radGrad.addColorStop(0, 'rgba(15, 7, 30, 0.65)');
  radGrad.addColorStop(0.5, 'rgba(15, 7, 30, 0.25)');
  radGrad.addColorStop(1, 'rgba(15, 7, 30, 0)');

  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
