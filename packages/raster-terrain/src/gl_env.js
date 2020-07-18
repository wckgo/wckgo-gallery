import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import AnimationLoop from "./AnimationLoop";

// renderer
const canvas = document.createElement("canvas");
const context = canvas.getContext("webgl2");
const renderer = new THREE.WebGLRenderer({ canvas, context });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector("#app");
container.appendChild(renderer.domElement);
renderer.setClearColor(0xFFFFFF);
// scene
const scene = new THREE.Scene();
// camera
const camera = new THREE.PerspectiveCamera(
  70,
  container.clientWidth / container.clientHeight,
  1,
  10000
);
const controls = new OrbitControls(camera, canvas);
controls.maxDistance = 500;
camera.position.set(
  80 * Math.sin(Math.PI / 6),
  50 * Math.tan(Math.PI / 6),
  80 * Math.cos(Math.PI / 6)
);
scene.add(camera);
// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.618);
const directionLight = new THREE.DirectionalLight(0xffffff, 0.618);
directionLight.position.set(
  80 * Math.sin(Math.PI / 6),
  50 * Math.tan(Math.PI / 6),
  80 * Math.cos(Math.PI / 6)
);
scene.add(ambientLight, directionLight);
// render loop
const animationLoop = new AnimationLoop(true);
animationLoop.renderLoopFuncs.add(() => {
  controls.update();
  renderer.render(scene, camera);
});
// resize event
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

export { renderer, scene, camera, animationLoop };
