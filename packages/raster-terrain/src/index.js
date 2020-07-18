import { scene } from "./gl_env";
import { Vector3, Mesh, MeshPhongMaterial, PlaneGeometry, TextureLoader, MeshBasicMaterial, BackSide, BoxGeometry, DoubleSide } from "three";


const boxGeo = new BoxGeometry(5000, 5000, 5000)
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
scene.add(box)


fetch("assets/ll.tif")
  .then((response) => response.arrayBuffer())
  .then((buff) => new Uint16Array(buff))
  .then((data) => {
    const geometry = new PlaneGeometry(100, 100, 399, 399);
    geometry.lookAt(new Vector3(0, 1, 0));
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      let y = (data[i + 343] / 65535) * 20;
      geometry.vertices[i].y = y;
    }
    geometry.computeVertexNormals();
    const colour = new TextureLoader().load("assets/colour.png");
    const hillshade = new TextureLoader().load("assets/hillshade.png")
    const material = new MeshPhongMaterial({
      map: colour,
    });
    const plane = new Mesh(geometry, material);
    scene.add(plane);
  });
