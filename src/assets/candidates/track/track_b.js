export default function generate(THREE){
  const g=new THREE.Group(), mat=(c,r,m,n='metal')=>{const x=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});x.name=n;return x;};
  const road=mat(0x111820,.74,.1,'ground'),metal=mat(0x27313b,.36,.76),white=mat(0xdce5e7,.5,.06,'stone');
  const glow=new THREE.MeshStandardMaterial({color:0x24e5ff,emissive:0x24e5ff,emissiveIntensity:2.2});
  const slabShape=new THREE.Shape();slabShape.moveTo(-1.45,0);slabShape.lineTo(1.45,0);slabShape.lineTo(1.38,.48);slabShape.lineTo(-1.38,.48);slabShape.closePath();
  for(const x of [-4.5,-1.5,1.5,4.5]){const slab=new THREE.Mesh(new THREE.ExtrudeGeometry(slabShape,{depth:48,bevelEnabled:false}),road);slab.position.set(x,0,-24);g.add(slab);}
  const railShape=new THREE.Shape();railShape.moveTo(-.22,0);railShape.lineTo(.22,0);railShape.lineTo(.3,.7);railShape.lineTo(.12,.86);railShape.lineTo(-.2,.7);railShape.closePath();
  for(const x of [-5.75,5.75]){const rail=new THREE.Mesh(new THREE.ExtrudeGeometry(railShape,{depth:48,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:1}),metal);rail.position.set(x,.5,-24);g.add(rail);const line=new THREE.Mesh(new THREE.BoxGeometry(.055,.08,44),glow);line.position.set(x-Math.sign(x)*.18,1.23,0);g.add(line);}
  for(const z of [-20,-10,0,10,20]){const rib=new THREE.Mesh(new THREE.BoxGeometry(12,.22,.5),white);rib.position.set(0,.24,z);g.add(rib);}
  for(const x of [-3,0,3]){const line=new THREE.Mesh(new THREE.BoxGeometry(.055,.035,44),glow);line.position.set(x,.98,0);g.add(line);}
  const b=new THREE.Box3().setFromObject(g),c=b.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.y-=b.min.y;o.position.z-=c.z;});g.userData.mounts=['front','back'];return g;
}
