import { scene } from "./gl_context";
import { Vector3, BufferGeometry, ShaderMaterial, Points, PointsMaterial, Float32BufferAttribute } from "three";
import pointVertSource from "./shader/point.vert.glsl";
import pointFragSource from "./shader/point.frag.glsl";

const segments = 10;

const vectices = [];
const colors = [];

for (let x = 0; x < segments; x++) {
  for (let y = 0; y < segments; y++) {
    for (let z = 0; z < segments; z++) {
      vectices.push(new Vector3(x, y, z));
      const base = segments - 1;
      colors.push(new Vector3(x / base, y / base, x / base));
    }
  }
}

console.log(new Vector3(10, 10, 10))

const geometry = new BufferGeometry();
geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(vectices.length * 3), 3).copyVector3sArray(vectices));
geometry.setAttribute("color", new Float32BufferAttribute(new Float32Array(colors.length * 3), 3).copyVector3sArray(colors));
const material = new ShaderMaterial({
  vertexShader: pointVertSource,
  fragmentShader: pointFragSource,
  vertexColors: true,
  uniforms: {
    pointSize: {
      value: 10,
    },
  }
});
const points = new Points(geometry, material);
scene.add(points);
