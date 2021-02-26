import { Clock } from "three";
import { animationLoop } from "./gl_context";
import { Float32BufferAttribute } from "three";

export default class Action {
  constructor(geometry, vectices, duration = 1) {
    this.vectices = vectices;
    this.clock = new Clock(true);
    this.animating = false;
    this.duration = duration;
    this.geometry = geometry;
    this.current = vectices;
    animationLoop.renderLoopFuncs.add(() => this.animate());
  }


  setTarget(target) {
    this.target = target;
    this.vectices = this.current;
    this.clock.start();
    this.animating = true;

  }

  animate() {
    if (this.animating && this.target && this.clock.getElapsedTime() <= this.duration) {
      this.current = this.vectices.map((item, index) => {
        return item.clone().lerp(this.target[index], this.clock.getElapsedTime() / this.duration);
      });
      this.geometry.setAttribute("position",
        new Float32BufferAttribute(new Float32Array(this.current.length * 3), 3).copyVector3sArray(this.current));
    }
    if (this.target && this.clock.getElapsedTime() > this.duration) {
      this.animating = false;
      this.vectices = this.target
    }
  }

}