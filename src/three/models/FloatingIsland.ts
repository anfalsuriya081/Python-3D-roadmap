import * as THREE from 'three';
import { createContactShadowTexture, createTextBadgeTexture } from '../textures';

export interface FloatingIslandOptions {
  radius?: number;
  height?: number;
  theme?: 'purple' | 'teal';
  title?: string;
  subtitle?: string;
  dayBadge?: string;
  hasCrystals?: boolean;
}

export class FloatingIsland extends THREE.Group {
  public islandMesh: THREE.Mesh;
  public grassMesh: THREE.Mesh;
  public shadowPlane: THREE.Mesh;
  public titleSprite: THREE.Sprite | null = null;
  public topY: number = 0;

  constructor(options: FloatingIslandOptions = {}) {
    super();

    const radius = options.radius || 4;
    const height = options.height || 3.5;
    const isPurple = options.theme !== 'teal';

    // Theme palette
    const grassColor = isPurple ? 0x7e22ce : 0x0f766e;
    const grassEdgeColor = isPurple ? 0x9333ea : 0x14b8a6;
    const rockColor = isPurple ? 0x3b185f : 0x134e4a;
    const rockUndersideColor = isPurple ? 0x240e3b : 0x0a2d2a;
    const crystalColor = isPurple ? 0xc084fc : 0x5eead4;

    // 1. Top Grass Surface with faceted low-poly look (Cylinder with low segments)
    const grassGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 0.45, 9);
    // Perturb vertices slightly for organic low-poly feel
    const posAttr = grassGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      if (y > 0) {
        // top vertices
        posAttr.setY(i, y + (Math.sin(i * 1.7) * 0.08));
      }
    }
    grassGeo.computeVertexNormals();

    const grassMat = new THREE.MeshStandardMaterial({
      color: grassColor,
      roughness: 0.65,
      metalness: 0.1,
      flatShading: true,
    });
    this.grassMesh = new THREE.Mesh(grassGeo, grassMat);
    this.grassMesh.position.y = 0;
    this.grassMesh.receiveShadow = true;
    this.grassMesh.castShadow = true;
    this.add(this.grassMesh);

    // Rim highlight
    const rimGeo = new THREE.CylinderGeometry(radius * 1.05, radius * 0.98, 0.2, 9);
    const rimMat = new THREE.MeshStandardMaterial({
      color: grassEdgeColor,
      roughness: 0.5,
      metalness: 0.15,
      flatShading: true,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = -0.25;
    rimMesh.receiveShadow = true;
    this.add(rimMesh);

    // 2. Multi-part Rocky Underside (Cone + Inverted Tapered Hull)
    const rockGeo = new THREE.ConeGeometry(radius * 0.98, height, 9, 3);
    const rockPos = rockGeo.attributes.position;
    for (let i = 0; i < rockPos.count; i++) {
      const y = rockPos.getY(i);
      const angle = Math.atan2(rockPos.getZ(i), rockPos.getX(i));
      // Add jagged facets
      const displacement = Math.sin(angle * 4) * 0.15 + Math.cos(y * 3) * 0.1;
      rockPos.setX(i, rockPos.getX(i) + displacement);
      rockPos.setZ(i, rockPos.getZ(i) + displacement);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: rockColor,
      roughness: 0.85,
      metalness: 0.2,
      flatShading: true,
    });
    this.islandMesh = new THREE.Mesh(rockGeo, rockMat);
    this.islandMesh.rotation.x = Math.PI; // Invert cone downward
    this.islandMesh.position.y = -(height / 2 + 0.35);
    this.islandMesh.castShadow = true;
    this.islandMesh.receiveShadow = true;
    this.add(this.islandMesh);

    // Tip hanging rock stalactite
    const tipGeo = new THREE.ConeGeometry(radius * 0.35, height * 0.5, 6);
    const tipMat = new THREE.MeshStandardMaterial({
      color: rockUndersideColor,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.rotation.x = Math.PI;
    tipMesh.position.y = -(height + 0.4);
    this.add(tipMesh);

    // 3. Accent Rocks on perimeter
    const rockAccentGeo = new THREE.DodecahedronGeometry(0.35, 0);
    const rockAccentMat = new THREE.MeshStandardMaterial({
      color: isPurple ? 0x581c87 : 0x115e59,
      roughness: 0.7,
      metalness: 0.3,
      flatShading: true,
    });

    for (let i = 0; i < 4; i++) {
      const rock = new THREE.Mesh(rockAccentGeo, rockAccentMat);
      const ang = (i / 4) * Math.PI * 2 + 0.3;
      const dist = radius * 0.88;
      rock.position.set(Math.cos(ang) * dist, 0.2, Math.sin(ang) * dist);
      rock.scale.set(0.8 + Math.random() * 0.5, 0.7 + Math.random() * 0.6, 0.8 + Math.random() * 0.5);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.add(rock);
    }

    // 4. Low-Poly Floating Accent Crystals
    if (options.hasCrystals !== false) {
      const crystalGeo = new THREE.OctahedronGeometry(0.25, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: crystalColor,
        emissive: crystalColor,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.8,
        flatShading: true,
      });

      for (let i = 0; i < 3; i++) {
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        const ang = (i / 3) * Math.PI * 2 + 1.2;
        const dist = radius * 0.85;
        crystal.position.set(Math.cos(ang) * dist, 0.3, Math.sin(ang) * dist);
        crystal.scale.set(0.7, 1.3, 0.7);
        crystal.castShadow = true;
        this.add(crystal);
      }
    }

    // 5. Contact shadow ground projection plane
    const shadowGeo = new THREE.PlaneGeometry(radius * 2.8, radius * 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -(height + 2.5);
    this.add(this.shadowPlane);

    // 6. Title Billboard Sprite (readable and faces camera)
    if (options.title) {
      const badgeTex = createTextBadgeTexture(options.title, {
        subText: options.subtitle || '',
        bgColor: isPurple ? 'rgba(28, 10, 48, 0.92)' : 'rgba(10, 36, 36, 0.92)',
        borderColor: isPurple ? '#c084fc' : '#2dd4bf',
        textColor: '#ffffff',
        subTextColor: isPurple ? '#d8b4fe' : '#5eead4',
        fontSize: 34,
        width: 512,
        height: 150,
      });

      const spriteMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthTest: false,
      });
      this.titleSprite = new THREE.Sprite(spriteMat);
      this.titleSprite.scale.set(3.8, 1.1, 1);
      this.titleSprite.position.set(0, 3.4, 0);
      this.titleSprite.renderOrder = 999;
      this.add(this.titleSprite);
    }

    this.topY = 0.25;
  }
}
