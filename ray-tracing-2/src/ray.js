import { Vec3 } from "./util";

export default class Ray {
  constructor(origin, direction, time = 0.0) {
    this.origin = origin.clone();
    this.direction = direction.clone();
    this.time = time;
  }

  at(t) {
    return this.origin.clone().add(this.direction.clone().multiply(t));
  }
}