import * as THREE from 'three';
import { createFloatingLabelTexture } from '../textures';

export class Island1Props extends THREE.Group {
  public floatingSprites: THREE.Sprite[] = [];

  constructor() {
    super();

    // 1. Signpost Model (Composite 6 parts: base stone, wooden post, 2 direction arrows, wooden roof cap, brass lamp)
    const signpostGroup = new THREE.Group();
    signpostGroup.position.set(-1.2, 0.25, 0.8);

    // Stone base
    const baseGeo = new THREE.DodecahedronGeometry(0.3, 0);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x4c1d95,
      roughness: 0.8,
      flatShading: true,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.scale.set(1.2, 0.6, 1.2);
    baseMesh.castShadow = true;
    signpostGroup.add(baseMesh);

    // Wooden post
    const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.8, 8);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // rich wood
      roughness: 0.7,
      metalness: 0.05,
    });
    const postMesh = new THREE.Mesh(postGeo, woodMat);
    postMesh.position.y = 0.9;
    postMesh.castShadow = true;
    signpostGroup.add(postMesh);

    // Arrow sign 1: "UNIT I ->"
    const signMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.6,
      metalness: 0.1,
    });
    const signGeo = new THREE.BoxGeometry(0.85, 0.22, 0.06);
    const sign1 = new THREE.Mesh(signGeo, signMat);
    sign1.position.set(0.25, 1.45, 0);
    sign1.rotation.y = 0.2;
    sign1.castShadow = true;
    signpostGroup.add(sign1);

    // Arrow pointer tip (triangle/wedge)
    const arrowTipGeo = new THREE.ConeGeometry(0.14, 0.24, 4);
    const arrowTip = new THREE.Mesh(arrowTipGeo, signMat);
    arrowTip.position.set(0.72, 1.45, 0.05);
    arrowTip.rotation.z = -Math.PI / 2;
    arrowTip.rotation.y = 0.2;
    signpostGroup.add(arrowTip);

    // Arrow sign 2: "ROADMAP"
    const sign2 = new THREE.Mesh(signGeo, signMat);
    sign2.position.set(-0.25, 1.15, 0.02);
    sign2.rotation.y = -0.3;
    sign2.castShadow = true;
    signpostGroup.add(sign2);

    // Top lantern / brass finial
    const lampGeo = new THREE.OctahedronGeometry(0.12, 0);
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(0, 1.88, 0);
    signpostGroup.add(lamp);

    this.add(signpostGroup);

    // 2. Book Stack (Composite 9 parts: 3 books with spine, pages, covers + bookmark ribbon)
    const bookStackGroup = new THREE.Group();
    bookStackGroup.position.set(1.1, 0.25, -0.4);

    const bookColors = [0x581c87, 0x0284c7, 0x15803d, 0x9333ea]; // Deep purple, blue, green, violet
    const bookSizes = [
      { w: 0.9, d: 0.65, h: 0.14, rot: 0.1 },
      { w: 0.82, d: 0.6, h: 0.12, rot: -0.15 },
      { w: 0.76, d: 0.55, h: 0.11, rot: 0.25 },
      { w: 0.7, d: 0.5, h: 0.1, rot: -0.05 },
    ];

    let currentY = 0.07;
    bookSizes.forEach((b, idx) => {
      const bookSubGroup = new THREE.Group();
      bookSubGroup.position.set(0, currentY, 0);
      bookSubGroup.rotation.y = b.rot;

      // Cover
      const coverMat = new THREE.MeshStandardMaterial({
        color: bookColors[idx],
        roughness: 0.4,
        metalness: 0.15,
      });
      const coverGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const coverMesh = new THREE.Mesh(coverGeo, coverMat);
      coverMesh.castShadow = true;
      coverMesh.receiveShadow = true;
      bookSubGroup.add(coverMesh);

      // Pages inset
      const pageMat = new THREE.MeshStandardMaterial({
        color: 0xfef3c7, // ivory pages
        roughness: 0.9,
        metalness: 0.0,
      });
      const pageGeo = new THREE.BoxGeometry(b.w - 0.06, b.h - 0.03, b.d - 0.05);
      const pageMesh = new THREE.Mesh(pageGeo, pageMat);
      pageMesh.position.set(0.02, 0, 0);
      bookSubGroup.add(pageMesh);

      // Gold spine ribs on bottom book
      if (idx === 0) {
        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          roughness: 0.3,
          metalness: 0.8,
        });
        const ribGeo = new THREE.BoxGeometry(0.04, b.h + 0.02, b.d + 0.02);
        const rib1 = new THREE.Mesh(ribGeo, goldMat);
        rib1.position.set(-b.w / 2, 0, 0);
        bookSubGroup.add(rib1);
      }

      bookStackGroup.add(bookSubGroup);
      currentY += b.h + 0.01;
    });

    // Hanging Bookmark Ribbon
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red bookmark ribbon
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const ribbonGeo = new THREE.PlaneGeometry(0.08, 0.35);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.set(0.35, currentY - 0.08, 0.22);
    ribbonMesh.rotation.x = 0.4;
    bookStackGroup.add(ribbonMesh);

    this.add(bookStackGroup);

    // 3. Floating Topic Labels (User requested 5 floating labels)
    // 1: Programming languages
    // 2: History and features
    // 3: Installing Python and IDE
    // 4: Program structure
    // 5: Keywords and identifiers
    const labels = [
      { text: 'Programming languages', pos: [-2.2, 1.8, 0.5] },
      { text: 'History and features', pos: [-1.8, 2.5, -1.2] },
      { text: 'Installing Python & IDE', pos: [0.2, 2.8, -1.8] },
      { text: 'Program structure', pos: [1.9, 2.4, -0.9] },
      { text: 'Keywords and identifiers', pos: [2.2, 1.7, 0.8] },
    ];

    labels.forEach((lbl) => {
      const tex = createFloatingLabelTexture(lbl.text, 'purple');
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(2.4, 0.52, 1);
      sprite.position.set(lbl.pos[0], lbl.pos[1], lbl.pos[2]);
      sprite.renderOrder = 500;
      this.floatingSprites.push(sprite);
      this.add(sprite);
    });
  }

  public updateAnimation(elapsedTime: number) {
    // Subtle float oscillation on labels
    this.floatingSprites.forEach((sprite, idx) => {
      const baseY = [1.8, 2.5, 2.8, 2.4, 1.7][idx] || 2.0;
      sprite.position.y = baseY + Math.sin(elapsedTime * 1.8 + idx * 1.2) * 0.08;
    });
  }
}
