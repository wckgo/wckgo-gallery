import { TextureLoader, Mesh, IcosahedronBufferGeometry, RepeatWrapping, ShaderMaterial, Clock, Color } from "three";
import { scene, animationLoop } from "./gl_env";
import vert from "./polygon.vert.glsl";
import frag from "./polygon.frag.glsl";

const geometry = new IcosahedronBufferGeometry(1, 4);
const texture = new TextureLoader().load("http://p0.qhimg.com/t016180698510e89d13.png");
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
const mesk = new TextureLoader().load("http://p0.qhimg.com/t014ae5984cd335caca.jpg");
texture.repeat.set(8, 8);
const material = new ShaderMaterial({
  vertexShader: vert,
  fragmentShader: frag,
  transparent: true,
  uniforms: {
    color: {
      value: new Color("#3498DB")
    },
    scanColor: {
      value: new Color("#BB8FCE")
    },
    map: {
      value: texture
    },
    mesk: {
      value: mesk
    },
    time: {
      value: 0,
    },
    duration: {
      value: 3.0
    }
  }
});
scene.add(new Mesh(geometry, material));
const clock = new Clock(true);
animationLoop.renderLoopFuncs.add(() => {
  material.uniforms.time.value = clock.getElapsedTime();
});
