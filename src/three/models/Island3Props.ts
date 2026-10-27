import * as THREE from 'three';
import { createTextBadgeTexture } from '../textures';

export class Island3Props extends THREE.Group {
  public switchLevers: THREE.Mesh[] = [];
  public trackCart: THREE.Mesh;

  constructor() {
    super();

    // Central junction monument (Stone sign pointing to Left Bridge and Right Bridge)
    const junction = new THREE.Group();
    junction.position.set(0, 0.25, 1.8);

    const postGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.2, 8);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x4c1d95,
      roughness: 0.6,
      flatShading: true,
    });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 0.6;
    post.castShadow = true;
    junction.add(post);

    const forkSignGeo = new THREE.BoxGeometry(1.6, 0.35, 0.1);
    const forkSignTex = createTextBadgeTexture('← BRANCHES | LOOPS →', {
      bgColor: '#3b0764',
      borderColor: '#c084fc',
      textColor: '#fdf4ff',
      fontSize: 26,
      width: 512,
      height: 120,
    });
    const forkSignMat = new THREE.MeshStandardMaterial({
      map: forkSignTex,
      roughness: 0.4,
    });
    const forkSign = new THREE.Mesh(forkSignGeo, forkSignMat);
    forkSign.position.set(0, 1.15, 0);
    forkSign.castShadow = true;
    junction.add(forkSign);

    this.add(junction);

    // ========================================================
    // 1. LEFT BRIDGE: Four Gates (if, if-else, nested if, elif)
    // ========================================================
    const leftBridge = new THREE.Group();
    leftBridge.position.set(-2.2, 0.25, 0);

    // Stone pathway base curving forward-left
    const pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.5, 0, 1.5),
      new THREE.Vector3(0.5, 0.05, 0.6),
      new THREE.Vector3(-0.4, 0.1, -0.6),
      new THREE.Vector3(-1.4, 0.15, -1.8),
    ]);
    const pathGeo = new THREE.TubeGeometry(pathCurve, 20, 0.45, 6, false);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x581c87,
      roughness: 0.75,
      flatShading: true,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.scale.set(1, 0.25, 1);
    pathMesh.receiveShadow = true;
    leftBridge.add(pathMesh);

    // Four Gates: if, if-else, nested if, elif
    const gateConfigs = [
      { text: 'if', pos: [1.2, 0, 1.2], rotY: 0.4 },
      { text: 'if-else', pos: [0.4, 0.05, 0.3], rotY: 0.3 },
      { text: 'nested if', pos: [-0.4, 0.1, -0.6], rotY: 0.1 },
      { text: 'elif', pos: [-1.2, 0.15, -1.5], rotY: 0.0 },
    ];

    gateConfigs.forEach((cfg, idx) => {
      const gateGroup = new THREE.Group();
      gateGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      gateGroup.rotation.y = cfg.rotY;

      // Left & right stone pillars
      const pillarGeo = new THREE.BoxGeometry(0.16, 1.2, 0.16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x3b0764,
        roughness: 0.6,
        metalness: 0.2,
      });
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-0.48, 0.6, 0);
      pLeft.castShadow = true;
      gateGroup.add(pLeft);

      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pRight.position.set(0.48, 0.6, 0);
      pRight.castShadow = true;
      gateGroup.add(pRight);

      // Top lintel / arch
      const lintelGeo = new THREE.BoxGeometry(1.25, 0.2, 0.2);
      const lintel = new THREE.Mesh(lintelGeo, pillarMat);
      lintel.position.set(0, 1.25, 0);
      lintel.castShadow = true;
      gateGroup.add(lintel);

      // Extra arch for "nested if" gate (composite feel)
      if (idx === 2) {
        const subArchGeo = new THREE.TorusGeometry(0.35, 0.06, 6, 12, Math.PI);
        const subArch = new THREE.Mesh(subArchGeo, pillarMat);
        subArch.position.set(0, 1.15, 0);
        gateGroup.add(subArch);
      }

      // Gate Label Banner Plate
      const bannerTex = createTextBadgeTexture(cfg.text, {
        bgColor: '#2e1065',
        borderColor: '#a855f7',
        textColor: '#ffffff',
        fontSize: 38,
        width: 320,
        height: 120,
        monospace: true,
      });
      const bannerMat = new THREE.MeshStandardMaterial({
        map: bannerTex,
        roughness: 0.3,
        metalness: 0.5,
        emissive: 0x6b21a8,
        emissiveIntensity: 0.3,
      });
      const bannerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.3, 0.06), bannerMat);
      bannerMesh.position.set(0, 1.48, 0);
      bannerMesh.castShadow = true;
      gateGroup.add(bannerMesh);

      // Portal energy glow beneath arch
      const glowGeo = new THREE.PlaneGeometry(0.7, 0.9);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const portalGlow = new THREE.Mesh(glowGeo, glowMat);
      portalGlow.position.set(0, 0.6, 0);
      gateGroup.add(portalGlow);

      leftBridge.add(gateGroup);
    });

    this.add(leftBridge);

    // ========================================================
    // 2. RIGHT BRIDGE: Looping Circular Track (while & for) + 3 Switches
    // ========================================================
    const rightBridge = new THREE.Group();
    rightBridge.position.set(2.4, 0.25, -0.4);

    // Pathway leading to loop
    const rightPathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 0, 1.5),
      new THREE.Vector3(-0.8, 0.05, 0.8),
      new THREE.Vector3(0, 0.1, 0),
    ]);
    const rightPathGeo = new THREE.TubeGeometry(rightPathCurve, 16, 0.45, 6, false);
    const rightPathMesh = new THREE.Mesh(rightPathGeo, pathMat);
    rightPathMesh.scale.set(1, 0.25, 1);
    rightBridge.add(rightPathMesh);

    // Looping Circular Track (Torus ring elevated)
    const trackRadius = 1.35;
    const trackTubeRadius = 0.08;
    const trackGeo = new THREE.TorusGeometry(trackRadius, trackTubeRadius, 8, 32);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.8,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = Math.PI / 2; // Flat horizontal loop
    trackMesh.position.set(0.6, 0.45, -0.8);
    trackMesh.castShadow = true;
    rightBridge.add(trackMesh);

    // Outer support rail
    const outerRailGeo = new THREE.TorusGeometry(trackRadius + 0.16, 0.03, 6, 32);
    const outerRailMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      roughness: 0.4,
      metalness: 0.7,
    });
    const outerRail = new THREE.Mesh(outerRailGeo, outerRailMat);
    outerRail.rotation.x = Math.PI / 2;
    outerRail.position.set(0.6, 0.45, -0.8);
    rightBridge.add(outerRail);

    // 4 Support struts holding loop
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const strutGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.45, 6);
      const strut = new THREE.Mesh(strutGeo, outerRailMat);
      strut.position.set(
        0.6 + Math.cos(ang) * trackRadius,
        0.22,
        -0.8 + Math.sin(ang) * trackRadius
      );
      strut.castShadow = true;
      rightBridge.add(strut);
    }

    // Circular Track Labels: "while" and "for" signboards on the loop
    const whileBannerTex = createTextBadgeTexture('while loop ↺', {
      bgColor: '#4c1d95',
      borderColor: '#e879f9',
      textColor: '#ffffff',
      fontSize: 32,
      width: 320,
      height: 110,
      monospace: true,
    });
    const whileBannerMat = new THREE.MeshStandardMaterial({ map: whileBannerTex });
    const whileSign = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.26, 0.04), whileBannerMat);
    whileSign.position.set(0.6, 1.15, -0.8 - trackRadius);
    rightBridge.add(whileSign);

    const forBannerTex = createTextBadgeTexture('for i in range() ↻', {
      bgColor: '#4c1d95',
      borderColor: '#e879f9',
      textColor: '#ffffff',
      fontSize: 28,
      width: 360,
      height: 110,
      monospace: true,
    });
    const forBannerMat = new THREE.MeshStandardMaterial({ map: forBannerTex });
    const forSign = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.26, 0.04), forBannerMat);
    forSign.position.set(0.6, 1.15, -0.8 + trackRadius);
    rightBridge.add(forSign);

    // Moving glowing cart/orb traveling on loop track
    const cartGeo = new THREE.DodecahedronGeometry(0.14, 0);
    const cartMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
    });
    this.trackCart = new THREE.Mesh(cartGeo, cartMat);
    this.trackCart.position.set(0.6 + trackRadius, 0.52, -0.8);
    rightBridge.add(this.trackCart);

    // Three Small Switches beside track labeled: "break", "continue", and "pass"
    const switches = [
      { text: 'break', x: -0.4, z: 0.6, color: '#ef4444' }, // Red
      { text: 'continue', x: 0.4, z: 0.6, color: '#eab308' }, // Amber
      { text: 'pass', x: 1.2, z: 0.6, color: '#3b82f6' }, // Blue
    ];

    switches.forEach((sw) => {
      const swGroup = new THREE.Group();
      swGroup.position.set(sw.x, 0.05, sw.z);

      // Switch metal box base
      const boxGeo = new THREE.BoxGeometry(0.5, 0.22, 0.45);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.4,
        metalness: 0.7,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.y = 0.11;
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      swGroup.add(boxMesh);

      // Pivot hinge
      const hingeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8);
      const hinge = new THREE.Mesh(hingeGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
      hinge.rotation.z = Math.PI / 2;
      hinge.position.set(0, 0.22, 0);
      swGroup.add(hinge);

      // Lever rod + knob
      const leverGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.32, 6);
      const leverMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.85,
        roughness: 0.2,
      });
      const lever = new THREE.Mesh(leverGeo, leverMat);
      lever.position.set(0, 0.35, 0);
      lever.rotation.x = -0.35; // Tilted switch
      lever.castShadow = true;

      const knobGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const knobMat = new THREE.MeshStandardMaterial({
        color: sw.color,
        emissive: sw.color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const knob = new THREE.Mesh(knobGeo, knobMat);
      knob.position.set(0, 0.16, 0);
      lever.add(knob);

      swGroup.add(lever);
      this.switchLevers.push(lever);

      // Switch text label plate
      const labelTex = createTextBadgeTexture(sw.text, {
        bgColor: '#0f172a',
        borderColor: sw.color,
        textColor: '#ffffff',
        fontSize: 34,
        width: 256,
        height: 100,
        monospace: true,
      });
      const labelMat = new THREE.MeshStandardMaterial({ map: labelTex });
      const labelPlate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.03), labelMat);
      labelPlate.position.set(0, 0.11, 0.24);
      swGroup.add(labelPlate);

      rightBridge.add(swGroup);
    });

    this.add(rightBridge);
  }

  public updateAnimation(elapsedTime: number) {
    // Loop cart circulating on track
    const trackRadius = 1.35;
    const angle = elapsedTime * 1.6;
    this.trackCart.position.set(
      0.6 + Math.cos(angle) * trackRadius,
      0.52 + Math.sin(angle * 2) * 0.04,
      -0.8 + Math.sin(angle) * trackRadius
    );

    // Subtle switch toggle wobble
    this.switchLevers.forEach((lever, idx) => {
      lever.rotation.x = -0.35 + Math.sin(elapsedTime * 2 + idx * 2.1) * 0.08;
    });
  }
}
