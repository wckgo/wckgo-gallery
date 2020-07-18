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
renderer.setClearColor(0x000000);
// scene
const scene = new THREE.Scene();
// camera
const camera = new THREE.PerspectiveCamera(
  70,
  container.clientWidth / container.clientHeight,
  1,
  20000
);
const controls = new OrbitControls(camera, canvas);
controls.maxDistance = 3000;
camera.position.set(740, 1000, 1400);
scene.add(camera);
// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.618);
const directionLight = new THREE.DirectionalLight(0xffffff, 0.618);
directionLight.position.set(100, 200, 100);
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
