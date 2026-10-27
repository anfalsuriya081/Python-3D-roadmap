import * as THREE from 'three';
import { createDataTypeCubeTexture, createOperatorTileTexture } from '../textures';

export class Island2Props extends THREE.Group {
  public typeCubes: THREE.Group[] = [];
  public initialCubePositions: { x: number; y: number; z: number }[] = [];

  constructor() {
    super();

    // 1. The Workbench (Composite 8 parts: tabletop, 4 chamfered legs, 2 cross braces, metal vice)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(-1.0, 0.25, 0);

    // Tabletop
    const topGeo = new THREE.BoxGeometry(2.6, 0.16, 1.4);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x5c2b16, // dark oak
      roughness: 0.6,
      metalness: 0.1,
    });
    const tableTop = new THREE.Mesh(topGeo, topMat);
    tableTop.position.y = 1.0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    benchGroup.add(tableTop);

    // 4 Legs
    const legGeo = new THREE.BoxGeometry(0.14, 1.0, 0.14);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x3e1c0d,
      roughness: 0.7,
      metalness: 0.1,
    });
    const legPositions = [
      [-1.15, 0.5, -0.55],
      [1.15, 0.5, -0.55],
      [-1.15, 0.5, 0.55],
      [1.15, 0.5, 0.55],
    ];

    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      leg.receiveShadow = true;
      benchGroup.add(leg);
    });

    // Lower cross braces
    const braceGeo = new THREE.BoxGeometry(2.3, 0.08, 0.08);
    const brace = new THREE.Mesh(braceGeo, legMat);
    brace.position.set(0, 0.35, -0.55);
    benchGroup.add(brace);

    const braceFront = new THREE.Mesh(braceGeo, legMat);
    braceFront.position.set(0, 0.35, 0.55);
    benchGroup.add(braceFront);

    // Metal vice clamped to side
    const viceMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.85,
    });
    const viceBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.2), viceMat);
    viceBody.position.set(-1.3, 1.05, 0.4);
    benchGroup.add(viceBody);

    const screwHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), viceMat);
    screwHandle.rotation.z = Math.PI / 2;
    screwHandle.position.set(-1.42, 1.05, 0.4);
    benchGroup.add(screwHandle);

    this.add(benchGroup);

    // 2. Four Glowing Data Type Blocks: int, float, str, bool
    const typeConfigs = [
      { name: 'int', color: '#38bdf8', hex: 0x38bdf8, pos: [-0.85, 1.35, -0.2] },
      { name: 'float', color: '#34d399', hex: 0x34d399, pos: [-0.3, 1.35, 0.2] },
      { name: 'str', color: '#fbbf24', hex: 0xfbbf24, pos: [0.3, 1.35, -0.2] },
      { name: 'bool', color: '#f472b6', hex: 0xf472b6, pos: [0.85, 1.35, 0.2] },
    ];

    typeConfigs.forEach((cfg, idx) => {
      const cubeGroup = new THREE.Group();
      cubeGroup.position.set(cfg.pos[0] + benchGroup.position.x, cfg.pos[1], cfg.pos[2] + benchGroup.position.z);

      const cubeSize = 0.42;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const tex = createDataTypeCubeTexture(cfg.name, cfg.color);

      const cubeMat = new THREE.MeshStandardMaterial({
        map: tex,
        emissive: cfg.hex,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.5,
      });

      const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
      cubeMesh.castShadow = true;
      cubeGroup.add(cubeMesh);

      // Subtle light glow
      const light = new THREE.PointLight(cfg.hex, 0.8, 2.5);
      light.position.set(0, 0.1, 0);
      cubeGroup.add(light);

      this.typeCubes.push(cubeGroup);
      this.initialCubePositions.push({
        x: cubeGroup.position.x,
        y: cubeGroup.position.y,
        z: cubeGroup.position.z,
      });
      this.add(cubeGroup);
    });

    // 3. Smaller Teal Platform Beside Workbench with 6 Operator Tiles
    const tealPlatform = new THREE.Group();
    tealPlatform.position.set(3.4, -0.2, 0.3);

    // Teal outcrop rock body (faceted cylinder + inverted cone)
    const tGrassGeo = new THREE.CylinderGeometry(1.9, 2.05, 0.3, 8);
    const tGrassMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.6,
      metalness: 0.1,
      flatShading: true,
    });
    const tGrass = new THREE.Mesh(tGrassGeo, tGrassMat);
    tGrass.position.y = 0;
    tGrass.receiveShadow = true;
    tGrass.castShadow = true;
    tealPlatform.add(tGrass);

    const tRockGeo = new THREE.ConeGeometry(1.9, 2.2, 8);
    const tRockMat = new THREE.MeshStandardMaterial({
      color: 0x115e59,
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true,
    });
    const tRock = new THREE.Mesh(tRockGeo, tRockMat);
    tRock.rotation.x = Math.PI;
    tRock.position.y = -1.25;
    tRock.castShadow = true;
    tealPlatform.add(tRock);

    // Stepping stones bridge connecting main purple island to teal platform
    for (let s = 0; s < 3; s++) {
      const stepStone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.32, 0.15, 6),
        new THREE.MeshStandardMaterial({
          color: 0x2dd4bf,
          roughness: 0.7,
          flatShading: true,
        })
      );
      const ratio = (s + 1) / 4;
      stepStone.position.set(1.5 + ratio * 1.5, -0.05, 0.15 + (s % 2 === 0 ? 0.2 : -0.2));
      stepStone.castShadow = true;
      this.add(stepStone);
    }

    // 6 Operator Tiles laid out neatly in 2 rows x 3 columns on teal platform:
    // 1: "+ - * / // %"
    // 2: "== !="
    // 3: "and or not"
    // 4: "+= -="
    // 5: "in"
    // 6: "is"
    const operators = [
      { text: '+ - * / // %', x: -1.0, z: -0.6 },
      { text: '== !=', x: 0, z: -0.6 },
      { text: 'and or not', x: 1.0, z: -0.6 },
      { text: '+= -=', x: -1.0, z: 0.5 },
      { text: 'in', x: 0, z: 0.5 },
      { text: 'is', x: 1.0, z: 0.5 },
    ];

    operators.forEach((op) => {
      const tileGroup = new THREE.Group();
      tileGroup.position.set(op.x, 0.2, op.z);

      // Stone plinth base
      const plinthGeo = new THREE.BoxGeometry(0.85, 0.12, 0.75);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0x134e4a,
        roughness: 0.7,
        metalness: 0.1,
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.receiveShadow = true;
      tileGroup.add(plinth);

      // Top tile plate with custom operator text texture
      const tileTex = createOperatorTileTexture(op.text);
      const tilePlateMat = new THREE.MeshStandardMaterial({
        map: tileTex,
        roughness: 0.3,
        metalness: 0.4,
        emissive: 0x0f766e,
        emissiveIntensity: 0.25,
      });
      const tilePlateGeo = new THREE.BoxGeometry(0.78, 0.08, 0.68);
      const tilePlate = new THREE.Mesh(tilePlateGeo, tilePlateMat);
      tilePlate.position.y = 0.09;
      tilePlate.castShadow = true;
      tileGroup.add(tilePlate);

      tealPlatform.add(tileGroup);
    });

    this.add(tealPlatform);
  }

  public updateAnimation(elapsedTime: number) {
    // Gentle floating bob & rotation on data type blocks
    this.typeCubes.forEach((cube, idx) => {
      const initial = this.initialCubePositions[idx];
      cube.position.y = initial.y + Math.sin(elapsedTime * 2.2 + idx * 1.5) * 0.06;
      cube.rotation.y = Math.sin(elapsedTime * 0.8 + idx) * 0.15;
    });
  }
}
