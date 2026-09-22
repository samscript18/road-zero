export default function generate(THREE){
  const g=new THREE.Group(), mat=(c,r,m,n='metal')=>{const x=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});x.name=n;return x;};
  const road=mat(0x111820,.7,.14,'ground'),gun=mat(0x27313b,.34,.78),pale=mat(0xdce5e7,.48,.04,'stone');
  const glow=new THREE.MeshStandardMaterial({color:0x24e5ff,emissive:0x24e5ff,emissiveIntensity:2});
  const add=(geo,x,y,z,m)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o;};
  const plate=new THREE.BoxGeometry(2.92,.5,11.75,2,1,2);
  for(const x of [-4.5,-1.5,1.5,4.5])for(const z of [-18,-6,6,18])add(plate,x,.62,z,road);
  for(const z of [-18,-6,6,18]){add(new THREE.BoxGeometry(12,.18,.5),0,.31,z,pale);for(const x of [-5.8,5.8]){const brace=add(new THREE.BoxGeometry(.35,.75,10.9),x,1.2,z,gun);brace.rotation.z=-Math.sign(x)*.035;}}
  for(const x of [-5.59,5.59])add(new THREE.BoxGeometry(.07,.09,45.5),x,1.28,0,glow);
  for(const x of [-3,0,3])add(new THREE.BoxGeometry(.055,.035,44),x,.9,0,glow);
  const lock=new THREE.TorusGeometry(.32,.09,8,16);
  for(const x of [-4.5,-1.5,1.5,4.5])for(const z of [-23.7,23.7]){const o=add(lock,x,.48,z,gun);o.rotation.x=Math.PI/2;}
  const b=new THREE.Box3().setFromObject(g),c=b.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.y-=b.min.y;o.position.z-=c.z;});g.userData.mounts=['front','back'];return g;
}
