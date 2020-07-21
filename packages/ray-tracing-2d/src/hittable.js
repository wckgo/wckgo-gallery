import { dot } from "./util";

export class HitRecord {
  constructor(p, normal, mat, t, front_face) {
    this.p = p;
    this.normal = normal;
    this.mat = mat;
    this.t = t;
    this.front_face = front_face;
  }

  set_face_normal(ray, outwardNormal) {
    this.front_face = dot(ray.direction, outwardNormal) < 0;
    this.normal = this.front_face ? outwardNormal : outwardNormal.multiply(-1);
  }
}