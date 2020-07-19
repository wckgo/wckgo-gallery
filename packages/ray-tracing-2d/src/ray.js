import { Vec3 } from "./Vec3";

export default class Ray {
  constructor(origin, direction) {
    this.origin = origin.clone();
    this.direction = direction.clone();
  }

  at(t) {
    return this.origin.clone().add(this.direction.clone().multiply(t));
  }
}