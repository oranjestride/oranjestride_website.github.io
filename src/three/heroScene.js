/**
 * heroScene.js — abstract orange particle / neural field on the dark hero,
 * with the low-poly AI mascot as its centerpiece. Slow drift + cursor parallax
 * + gentle scroll reaction. Lazy-loaded; exposes create()/dispose().
 */
import * as THREE from 'three';
import { createMascot } from './mascot.js';

export function create(container) {
  const w = () => container.clientWidth || 460;
  const h = () => container.clientHeight || 460;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w(), h());
  renderer.domElement.style.cssText = 'width:100%;height:100%;pointer-events:none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 100);
  camera.position.set(0, 0, 9);

  const root = new THREE.Group();
  scene.add(root);

  // ---- Particle field (spherical shell) ----
  const COUNT = 700;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xff8a3d, size: 0.06, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })
  );
  root.add(points);

  // ---- Orbit rings ("neural" accent) ----
  const rings = new THREE.Group();
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
  for (let i = 0; i < 2; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4 + i * 0.5, 0.012, 8, 120), ringMat);
    ring.rotation.x = Math.PI / 2 + i * 0.5;
    rings.add(ring);
  }
  root.add(rings);

  // ---- Mascot ----
  const mascot = createMascot();
  root.add(mascot.group);

  // ---- Lights ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffd9b3, 1.4); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff6a00, 1.0); rim.position.set(-4, -2, -3); scene.add(rim);

  // ---- Interaction ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const onResize = () => {
    if (!w() || !h()) return;
    renderer.setSize(w(), h());
    camera.aspect = w() / h();
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;
  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    root.rotation.y = t * 0.06 + mouse.x * 0.4;
    root.rotation.x = mouse.y * 0.25;
    points.rotation.y = -t * 0.03;
    rings.rotation.z = t * 0.1;
    mascot.update(t, mouse);
    camera.position.y = -Math.min(window.scrollY, window.innerHeight) / window.innerHeight * 0.6;
    renderer.render(scene, camera);
  }
  loop();

  function dispose() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('resize', onResize);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    });
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    renderer.domElement.parentNode?.removeChild(renderer.domElement);
  }

  return { dispose };
}
