/**
 * globe.js — stylized rotating data-globe accent for the India AI Tour section.
 * Wireframe sphere + surface points + soft halo. Lazy-loaded; create()/dispose().
 */
import * as THREE from 'three';

export function create(container) {
  const w = () => container.clientWidth || 320;
  const h = () => container.clientHeight || 320;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w(), h());
  renderer.domElement.style.cssText = 'width:100%;height:100%;pointer-events:none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w() / h(), 0.1, 100);
  camera.position.set(0, 0, 6);

  const globe = new THREE.Group();
  globe.rotation.z = 0.4;
  scene.add(globe);

  // Wireframe sphere
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(2, 24, 18),
    new THREE.MeshBasicMaterial({ color: 0xff8a3d, wireframe: true, transparent: true, opacity: 0.22 })
  ));

  // Surface points
  const COUNT = 420;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const th = Math.random() * Math.PI * 2;
    const r = 2.02;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(th);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  globe.add(new THREE.Points(
    pg,
    new THREE.PointsMaterial({ color: 0xff6a00, size: 0.05, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
  ));

  // Soft halo
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(2.18, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.06 })
  ));

  // Interaction
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
    globe.rotation.y = t * 0.12 + mouse.x * 0.3;
    globe.rotation.x = mouse.y * 0.2;
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
