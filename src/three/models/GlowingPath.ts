import * as THREE from 'three';

export class GlowingPath extends THREE.Group {
  public segments: {
    mesh: THREE.Mesh;
    mat: THREE.MeshStandardMaterial;
    curve: THREE.CatmullRomCurve3;
  }[] = [];
  public energyBeads: THREE.Mesh[] = [];
  public beadCurves: THREE.CatmullRomCurve3[] = [];
  public fullPathCurve: THREE.CatmullRomCurve3;

  constructor(islandPositions: [number, number, number][]) {
    super();

    // Island coordinates
    const p1 = new THREE.Vector3(...islandPositions[0]);
    const p2 = new THREE.Vector3(...islandPositions[1]);
    const p3 = new THREE.Vector3(...islandPositions[2]);
    const p4 = new THREE.Vector3(...islandPositions[3]);
    const p5 = new THREE.Vector3(...islandPositions[4]);

    // Construct intermediate control points with graceful aerial arcs
    const mid12 = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5).add(new THREE.Vector3(1.2, 0.9, 0));
    const mid23 = new THREE.Vector3().addVectors(p2, p3).multiplyScalar(0.5).add(new THREE.Vector3(-0.8, 1.4, -0.5));
    const mid34 = new THREE.Vector3().addVectors(p3, p4).multiplyScalar(0.5).add(new THREE.Vector3(1.5, 1.2, -0.8));
    const mid45 = new THREE.Vector3().addVectors(p4, p5).multiplyScalar(0.5).add(new THREE.Vector3(-1.0, 1.5, -0.6));

    const segmentPoints = [
      [p1.clone().add(new THREE.Vector3(0, 0.4, 0)), mid12, p2.clone().add(new THREE.Vector3(0, 0.4, 0))],
      [p2.clone().add(new THREE.Vector3(0, 0.4, 0)), mid23, p3.clone().add(new THREE.Vector3(0, 0.4, 0))],
      [p3.clone().add(new THREE.Vector3(0, 0.4, 0)), mid34, p4.clone().add(new THREE.Vector3(0, 0.4, 0))],
      [p4.clone().add(new THREE.Vector3(0, 0.4, 0)), mid45, p5.clone().add(new THREE.Vector3(0, 0.4, 0))],
    ];

    // Build the 4 path bridge segments
    segmentPoints.forEach((pts, segIdx) => {
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.16, 8, false);

      const isTealZone = segIdx >= 2;
      const baseEmissive = isTealZone ? 0x0d9488 : 0x7c3aed;

      const mat = new THREE.MeshStandardMaterial({
        color: isTealZone ? 0x14b8a6 : 0xa855f7,
        emissive: baseEmissive,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.7,
        transparent: true,
        opacity: 0.95,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, mat);
      tubeMesh.castShadow = true;
      tubeMesh.receiveShadow = true;
      this.add(tubeMesh);

      // Outer ethereal ribbon halo
      const outerRibbon = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.24, 6, false),
        new THREE.MeshBasicMaterial({
          color: isTealZone ? 0x2dd4bf : 0xd8b4fe,
          transparent: true,
          opacity: 0.22,
          wireframe: false,
        })
      );
      this.add(outerRibbon);

      this.segments.push({ mesh: tubeMesh, mat, curve });
      this.beadCurves.push(curve);
    });

    // Create 12 moving energy bead particles traveling along the glowing path
    const beadGeo = new THREE.SphereGeometry(0.12, 8, 8);
    for (let b = 0; b < 12; b++) {
      const beadMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfde047,
        emissiveIntensity: 1.0,
        roughness: 0.1,
      });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      this.energyBeads.push(bead);
      this.add(bead);
    }

    // Full combined curve for global camera or particle trajectories
    this.fullPathCurve = new THREE.CatmullRomCurve3([
      p1.clone().add(new THREE.Vector3(0, 0.4, 0)),
      mid12,
      p2.clone().add(new THREE.Vector3(0, 0.4, 0)),
      mid23,
      p3.clone().add(new THREE.Vector3(0, 0.4, 0)),
      mid34,
      p4.clone().add(new THREE.Vector3(0, 0.4, 0)),
      mid45,
      p5.clone().add(new THREE.Vector3(0, 0.4, 0)),
    ]);
  }

  /**
   * Lights up the glowing path up to the selected day (1 to 5)
   */
  public updateGlowProgress(activeDayId: number) {
    this.segments.forEach((seg, idx) => {
      // Segment idx corresponds to link between day (idx+1) and day (idx+2)
      // If activeDayId is >= idx + 2, this segment is fully illuminated!
      const isTargeted = activeDayId >= idx + 2;
      const isCurrentStep = activeDayId === idx + 1;

      if (isTargeted) {
        seg.mat.emissiveIntensity = 1.35;
        seg.mat.opacity = 1.0;
        seg.mat.color.setHex(idx >= 2 ? 0x2dd4bf : 0xd946ef);
        seg.mat.emissive.setHex(idx >= 2 ? 0x5eead4 : 0xf0abfc);
      } else if (isCurrentStep) {
        seg.mat.emissiveIntensity = 0.95;
        seg.mat.opacity = 0.9;
        seg.mat.color.setHex(idx >= 2 ? 0x14b8a6 : 0xa855f7);
        seg.mat.emissive.setHex(idx >= 2 ? 0x0d9488 : 0x7c3aed);
      } else {
        // Distant future segment
        seg.mat.emissiveIntensity = 0.35;
        seg.mat.opacity = 0.65;
        seg.mat.color.setHex(0x475569);
        seg.mat.emissive.setHex(0x334155);
      }
    });
  }

  public updateAnimation(elapsedTime: number, activeDayId: number) {
    // Pulse intensity slightly on active segments
    this.segments.forEach((seg, idx) => {
      if (activeDayId >= idx + 2) {
        seg.mat.emissiveIntensity = 1.25 + Math.sin(elapsedTime * 3.0 + idx) * 0.25;
      }
    });

    // Animate energy beads flowing along the path up to active day
    const maxActiveSegments = Math.min(Math.max(activeDayId - 1, 1), this.segments.length);
    this.energyBeads.forEach((bead, i) => {
      const segIndex = i % maxActiveSegments;
      const curve = this.beadCurves[segIndex];
      const speed = 0.35;
      const t = ((elapsedTime * speed + (i * 0.15)) % 1);
      const pt = curve.getPointAt(t);
      bead.position.copy(pt);
      bead.scale.setScalar(0.7 + Math.sin(elapsedTime * 4 + i) * 0.3);
    });
  }
}
