import { scene } from "./gl_env";
import { Mesh, MeshPhongMaterial, TextureLoader, MeshBasicMaterial, BackSide, BoxGeometry, Vector2, Float32BufferAttribute } from "three";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

const boxGeo = new BoxGeometry(8000, 8000, 8000)
const px = "http://qd5oatw0n.bkt.clouddn.com/space_right.jpg";
const nx = "http://qd5oatw0n.bkt.clouddn.com/space_left.jpg";
const py = "http://qd5oatw0n.bkt.clouddn.com/space_up.jpg";
const ny = "http://qd5oatw0n.bkt.clouddn.com/space_down.jpg";
const pz = "http://qd5oatw0n.bkt.clouddn.com/space_back.jpg";
const nz = "http://qd5oatw0n.bkt.clouddn.com/space_front.jpg";

const images = [nx, px, py, ny, nz, pz];

const boxMats = images.map(image => {
  const t = new TextureLoader().load(image);
  return new MeshBasicMaterial({ color: 0xffffff, map: t, side: BackSide });
})

const box = new Mesh(boxGeo, boxMats);
// scene.add(box);


const loader = new OBJLoader2();
loader.load("http://qd5oatw0n.bkt.clouddn.com/ll.obj", (group) => {
  const mesh = group.children[0];
  const colour = new TextureLoader().load("http://qd5oatw0n.bkt.clouddn.com/ll-color.png");
  const material = new MeshPhongMaterial({
    map: colour,
    // alphaMap: colour,
    transparent: true
  });
  // material.wireframe = true;
  mesh.material = material;
  const geometry = mesh.geometry;
  assignUVs(geometry);
  geometry.computeBoundingSphere();
  const bound = geometry.boundingSphere;
  const center = bound.center;
  const scaleX = 0.01;
  const scaleY = 0.01;
  const scaleZ = .1;
  mesh.scale.set(scaleX, scaleY, scaleZ);
  mesh.rotateX(-Math.PI / 2);
  mesh.translateX(-center.x * scaleX);
  mesh.translateY(-center.y * scaleY);
  mesh.translateZ(-center.z * scaleZ);
  scene.add(mesh);
});

function assignUVs(geometry) {
  geometry.computeBoundingBox();
  const max = geometry.boundingBox.max,
    min = geometry.boundingBox.min;
  const offset = new Vector2(0 - min.x, 0 - min.y);
  const range = new Vector2(max.x - min.x, max.y - min.y);
  const uv = [];
  const vertices = geometry.getAttribute("position");
  for (let i = 0; i < vertices.array.length; i += 3) {
    const x = vertices.array[i];
    const y = vertices.array[i + 1];
    uv.push(new Vector2((x + offset.x) / range.x, (y + offset.y) / range.y));
  }
  const attr = new Float32BufferAttribute(
    new Float32Array(uv.length * 2),
    2
  ).copyVector2sArray(uv);
  geometry.setAttribute("uv", attr);
}