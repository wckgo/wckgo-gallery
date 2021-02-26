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
renderer.setClearColor(0x434343);
// scene
const scene = new THREE.Scene();
// camera
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  1,
  1000
);
const controls = new OrbitControls(camera, canvas);
camera.position.set(0, 0, 5);
scene.add(camera);
// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const hemisphereLight = new THREE.HemisphereLight();
const directionLight = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
directionLight.position.set(10, 10, 8.66);
scene.add(ambientLight);
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
