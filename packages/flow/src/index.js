import { renderer, scene, camera, animationLoop } from "./gl_env";
import { GridHelper, Vector3, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Line, Points, Clock } from "three";
import lineVertSource from "./shader/line.vert.glsl";
import lineFragSource from "./shader/line.frag.glsl";
import pointVertSource from "./shader/point.vert.glsl";
import pointFragSource from "./shader/point.frag.glsl";

const girdHelper = new GridHelper(100, 10);
scene.add(girdHelper);
// track
const options = {
  r1: 10,
  r2: 3,
  p: 7,
  q: 4
}
const vertices = gen_torusknot(1000, 10, options.p, options.q, options.r1, options.r2, 0.5);
const lineGeo = new BufferGeometry();
const lineVertBuf = new Float32BufferAttribute(
  new Float32Array(vertices.length * 3),
  3
);
lineVertBuf.copyVector3sArray(vertices);
lineGeo.setAttribute("position", lineVertBuf);
const lineMaterial = new ShaderMaterial({
  vertexShader: lineVertSource,
  fragmentShader: lineFragSource,
});
const line = new Line(lineGeo, lineMaterial);
scene.add(line);
// particle
const pointGeo = new BufferGeometry();
const particleCount = 50000;
const duration = 30;
const delay = Array(particleCount).fill(0);
delay.forEach((_, index) => (delay[index] = Math.random() * duration));
const pointVertices = Array(particleCount * 3).fill(0);
const pointVertBuf = new Float32BufferAttribute(new Float32Array(pointVertices), 3);
const offsetVertices = [];
const random = gaussian_random_factory(-5, 2.5, 0.5);
for (let i = 0; i < particleCount; i++) {
  offsetVertices.push(random(), random(), random());
}
pointGeo.setAttribute("position", pointVertBuf);
pointGeo.setAttribute("delay", new Float32BufferAttribute(new Float32Array(delay), 1));
pointGeo.setAttribute("offsetVert", new Float32BufferAttribute(new Float32Array(offsetVertices), 3));
// pointGeo.setIndex(Array(particleCount * 3).fill(0));
const pointMaterial = new ShaderMaterial({
  vertexShader: `#version 300 es\n#define ROUTER_LENGTH ${vertices.length}\n` + pointVertSource,
  fragmentShader: pointFragSource,
  uniforms: {
    pointSize: {
      value: 5,
    },
    time: {
      value: 0,
    },
    duration: {
      value: duration,
    },
    routers: {
      value: vertices,
    },
  },
});
const particles = new Points(pointGeo, pointMaterial);
scene.add(particles);

const clock = new Clock(true);
animationLoop.renderLoopFuncs.add(() => {
  pointMaterial.uniforms.time.value = clock.getElapsedTime();
});


function gaussian_random_factory(min, max, skew = 0.25) {
  const random = () => {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = random(); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
  };
  return random;
}

function sample(phi, p, q, r1, r2) {
  const x = (r1 + r2 * Math.cos(p * phi)) * Math.cos(q * phi);
  const z = (r1 + r2 * Math.cos(p * phi)) * Math.sin(q * phi);
  const y = r2 * -Math.sin(p * phi) + r2;
  return new Vector3(x, y, z);
}

function gen_torusknot(tess_u, tess_v, p, q, r1, r2, r3) {
  const vertices = [];
  for (let i = 0; i < tess_u; i++) {
    let phi = (i / tess_u) * 2 * Math.PI;
    const pt_tk = sample(phi, p, q, r1, r2);
    vertices.push(pt_tk);
    phi = ((i + 1) * 2 * Math.PI) / tess_u;
    const pt_tk_next = sample(phi, p, q, r1, r2);
    vertices.push(pt_tk_next);
    // const pt_c = sample(phi, p, q, r1, 0);
    // vertices.push(pt_c);
    // let T = pt_tk_next.clone().sub(pt_tk);
    // const B = pt_tk.clone().sub(pt_c).normalize();
    // const N = T.clone().cross(B).normalize();
    // T = B.clone().cross(N).normalize();
    /* for(let j = 0; j < tess_v; j++) {
      const theta = (j / tess_v) * 2 * Math.PI;
      const px = Math.sin(theta) * r3;
      const py = Math.cos(theta) * r3;
      const pp = N.clone().multiplyScalar (px).add(B.clone().multiplyScalar(py)).add(pt_tk);
      vertices.push(pp);
    } */
  }
  return vertices;
}