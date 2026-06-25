/**
 * mascot.js — a stylized low-poly "AI core" mascot built from primitives
 * (no external model). Faceted icosahedron shell + glowing core + orbiting
 * electrons. Returns a group plus an update(t, mouse) animator for the host
 * scene to drive (idle bob, pulse, cursor follow).
 */
import * as THREE from 'three';

export function createMascot() {
  const group = new THREE.Group();

  // Faceted shell (Phong, not PBR — far cheaper shader compile)
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 1),
    new THREE.MeshPhongMaterial({
      color: 0xf47c20,
      flatShading: true,
      shininess: 30,
      specular: 0x4a2e10,
      emissive: 0xff6a00,
      emissiveIntensity: 0.15,
    })
  );
  group.add(shell);

  // Wireframe overlay (the "neural" cage)
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.24, 1),
    new THREE.MeshBasicMaterial({ color: 0xffb07a, wireframe: true, transparent: true, opacity: 0.35 })
  );
  group.add(wire);

  // Glowing inner core
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 0),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  group.add(core);

  // Orbiting electrons
  const electrons = [];
  const eGeo = new THREE.SphereGeometry(0.11, 12, 12);
  const eMat = new THREE.MeshBasicMaterial({ color: 0xff6a00 });
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(eGeo, eMat);
    group.add(mesh);
    electrons.push({ mesh, r: 1.7 + i * 0.18, speed: 0.6 + i * 0.25, phase: i * 2.1, tilt: i * 0.9 });
  }

  function update(t, mouse) {
    const mx = mouse ? mouse.x : 0;
    const my = mouse ? mouse.y : 0;
    group.rotation.y = t * 0.25 + mx * 0.5;
    group.rotation.x = Math.sin(t * 0.5) * 0.08 + my * 0.3;
    group.position.y = Math.sin(t * 0.9) * 0.12; // idle bob
    core.scale.setScalar(1 + Math.sin(t * 2.5) * 0.08); // pulse
    shell.material.emissiveIntensity = 0.15 + (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.2;
    for (const o of electrons) {
      const a = t * o.speed + o.phase;
      o.mesh.position.set(
        Math.cos(a) * o.r,
        Math.sin(a) * o.r * Math.sin(o.tilt),
        Math.sin(a) * o.r * Math.cos(o.tilt)
      );
    }
  }

  return { group, update };
}
