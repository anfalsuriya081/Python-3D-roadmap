import * as THREE from 'three';
import { createExamPaperTexture, createTimerDialTexture } from '../textures';

export class Island4Props extends THREE.Group {
  public timerHand: THREE.Mesh;
  public papersGroup: THREE.Group;

  constructor() {
    super();

    // 1. Study Desk (Composite 8 parts: tabletop, 4 legs, drawer cabinet, 2 handles, footrest)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0.25, 0);

    const woodDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // modern sleek slate wood
      roughness: 0.5,
      metalness: 0.1,
    });
    const woodLightMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Tabletop
    const topGeo = new THREE.BoxGeometry(2.4, 0.14, 1.4);
    const topMesh = new THREE.Mesh(topGeo, woodDarkMat);
    topMesh.position.y = 1.0;
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    deskGroup.add(topMesh);

    // Left legs
    const legGeo = new THREE.BoxGeometry(0.12, 1.0, 0.12);
    const leg1 = new THREE.Mesh(legGeo, woodDarkMat);
    leg1.position.set(-1.05, 0.5, -0.55);
    leg1.castShadow = true;
    deskGroup.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, woodDarkMat);
    leg2.position.set(-1.05, 0.5, 0.55);
    leg2.castShadow = true;
    deskGroup.add(leg2);

    // Right drawer cabinet pedestal
    const drawerCabGeo = new THREE.BoxGeometry(0.75, 0.9, 1.25);
    const drawerCab = new THREE.Mesh(drawerCabGeo, woodLightMat);
    drawerCab.position.set(0.75, 0.45, 0);
    drawerCab.castShadow = true;
    drawerCab.receiveShadow = true;
    deskGroup.add(drawerCab);

    // Brass handles on drawers
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    for (let d = 0; d < 2; d++) {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.05), handleMat);
      handle.position.set(0.75, 0.65 - d * 0.35, 0.64);
      deskGroup.add(handle);
    }

    // Footrest beam
    const footrestGeo = new THREE.BoxGeometry(1.4, 0.06, 0.06);
    const footrest = new THREE.Mesh(footrestGeo, woodDarkMat);
    footrest.position.set(-0.2, 0.25, -0.4);
    deskGroup.add(footrest);

    this.add(deskGroup);

    // 2. Stacked Exam Papers (Composite 6 parts: 4 stacked paper layers + top printed exam paper + pencil)
    this.papersGroup = new THREE.Group();
    this.papersGroup.position.set(-0.45, 1.33, 0.1);
    this.papersGroup.rotation.y = 0.15;

    const paperColors = [0xe2e8f0, 0xf1f5f9, 0xffffff, 0xf8fafc];
    for (let p = 0; p < 4; p++) {
      const pGeo = new THREE.BoxGeometry(0.75, 0.015, 0.95);
      const pMat = new THREE.MeshStandardMaterial({
        color: paperColors[p],
        roughness: 0.9,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set((p % 2 === 0 ? 0.02 : -0.02), p * 0.016, (p % 2 === 0 ? -0.01 : 0.01));
      pMesh.rotation.y = (p - 2) * 0.04;
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      this.papersGroup.add(pMesh);
    }

    // Top printed exam paper
    const topPaperGeo = new THREE.BoxGeometry(0.75, 0.012, 0.95);
    const topPaperTex = createExamPaperTexture();
    const topPaperMat = new THREE.MeshStandardMaterial({
      map: topPaperTex,
      roughness: 0.8,
    });
    const topPaper = new THREE.Mesh(topPaperGeo, topPaperMat);
    topPaper.position.y = 4 * 0.016 + 0.006;
    topPaper.castShadow = true;
    this.papersGroup.add(topPaper);

    // Yellow exam pencil
    const pencilMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const pencilGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6);
    const pencil = new THREE.Mesh(pencilGeo, pencilMat);
    pencil.rotation.z = Math.PI / 2;
    pencil.rotation.y = 0.4;
    pencil.position.set(0.2, 4 * 0.016 + 0.02, 0.35);
    pencil.castShadow = true;
    this.papersGroup.add(pencil);

    this.add(this.papersGroup);

    // 3. Desk Timer (Composite 5 parts: bell base, cylindrical casing, clock face dial, rotating tick hand, top button)
    const timerGroup = new THREE.Group();
    timerGroup.position.set(0.65, 1.33, -0.3);

    // Timer metallic casing
    const casingGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.28, 16);
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.85,
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.castShadow = true;
    timerGroup.add(casing);

    // Dial face
    const dialTex = createTimerDialTexture();
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const dialGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16);
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.position.y = 0.14;
    dial.rotation.y = Math.PI / 4;
    timerGroup.add(dial);

    // Rotating Hand
    const handGeo = new THREE.BoxGeometry(0.02, 0.02, 0.16);
    const handMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
    });
    this.timerHand = new THREE.Mesh(handGeo, handMat);
    this.timerHand.position.set(0, 0.16, 0.06);
    timerGroup.add(this.timerHand);

    // Top push-down start button
    const btnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.3 });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0, 0.18, 0);
    timerGroup.add(btn);

    // Subtle blue dial glow
    const dialLight = new THREE.PointLight(0x38bdf8, 0.7, 1.8);
    dialLight.position.set(0, 0.3, 0);
    timerGroup.add(dialLight);

    this.add(timerGroup);

    // 4. Study Desk Lamp (Composite 4 parts: circular base, curved stem, cone shade, warm bulb glow)
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.95, 1.33, -0.45);

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.8,
      roughness: 0.25,
    });

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.04, 16), brassMat);
    lampBase.castShadow = true;
    lampGroup.add(lampBase);

    // Arched pole
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.75, 8);
    const stem = new THREE.Mesh(stemGeo, brassMat);
    stem.position.set(0, 0.38, 0);
    stem.rotation.z = -0.2;
    lampGroup.add(stem);

    // Lamp shade cone
    const shadeGeo = new THREE.ConeGeometry(0.2, 0.22, 12, 1, true);
    const shade = new THREE.Mesh(shadeGeo, brassMat);
    shade.position.set(0.15, 0.72, 0);
    shade.rotation.z = 2.4;
    shade.castShadow = true;
    lampGroup.add(shade);

    // Warm desk light
    const lampLight = new THREE.PointLight(0xfef08a, 0.9, 2.5);
    lampLight.position.set(0.2, 0.65, 0);
    lampGroup.add(lampLight);

    this.add(lampGroup);
  }

  public updateAnimation(elapsedTime: number) {
    // Timer hand rotates continuously like an active stopwatch
    this.timerHand.rotation.y = elapsedTime * 2.5;
  }
}
