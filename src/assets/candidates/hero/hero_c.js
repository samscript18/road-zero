export default function generate(THREE) {
  const g = new THREE.Group();
  const makeMat = (color, roughness, metalness, name='metal') => { const m = new THREE.MeshStandardMaterial({color, roughness, metalness}); m.name=name; return m; };
  const graphite=makeMat(0x111820,.48,.52), gun=makeMat(0x27313b,.32,.78), white=makeMat(0xdce5e7,.38,.1), black=makeMat(0x05070b,.26,.65);
  const glow=new THREE.MeshStandardMaterial({color:0x24e5ff,emissive:0x24e5ff,emissiveIntensity:2.4});
  const wedge=(w,h,d,x,y,z,mat,scaleFront=.72)=>{ const geom=new THREE.BoxGeometry(w,h,d,3,1,4); const p=geom.attributes.position; for(let i=0;i<p.count;i++){ if(p.getZ(i)<0){p.setX(i,p.getX(i)*scaleFront);p.setY(i,p.getY(i)*.7);} } geom.computeVertexNormals(); const m=new THREE.Mesh(geom,mat);m.position.set(x,y,z);g.add(m);return m; };
  wedge(1.64,.36,3.76,0,.42,0,graphite,.68);
  wedge(1.42,.22,2.1,0,.67,.12,gun,.75);
  wedge(1.14,.34,1.2,0,.86,.08,black,.88);
  for(const side of [-1,1]){ wedge(.5,.2,1.65,side*.62,.67,-.42,white,.62); wedge(.38,.22,.95,side*.69,.58,1.1,white,.9); }
  const tyre=new THREE.CylinderGeometry(.34,.34,.22,20), inner=new THREE.CylinderGeometry(.21,.21,.235,10);
  for(const x of [-.85,.85])for(const z of [-1.2,1.12]){const t=new THREE.Mesh(tyre,black);t.rotation.z=Math.PI/2;t.position.set(x,.34,z);g.add(t);const i=new THREE.Mesh(inner,gun);i.rotation.z=Math.PI/2;i.position.set(x,.34,z);g.add(i);}
  for(const side of [-1,1]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.055,.055,2.55),glow);rail.position.set(side*.77,.49,-.08);g.add(rail);const lamp=new THREE.Mesh(new THREE.BoxGeometry(.48,.045,.07),glow);lamp.position.set(side*.46,.5,-1.88);lamp.rotation.y=side*.18;g.add(lamp);}
  const wing=new THREE.Mesh(new THREE.BoxGeometry(1.42,.075,.32),gun);wing.position.set(0,1.03,1.52);g.add(wing);
  const b=new THREE.Box3().setFromObject(g),c=b.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.y-=b.min.y;o.position.z-=c.z;});return g;
}
