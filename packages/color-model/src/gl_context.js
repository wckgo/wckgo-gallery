import { WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, HemisphereLight, DirectionalLight, GridHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import AnimationLoop from "./AnimationLoop";

// renderer
const canvas = document.createElement("canvas");
const context = canvas.getContext("webgl2");
const renderer = new WebGLRenderer({ canvas, context });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector("#app")
container.appendChild(renderer.domElement);
renderer.setClearColor(0x434343);
// scene
const scene = new Scene();
// camera
const camera = new PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000);
const controls = new OrbitControls(camera, canvas);
camera.position.set(
  10 * Math.sin(Math.PI / 6),
  10 * Math.tan(Math.PI / 6),
  10 * Math.cos(Math.PI / 6)
);
scene.add(camera);
// light
const ambientLight = new AmbientLight(0xffffff, 0.3);
const hemisphereLight = new HemisphereLight();
const directionLight = new DirectionalLight(0xffffff, 0.8 * Math.PI);
directionLight.position.set(5, 0, 8.66);
scene.add(ambientLight, hemisphereLight, directionLight);
// gird
const girdHelper = new GridHelper(100, 10, 0x888888);
scene.add(girdHelper);

const animationLoop = new AnimationLoop(true);
animationLoop.renderLoopFuncs.add(() => {
  controls.update();
  renderer.render(scene, camera);
});

export {
  renderer,
  scene, 
  camera,
  animationLoop,
  controls
};
