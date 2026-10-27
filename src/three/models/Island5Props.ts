import * as THREE from 'three';
import { createCheatSheetTexture, createFlagTexture } from '../textures';

export class Island5Props extends THREE.Group {
  public flagMesh: THREE.Mesh;
  public flagGeometry: THREE.PlaneGeometry;
  public pedestalGlow: THREE.PointLight;

  constructor() {
    super();

    // 1. Stepped Summit Terraces (Composite 3 tiers of stone rock leading to peak)
    const tiersGroup = new THREE.Group();
    tiersGroup.position.set(0, 0.25, 0);

    const summitRockMat = new THREE.MeshStandardMaterial({
      color: 0x115e59, // Rich deep teal rock
      roughness: 0.7,
      metalness: 0.15,
      flatShading: true,
    });
    const summitSnowMat = new THREE.MeshStandardMaterial({
      color: 0xccfbf1, // Pale teal-white summit crest
      roughness: 0.5,
      metalness: 0.1,
      flatShading: true,
    });

    // Tier 1 (Base platform)
    const tier1Geo = new THREE.CylinderGeometry(2.4, 2.7, 0.5, 8);
    const tier1 = new THREE.Mesh(tier1Geo, summitRockMat);
    tier1.position.y = 0.25;
    tier1.receiveShadow = true;
    tier1.castShadow = true;
    tiersGroup.add(tier1);

    // Tier 2 (Middle plateau)
    const tier2Geo = new THREE.CylinderGeometry(1.6, 1.9, 0.6, 8);
    const tier2 = new THREE.Mesh(tier2Geo, summitRockMat);
    tier2.position.y = 0.8;
    tier2.receiveShadow = true;
    tier2.castShadow = true;
    tiersGroup.add(tier2);

    // Tier 3 (Peak cap)
    const tier3Geo = new THREE.CylinderGeometry(0.9, 1.2, 0.5, 8);
    const tier3 = new THREE.Mesh(tier3Geo, summitSnowMat);
    tier3.position.y = 1.35;
    tier3.receiveShadow = true;
    tier3.castShadow = true;
    tiersGroup.add(tier3);

    this.add(tiersGroup);

    // 2. The Pedestal (Composite 5 parts: stepped base, crystal column, gold trim, angled reading desk, cheat sheet)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(-0.4, 1.85, 0.2);

    // Marble/crystal plinth base
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xf0fdfa,
      roughness: 0.2,
      metalness: 0.3,
    });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.15, 8), plinthMat);
    pedestalGroup.add(plinth);

    // Pillar column
    const colGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.75, 8);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x5eead4,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.6,
    });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.y = 0.45;
    col.castShadow = true;
    pedestalGroup.add(col);

    // Gold collar
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.2,
    });
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.08, 8), goldMat);
    collar.position.y = 0.86;
    pedestalGroup.add(collar);

    // Angled reading desk surface
    const deskGeo = new THREE.BoxGeometry(0.85, 0.06, 1.15);
    const desk = new THREE.Mesh(deskGeo, plinthMat);
    desk.position.set(0, 0.98, 0);
    desk.rotation.x = 0.45; // Tilted towards camera
    desk.castShadow = true;
    pedestalGroup.add(desk);

    // One-Page Cheat Sheet on the Pedestal
    const sheetGeo = new THREE.BoxGeometry(0.78, 0.02, 1.05);
    const sheetTex = createCheatSheetTexture();
    const sheetMat = new THREE.MeshStandardMaterial({
      map: sheetTex,
      roughness: 0.4,
      emissive: 0x0d9488,
      emissiveIntensity: 0.15,
    });
    const cheatSheet = new THREE.Mesh(sheetGeo, sheetMat);
    cheatSheet.position.set(0, 1.01, 0);
    cheatSheet.rotation.x = 0.45;
    cheatSheet.castShadow = true;
    pedestalGroup.add(cheatSheet);

    // Pedestal beacon light (calm illuminated summit glow)
    this.pedestalGlow = new THREE.PointLight(0x5eead4, 1.2, 4.0);
    this.pedestalGlow.position.set(0, 1.3, 0);
    pedestalGroup.add(this.pedestalGlow);

    this.add(pedestalGroup);

    // 3. Summit Flagpole & Animated Flag at the Top of the Summit (Composite 5 parts: stone socket, pole, finial, flag cloth, halyard rings)
    const flagGroup = new THREE.Group();
    flagGroup.position.set(0.65, 1.85, -0.4);

    // Stone socket base
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.2, 6), summitRockMat);
    socket.position.y = 0.1;
    flagGroup.add(socket);

    // Tall flag pole
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.85,
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.7;
    pole.castShadow = true;
    flagGroup.add(pole);

    // Gold finial ball on top of pole
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), goldMat);
    finial.position.y = 3.32;
    flagGroup.add(finial);

    // Flag Cloth Geometry (Plane with segments for ripple animation)
    this.flagGeometry = new THREE.PlaneGeometry(1.4, 0.85, 14, 8);
    const flagTex = createFlagTexture();
    const flagMat = new THREE.MeshStandardMaterial({
      map: flagTex,
      roughness: 0.6,
      side: THREE.DoubleSide,
      metalness: 0.1,
    });
    this.flagMesh = new THREE.Mesh(this.flagGeometry, flagMat);
    this.flagMesh.position.set(0.72, 2.7, 0);
    this.flagMesh.castShadow = true;
    flagGroup.add(this.flagMesh);

    this.add(flagGroup);
  }

  public updateAnimation(elapsedTime: number) {
    // Flag ripple cloth animation
    const pos = this.flagGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i); // x along width of flag
      const wave = Math.sin(elapsedTime * 4.5 + u * 3.5) * 0.08 * (u + 0.7);
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    this.flagGeometry.computeVertexNormals();

    // Beacon pulse
    this.pedestalGlow.intensity = 1.0 + Math.sin(elapsedTime * 2.0) * 0.3;
  }
}
