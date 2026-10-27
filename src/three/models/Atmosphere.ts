import * as THREE from 'three';

export class Atmosphere extends THREE.Group {
  public clouds: { mesh: THREE.Group; speed: number; startX: number }[] = [];
  public mistParticles: THREE.Points;
  public keyLight: THREE.DirectionalLight;
  public fillLight: THREE.HemisphereLight;
  public rimLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    super();

    // 1. Pastel Sunrise Sky Horizon & Fog
    // Sunrise palette: soft peach/gold into pastel lavender-indigo
    const skyColor = new THREE.Color('#382856'); // Deep sunrise purple horizon
    scene.background = skyColor;
    scene.fog = new THREE.FogExp2(0x382856, 0.016);

    // 2. Warm Sunrise Lighting Rig (≤ 3 shadow casters per Three.js guidelines)
    // Key light: Warm sunrise gold/amber
    this.keyLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    this.keyLight.position.set(18, 28, 22);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 80;
    this.keyLight.shadow.camera.left = -22;
    this.keyLight.shadow.camera.right = 22;
    this.keyLight.shadow.camera.top = 22;
    this.keyLight.shadow.camera.bottom = -22;
    this.keyLight.shadow.bias = -0.0004;
    this.keyLight.shadow.normalBias = 0.02;
    this.add(this.keyLight);

    // Fill light: Cool sky fill against warm ground bounce
    this.fillLight = new THREE.HemisphereLight(0xffdfba, 0x241838, 1.4);
    this.fillLight.position.set(0, 30, 0);
    this.add(this.fillLight);

    // Soft rim backlight to highlight island silhouettes against fog
    this.rimLight = new THREE.DirectionalLight(0xd8b4fe, 0.9);
    this.rimLight.position.set(-16, 12, -28);
    this.add(this.rimLight);

    // 3. Drifting Low-Poly Clouds (Composite 4–7 part fluffy groups)
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xfff1f2, // Soft pastel blush white
      emissive: 0xfde047,
      emissiveIntensity: 0.08,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
    });

    const cloudConfigs = [
      { x: -14, y: 11, z: 8, scale: 1.4, speed: 0.08 },
      { x: 16, y: 14, z: 2, scale: 1.8, speed: 0.06 },
      { x: -8, y: 16, z: -16, scale: 2.1, speed: 0.07 },
      { x: 12, y: 9, z: -22, scale: 1.6, speed: 0.05 },
      { x: -18, y: 12, z: -8, scale: 1.7, speed: 0.09 },
      { x: 4, y: 17, z: 14, scale: 1.3, speed: 0.06 },
    ];

    cloudConfigs.forEach((cfg) => {
      const cloudGroup = new THREE.Group();
      cloudGroup.position.set(cfg.x, cfg.y, cfg.z);

      // Assemble 5 distinct overlapping low-poly spheres
      const sphereGeo = new THREE.DodecahedronGeometry(1.0, 1);
      const offsets = [
        [0, 0, 0, 1.0],
        [-0.8, -0.2, 0.2, 0.75],
        [0.85, -0.15, -0.1, 0.8],
        [-0.3, 0.45, 0.1, 0.65],
        [0.4, 0.35, -0.2, 0.6],
      ];

      offsets.forEach(([ox, oy, oz, s]) => {
        const puff = new THREE.Mesh(sphereGeo, cloudMat);
        puff.position.set(ox, oy, oz);
        puff.scale.setScalar(s);
        puff.castShadow = true;
        cloudGroup.add(puff);
      });

      cloudGroup.scale.setScalar(cfg.scale);
      this.clouds.push({
        mesh: cloudGroup,
        speed: cfg.speed,
        startX: cfg.x,
      });
      this.add(cloudGroup);
    });

    // 4. Floating Mist & Gentle Golden Sparkles between islands
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Scatter in the corridor between Island 1 (z: 16) and Island 5 (z: -25)
      particlePos[i * 3 + 0] = (Math.random() - 0.5) * 34;
      particlePos[i * 3 + 1] = Math.random() * 12 - 2;
      particlePos[i * 3 + 2] = Math.random() * 50 - 28;
      particleScales[i] = 0.5 + Math.random() * 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    // Canvas circular soft sparkle particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    pGrad.addColorStop(0.4, 'rgba(232, 121, 249, 0.4)');
    pGrad.addColorStop(1, 'rgba(232, 121, 249, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      map: pTex,
      size: 0.65,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mistParticles = new THREE.Points(particleGeo, particleMat);
    this.add(this.mistParticles);
  }

  public updateAnimation(delta: number, elapsedTime: number) {
    // Drifting clouds across sky
    this.clouds.forEach((c) => {
      c.mesh.position.x += c.speed * delta * 8;
      if (c.mesh.position.x > 32) {
        c.mesh.position.x = -32;
      }
    });

    // Gentle mist undulation
    const pos = this.mistParticles.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const origY = pos.getY(i);
      pos.setY(i, origY + Math.sin(elapsedTime * 0.8 + i) * 0.004);
    }
    pos.needsUpdate = true;
  }
}
