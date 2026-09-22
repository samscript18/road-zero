export default function generate(THREE) {
  const g = new THREE.Group();
  const material = (color, roughness, metalness, name = 'metal') => { const m = new THREE.MeshStandardMaterial({ color, roughness, metalness }); m.name = name; return m; };
  const graphite = material(0x111820, .52, .38), pale = material(0xdce5e7, .42, .08), dark = material(0x05070b, .22, .7);
  const cyan = new THREE.MeshStandardMaterial({ color: 0x24e5ff, emissive: 0x24e5ff, emissiveIntensity: 2 });
  const profile = (points, depth, mat, y, z) => {
    const s = new THREE.Shape(); s.moveTo(points[0][0], points[0][1]); for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1]); s.closePath();
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: .035, bevelThickness: .035, bevelSegments: 2 }), mat);
    m.rotation.y = Math.PI / 2; m.position.set(-depth / 2, y, z); g.add(m); return m;
  };
  profile([[-1.82, .12],[-1.48,.42],[-.55,.58],[.15,.78],[.88,.67],[1.78,.35],[1.9,.12]], 1.48, graphite, .16, 0);
  profile([[-.72,.02],[-.48,.34],[.08,.56],[.58,.45],[.78,.03]], 1.12, dark, .66, .08);
  for (const side of [-1, 1]) {
    const shoulder = profile([[-1.62,.02],[-1.1,.23],[-.3,.31],[.42,.22],[1.48,.03]], .3, pale, .57, 0); shoulder.position.x = side * .61 - .15;
  }
  const tyre = new THREE.TorusGeometry(.34, .1, 12, 20), hub = new THREE.CylinderGeometry(.19, .19, .13, 16);
  for (const x of [-.83,.83]) for (const z of [-1.18,1.1]) {
    const t = new THREE.Mesh(tyre, dark); t.rotation.y = Math.PI/2; t.position.set(x,.34,z); g.add(t);
    const h = new THREE.Mesh(hub, pale); h.rotation.z = Math.PI/2; h.position.set(x,.34,z); g.add(h);
  }
  for (const x of [-.58,.58]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.4,.045,.07), cyan); l.position.set(x,.49,-1.77); l.rotation.y = x * -.18; g.add(l); }
  const spine = new THREE.Mesh(new THREE.BoxGeometry(.06,.055,2.7), cyan); spine.position.set(0,.62,-.12); g.add(spine);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.35,.08,.34), graphite); wing.position.set(0,1.02,1.5); g.add(wing);
  const b = new THREE.Box3().setFromObject(g), c = b.getCenter(new THREE.Vector3()); g.children.forEach(o => { o.position.x -= c.x; o.position.y -= b.min.y; o.position.z -= c.z; });
  return g;
}
