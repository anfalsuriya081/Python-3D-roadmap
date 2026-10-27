import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ROADMAP_DAYS } from '../data/roadmapData';
import { FloatingIsland } from './models/FloatingIsland';
import { Island1Props } from './models/Island1Props';
import { Island2Props } from './models/Island2Props';
import { Island3Props } from './models/Island3Props';
import { Island4Props } from './models/Island4Props';
import { Island5Props } from './models/Island5Props';
import { GlowingPath } from './models/GlowingPath';
import { Atmosphere } from './models/Atmosphere';
import { sounds } from '../audio/soundEffects';

export interface SceneCallbacks {
  onSelectDay: (dayId: number) => void;
  onHoverIsland: (dayId: number | null) => void;
}

// Pre-allocated math scratch variables for zero GC in render loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _vec2 = new THREE.Vector2();

export class RoadmapScene {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private atmosphere: Atmosphere;
  private glowingPath: GlowingPath;

  private islands: {
    dayId: number;
    island: FloatingIsland;
    group: THREE.Group;
    hitBox: THREE.Mesh;
    props: Island1Props | Island2Props | Island3Props | Island4Props | Island5Props;
  }[] = [];

  // Interaction & Camera flight state
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private hasMovedPointer = false;

  // Camera targets & orbit
  private defaultCamPos = new THREE.Vector3(14, 18, 30);
  private defaultTarget = new THREE.Vector3(2, 3, -4);
  private targetCamPos = new THREE.Vector3(14, 18, 30);
  private currentTarget = new THREE.Vector3(2, 3, -4);
  private orbitAngle = 0.45;
  private orbitRadius = 38;
  private orbitHeight = 18;
  private isAutoOrbiting = true;
  private selectedDayId: number | null = null;
  private hoveredDayId: number | null = null;

  private clock = new THREE.Clock();
  private frameId: number = 0;
  private isDestroyed = false;
  private isSoftwareGl = false;

  private callbacks: SceneCallbacks;

  constructor(container: HTMLDivElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Initialize Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. Initialize Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    this.camera.position.copy(this.defaultCamPos);
    this.camera.lookAt(this.defaultTarget);

    // 4. Procedural Studio Reflection (RoomEnvironment + PMREMGenerator)
    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // Fallback
    }

    // 5. Atmosphere, Sky & Lights
    this.atmosphere = new Atmosphere(this.scene);
    this.scene.add(this.atmosphere);

    // 6. Build the 5 Floating Islands & Props
    const islandCoords: [number, number, number][] = ROADMAP_DAYS.map((d) => d.islandPosition);

    ROADMAP_DAYS.forEach((dayData) => {
      const islandGroup = new THREE.Group();
      islandGroup.position.set(...dayData.islandPosition);

      // Determine size based on unit
      const isHeroLarge = dayData.dayId === 3; // Unit III is largest
      const isSmall = dayData.dayId === 1;
      const radius = isHeroLarge ? 5.2 : isSmall ? 3.4 : 4.2;
      const islandHeight = isHeroLarge ? 4.2 : isSmall ? 2.8 : 3.4;

      const island = new FloatingIsland({
        radius,
        height: islandHeight,
        theme: dayData.theme,
        title: `${dayData.dayNumber}: ${dayData.unitTitle.split(':')[0]}`,
        subtitle: dayData.unitTitle.split(':')[1]?.trim() || '',
      });
      islandGroup.add(island);

      // Add specialized props for each day
      let props: Island1Props | Island2Props | Island3Props | Island4Props | Island5Props;
      if (dayData.dayId === 1) {
        props = new Island1Props();
      } else if (dayData.dayId === 2) {
        props = new Island2Props();
      } else if (dayData.dayId === 3) {
        props = new Island3Props();
      } else if (dayData.dayId === 4) {
        props = new Island4Props();
      } else {
        props = new Island5Props();
      }
      islandGroup.add(props);

      // Invisible Raycast Hit Box for comfortable clicking
      const hitBoxGeo = new THREE.CylinderGeometry(radius * 1.15, radius * 1.15, 3.5, 8);
      const hitBoxMat = new THREE.MeshBasicMaterial({
        visible: false,
        wireframe: false,
      });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = 1.0;
      hitBox.userData = { dayId: dayData.dayId };
      islandGroup.add(hitBox);

      this.scene.add(islandGroup);

      this.islands.push({
        dayId: dayData.dayId,
        island,
        group: islandGroup,
        hitBox,
        props,
      });
    });

    // 7. Glowing Curved Path connecting Islands 1 through 5
    this.glowingPath = new GlowingPath(islandCoords);
    this.scene.add(this.glowingPath);
    this.glowingPath.updateGlowProgress(1);

    // 8. Event Listeners
    this.bindEvents();

    // 9. Start Lossless 60fps Animation Loop
    this.startLoop();
  }

  private bindEvents() {
    window.addEventListener('resize', this.onResize);
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private unbindEvents() {
    window.removeEventListener('resize', this.onResize);
    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.onPointerDown);
    dom.removeEventListener('pointermove', this.onPointerMove);
    dom.removeEventListener('pointerup', this.onPointerUp);
    dom.removeEventListener('wheel', this.onWheel);
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onPointerDown = (e: PointerEvent) => {
    this.isPointerDown = true;
    this.pointerStartX = e.clientX;
    this.pointerStartY = e.clientY;
    this.hasMovedPointer = false;
  };

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.isPointerDown) {
      const dx = e.clientX - this.pointerStartX;
      const dy = e.clientY - this.pointerStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        this.hasMovedPointer = true;
        // User is manually orbiting/panning: disable auto-orbit
        this.isAutoOrbiting = false;
        this.orbitAngle -= dx * 0.006;
        this.orbitHeight = Math.max(5, Math.min(32, this.orbitHeight + dy * 0.05));
        this.pointerStartX = e.clientX;
        this.pointerStartY = e.clientY;

        if (this.selectedDayId === null) {
          this.updateOverviewCameraTarget();
        }
      }
    } else {
      // Hover detection
      this.checkHover();
    }
  };

  private checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hitBoxes = this.islands.map((item) => item.hitBox);
    const intersects = this.raycaster.intersectObjects(hitBoxes, false);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const dayId = hitObj.userData.dayId as number;
      if (this.hoveredDayId !== dayId) {
        this.hoveredDayId = dayId;
        this.callbacks.onHoverIsland(dayId);
        this.renderer.domElement.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredDayId !== null) {
        this.hoveredDayId = null;
        this.callbacks.onHoverIsland(null);
        this.renderer.domElement.style.cursor = 'default';
      }
    }
  }

  private onPointerUp = (e: PointerEvent) => {
    this.isPointerDown = false;

    // If pointer didn't drag, treat as click
    if (!this.hasMovedPointer) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hitBoxes = this.islands.map((item) => item.hitBox);
      const intersects = this.raycaster.intersectObjects(hitBoxes, false);

      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const dayId = hitObj.userData.dayId as number;
        this.selectDay(dayId);
      }
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.isAutoOrbiting = false;
    const delta = e.deltaY * 0.03;
    if (this.selectedDayId === null) {
      this.orbitRadius = Math.max(18, Math.min(55, this.orbitRadius + delta));
      this.updateOverviewCameraTarget();
    } else {
      // Zoom in/out of current inspected island
      const dir = _vec3A.subVectors(this.camera.position, this.currentTarget).normalize();
      this.targetCamPos.addScaledVector(dir, delta);
    }
  };

  private updateOverviewCameraTarget() {
    const x = Math.sin(this.orbitAngle) * this.orbitRadius + this.defaultTarget.x;
    const z = Math.cos(this.orbitAngle) * this.orbitRadius + this.defaultTarget.z;
    this.targetCamPos.set(x, this.orbitHeight, z);
    this.currentTarget.copy(this.defaultTarget);
  }

  public selectDay(dayId: number) {
    this.selectedDayId = dayId;
    this.isAutoOrbiting = false;
    sounds.playIslandClick(dayId);

    const targetDay = ROADMAP_DAYS.find((d) => d.dayId === dayId);
    if (targetDay) {
      this.targetCamPos.set(...targetDay.cameraPosition);
      this.currentTarget.set(...targetDay.cameraTarget);
    }

    this.glowingPath.updateGlowProgress(dayId);
    this.callbacks.onSelectDay(dayId);
  }

  public resetToOverview() {
    this.selectedDayId = null;
    this.orbitRadius = 38;
    this.orbitHeight = 18;
    this.orbitAngle = 0.45;
    this.isAutoOrbiting = true;
    this.updateOverviewCameraTarget();
    this.glowingPath.updateGlowProgress(ROADMAP_DAYS.length);
  }

  public toggleAutoOrbit(enabled?: boolean) {
    this.isAutoOrbiting = enabled !== undefined ? enabled : !this.isAutoOrbiting;
  }

  public getAutoOrbit(): boolean {
    return this.isAutoOrbiting;
  }

  private startLoop() {
    const tick = () => {
      if (this.isDestroyed) return;

      const delta = Math.min(this.clock.getDelta(), 0.1);
      const elapsedTime = this.clock.getElapsedTime();

      // 1. Auto Orbit camera when idle in overview mode
      if (this.isAutoOrbiting && this.selectedDayId === null) {
        this.orbitAngle += delta * 0.12;
        this.updateOverviewCameraTarget();
      }

      // 2. Exponential Camera Damping (1 - Math.exp(-k * dt))
      const dampFactor = 1 - Math.exp(-4.2 * delta);
      this.camera.position.lerp(this.targetCamPos, dampFactor);
      
      // Interpolate current camera lookAt focus point
      _vec3B.copy(this.camera.getWorldDirection(_vec3A)).multiplyScalar(10).add(this.camera.position);
      _vec3B.lerp(this.currentTarget, dampFactor);
      this.camera.lookAt(this.currentTarget);

      // 3. Update Animated Sub-Models
      this.atmosphere.updateAnimation(delta, elapsedTime);
      this.glowingPath.updateAnimation(elapsedTime, this.selectedDayId || 1);

      this.islands.forEach((item) => {
        // Individual prop animations
        item.props.updateAnimation(elapsedTime);

        // Hover bobbing effect
        const isHovered = this.hoveredDayId === item.dayId;
        const targetScale = isHovered ? 1.04 : 1.0;
        item.group.scale.lerp(_vec3A.set(targetScale, targetScale, targetScale), dampFactor * 2);
      });

      // 4. Render Scene
      this.renderer.render(this.scene, this.camera);

      // Pacing for software GL or standard rAF
      if (this.isSoftwareGl) {
        this.afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      this.afterDraw(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  private afterDraw(cb: () => void) {
    try {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.isDestroyed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 6);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 60);
        }
      };
      this.frameId = window.setTimeout(poll, 6);
    } catch {
      this.frameId = window.setTimeout(cb, 60);
    }
  }

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.unbindEvents();

    // Dispose renderer and geometries
    try {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    } catch {
      //
    }
  }
}
