export default function generate(THREE) {
  const g = new THREE.Group();
  const mat = (color, roughness, metalness, name = 'metal') => {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness }); m.name = name; return m;
  };
  const graphite = mat(0x111820, .5, .45), gun = mat(0x27313b, .35, .75);
  const ceramic = mat(0xdce5e7, .4, .12), glass = mat(0x071018, .18, .72);
  const cyan = new THREE.MeshStandardMaterial({ color: 0x24e5ff, emissive: 0x24e5ff, emissiveIntensity: 2.2, roughness: .25 });
  const box = (sx, sy, sz, x, y, z, material, rx = 0) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 2, 1, 3), material);
    o.position.set(x, y, z); o.rotation.x = rx; g.add(o); return o;
  };
  box(1.58, .28, 3.55, 0, .43, 0, graphite);
  box(1.34, .2, 1.5, 0, .69, -.35, gun, -.08);
  box(1.18, .28, 1.15, 0, .83, .28, glass, -.18);
  box(.62, .15, 1.8, -.57, .7, -.35, ceramic, -.05);
  box(.62, .15, 1.8, .57, .7, -.35, ceramic, -.05);
  box(1.66, .18, .7, 0, .49, 1.45, ceramic, .08);
  box(1.72, .12, .54, 0, .28, -1.65, gun, -.04);
  const tyre = new THREE.TorusGeometry(.34, .105, 10, 18);
  const rim = new THREE.CylinderGeometry(.21, .21, .12, 18);
  for (const x of [-.84, .84]) for (const z of [-1.18, 1.12]) {
    const t = new THREE.Mesh(tyre, graphite); t.rotation.y = Math.PI / 2; t.position.set(x, .34, z); g.add(t);
    const r = new THREE.Mesh(rim, gun); r.rotation.z = Math.PI / 2; r.position.set(x, .34, z); g.add(r);
  }
  box(1.42, .035, .08, 0, .51, -1.8, cyan);
  box(.06, .06, 1.4, -.79, .47, -.3, cyan); box(.06, .06, 1.4, .79, .47, -.3, cyan);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(1.25, .08, .3), gun); fin.position.set(0, .96, 1.54); g.add(fin);
  const box3 = new THREE.Box3().setFromObject(g), c = box3.getCenter(new THREE.Vector3());
  g.children.forEach(o => { o.position.x -= c.x; o.position.y -= box3.min.y; o.position.z -= c.z; });
  return g;
}
