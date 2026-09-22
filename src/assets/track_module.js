export default function generate(THREE){
  const g=new THREE.Group(), mk=(c,r,m,n='metal')=>{const x=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});x.name=n;return x;};
  const road=mk(0x111820,.72,.12,'ground'),gun=mk(0x27313b,.38,.72),pale=mk(0xdce5e7,.46,.05,'stone');
  const cyan=new THREE.MeshStandardMaterial({color:0x24e5ff,emissive:0x24e5ff,emissiveIntensity:2});
  const add=(sx,sy,sz,x,y,z,mat)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz,2,1,4),mat);o.position.set(x,y,z);g.add(o);return o;};
  for(const x of [-4.5,-1.5,1.5,4.5]){add(2.9,.48,47.8,x,.62,0,road);add(.055,.035,44,x+1.42,.89,0,cyan);}
  for(const x of [-5.84,5.84]){add(.32,.75,48,x,1.24,0,gun);add(.07,.09,45.5,x-(Math.sign(x)*.18),1.3,0,cyan);}
  for(const z of [-20,-12,-4,4,12,20]){add(12,.18,.42,0,.32,z,pale);}
  const joint=new THREE.CylinderGeometry(.38,.38,.25,16);
  for(const x of [-4.5,-1.5,1.5,4.5])for(const z of [-23.78,23.78]){const j=new THREE.Mesh(joint,gun);j.rotation.x=Math.PI/2;j.position.set(x,.38,z);g.add(j);const q=new THREE.Mesh(new THREE.TorusGeometry(.24,.045,8,16),cyan);q.position.set(x,.38,z+(z<0?-.14:.14));g.add(q);}
  const b=new THREE.Box3().setFromObject(g),c=b.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.y-=b.min.y;o.position.z-=c.z;});g.userData.mounts=['front','back'];return g;
}
