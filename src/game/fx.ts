/**
 * Host's graphics pass: glow sparks, smoke puffs, debris, muzzle light,
 * sun glare and (high quality only) bloom + vignette/colour-grade post.
 * Everything is pooled so phones never allocate during play.
 */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

function radialTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  for (const [o, col] of stops) grd.addColorStop(o, col);
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type P = { s: THREE.Sprite; vx: number; vy: number; vz: number; life: number; max: number; grow: number; drag: number; g: number; a0: number };

const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uVig: { value: 0.32 }, uSat: { value: 1.12 }, uHurt: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uVig; uniform float uSat; uniform float uHurt; varying vec2 vUv;
  void main(){ vec4 c=texture2D(tDiffuse,vUv); float l=dot(c.rgb,vec3(0.299,0.587,0.114));
  c.rgb=mix(vec3(l),c.rgb,uSat); c.rgb*=vec3(1.02,1.0,0.97);
  float d=distance(vUv,vec2(0.5)); c.rgb*=1.0-uVig*smoothstep(0.35,0.85,d);
  c.rgb=mix(c.rgb,vec3(0.6,0.02,0.02),uHurt*smoothstep(0.3,0.8,d)*0.6); gl_FragColor=c; }`,
};

export function createFx(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  const glowTex = radialTexture([[0, "rgba(255,255,255,1)"], [0.25, "rgba(255,220,150,0.9)"], [1, "rgba(255,140,40,0)"]]);
  const smokeTex = radialTexture([[0, "rgba(200,195,185,0.55)"], [0.6, "rgba(160,155,145,0.22)"], [1, "rgba(140,135,125,0)"]]);
  const sunTex = radialTexture([[0, "rgba(255,250,235,1)"], [0.12, "rgba(255,236,190,0.75)"], [0.4, "rgba(255,210,140,0.18)"], [1, "rgba(255,200,120,0)"]]);

  const mk = (n: number, mat: THREE.SpriteMaterial) => {
    const arr: P[] = [];
    for (let i = 0; i < n; i++) {
      const s = new THREE.Sprite(mat.clone());
      s.visible = false;
      s.renderOrder = 5;
      scene.add(s);
      arr.push({ s, vx: 0, vy: 0, vz: 0, life: 0, max: 1, grow: 0, drag: 0, g: 0, a0: 1 });
    }
    return arr;
  };
  const glows = mk(48, new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, color: 0xffd08a }));
  const smokes = mk(28, new THREE.SpriteMaterial({ map: smokeTex, depthWrite: false, transparent: true }));
  let gi = 0;
  let si = 0;

  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, fog: false, transparent: true }));
  sun.scale.setScalar(70);
  scene.add(sun);

  const muzzle = new THREE.PointLight(0xffb45a, 0, 9, 2);
  scene.add(muzzle);
  let muzzleT = 0;

  function spawn(pool: P[], idx: number, x: number, y: number, z: number, life: number, size: number) {
    const p = pool[idx % pool.length];
    p.s.position.set(x, y, z);
    p.s.scale.setScalar(size);
    p.s.visible = true;
    p.life = p.max = life;
    return p;
  }

  const sunDir = new THREE.Vector3(0.5, 0.8, 0.3).normalize();
  let lowFx = false;
  const api = {
    setLow(v: boolean) {
      lowFx = v;
    },
    impact(x: number, y: number, z: number, nx = 0, ny = 1, nz = 0, flesh = false) {
      const n = lowFx ? 3 : 6;
      for (let i = 0; i < n; i++) {
        const p = spawn(glows, gi++, x, y, z, 0.18 + Math.random() * 0.2, 0.09 + Math.random() * 0.07);
        p.vx = nx * 2 + (Math.random() - 0.5) * 4;
        p.vy = ny * 2 + Math.random() * 3;
        p.vz = nz * 2 + (Math.random() - 0.5) * 4;
        p.g = 9;
        p.drag = 1.5;
        p.grow = -0.2;
        p.a0 = 1;
        (p.s.material as THREE.SpriteMaterial).color.setHex(flesh ? 0xff5040 : 0xffd08a);
      }
      const f = spawn(glows, gi++, x + nx * 0.05, y + ny * 0.05, z + nz * 0.05, 0.08, 0.5);
      f.vx = f.vy = f.vz = 0;
      f.g = 0;
      f.grow = 2;
      f.a0 = 0.9;
      (f.s.material as THREE.SpriteMaterial).color.setHex(flesh ? 0xff6050 : 0xffe0a0);
      if (!flesh) {
        const sm = spawn(smokes, si++, x + nx * 0.1, y + ny * 0.1, z + nz * 0.1, 0.9 + Math.random() * 0.5, 0.25);
        sm.vx = nx * 0.6 + (Math.random() - 0.5) * 0.3;
        sm.vy = 0.35 + ny * 0.4;
        sm.vz = nz * 0.6 + (Math.random() - 0.5) * 0.3;
        sm.g = 0;
        sm.drag = 1.2;
        sm.grow = 0.9;
        sm.a0 = 0.8;
      }
    },
    burst(x: number, y: number, z: number) {
      for (let i = 0; i < (lowFx ? 6 : 14); i++) {
        const p = spawn(glows, gi++, x, y + Math.random() * 1.2, z, 0.35 + Math.random() * 0.3, 0.12 + Math.random() * 0.1);
        const a = Math.random() * Math.PI * 2;
        const sp = 1.5 + Math.random() * 3;
        p.vx = Math.cos(a) * sp;
        p.vz = Math.sin(a) * sp;
        p.vy = 1 + Math.random() * 3;
        p.g = 7;
        p.drag = 1;
        p.grow = -0.2;
        p.a0 = 1;
        (p.s.material as THREE.SpriteMaterial).color.setHex(i % 3 ? 0xff7a40 : 0xffd890);
      }
      for (let i = 0; i < (lowFx ? 2 : 5); i++) {
        const sm = spawn(smokes, si++, x + (Math.random() - 0.5), y + 0.4 + Math.random(), z + (Math.random() - 0.5), 1.4 + Math.random(), 0.6);
        sm.vx = (Math.random() - 0.5) * 0.6;
        sm.vy = 0.5;
        sm.vz = (Math.random() - 0.5) * 0.6;
        sm.g = 0;
        sm.drag = 0.8;
        sm.grow = 1.2;
        sm.a0 = 0.75;
      }
    },
    muzzle(x: number, y: number, z: number, strong = false) {
      muzzle.position.set(x, y, z);
      muzzle.intensity = strong ? 9 : 6;
      muzzleT = 0.06;
    },
    setSun(dir: THREE.Vector3) {
      sunDir.copy(dir).normalize();
    },
    update(dt: number) {
      for (const pool of [glows, smokes]) {
        for (const p of pool) {
          if (p.life <= 0) continue;
          p.life -= dt;
          if (p.life <= 0) {
            p.s.visible = false;
            continue;
          }
          const k = Math.exp(-p.drag * dt);
          p.vx *= k;
          p.vz *= k;
          p.vy = p.vy * k - p.g * dt;
          p.s.position.x += p.vx * dt;
          p.s.position.y += p.vy * dt;
          p.s.position.z += p.vz * dt;
          if (p.s.position.y < 0.02 && p.g > 0) {
            p.s.position.y = 0.02;
            p.vy *= -0.3;
          }
          p.s.scale.multiplyScalar(Math.max(0.2, 1 + p.grow * dt));
          (p.s.material as THREE.SpriteMaterial).opacity = p.a0 * (p.life / p.max);
        }
      }
      // sun follows camera so it never gets clipped
      sun.position.copy(camera.position).addScaledVector(sunDir, 220);
      if (muzzleT > 0) {
        muzzleT -= dt;
        if (muzzleT <= 0) muzzle.intensity = 0;
      }
    },
  };

  // --- post processing (quality ALTO only) ---
  let composer: EffectComposer | null = null;
  let grade: ShaderPass | null = null;
  let bloom: UnrealBloomPass | null = null;
  let postOn = false;
  function ensureComposer() {
    if (composer) return composer;
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const size = renderer.getSize(new THREE.Vector2());
    bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), 0.42, 0.5, 0.86);
    composer.addPass(bloom);
    grade = new ShaderPass(GradeShader);
    composer.addPass(grade);
    composer.addPass(new OutputPass());
    return composer;
  }
  return {
    ...api,
    setPost(on: boolean) {
      postOn = on;
      if (on) ensureComposer();
    },
    resize(w: number, h: number) {
      if (composer) {
        composer.setPixelRatio(renderer.getPixelRatio());
        composer.setSize(w, h);
        bloom?.setSize(w / 2, h / 2);
      }
    },
    setHurt(v: number) {
      if (grade) grade.uniforms.uHurt.value = v;
    },
    render() {
      if (postOn && composer) composer.render();
      else renderer.render(scene, camera);
    },
    postOn: () => postOn,
    dispose() {
      composer?.dispose();
      glowTex.dispose();
      smokeTex.dispose();
      sunTex.dispose();
    },
  };
}

/** Star-burst muzzle flash texture (soft core + 6 rays). */
export function flashTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.translate(64, 64);
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    g.save();
    g.rotate((i / 7) * Math.PI * 2 + (i % 2) * 0.2);
    const len = i % 2 ? 40 : 62;
    const grd = g.createLinearGradient(0, 0, len, 0);
    grd.addColorStop(0, "rgba(255,240,200,0.9)");
    grd.addColorStop(1, "rgba(255,150,40,0)");
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(0, -7);
    g.lineTo(len, 0);
    g.lineTo(0, 7);
    g.fill();
    g.restore();
  }
  const core = g.createRadialGradient(0, 0, 0, 0, 0, 34);
  core.addColorStop(0, "rgba(255,255,240,1)");
  core.addColorStop(0.4, "rgba(255,210,120,0.8)");
  core.addColorStop(1, "rgba(255,140,30,0)");
  g.fillStyle = core;
  g.fillRect(-64, -64, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
