import { dot, sub } from "./util";

export default class Sphere {
  constructor(center, radius, mat) {
    this.center = center;
    this.radius = radius;
    this.mat = mat;
  }

  hit(ray, tmin, tmax, rec) {
    const oc = ray.origin.clone().sub(this.center);
    const a = ray.direction.length_squared();
    const half_b = dot(oc, ray.direction);
    const c = oc.length_squared() - this.radius * this.radius;
    const discriminant = half_b * half_b - a * c;
    if (discriminant > 0) {
      const root = Math.sqrt(discriminant);
      let temp = (-half_b - root) / a;
      if (temp < tmax && temp > tmin) {
        rec.t = temp;
        rec.p = ray.at(temp);
        rec.normal = sub(rec.p, this.center).division(this.radius);
        const outward_normal = sub(rec.p, this.center).division(this.radius);
        rec.set_face_normal(ray, outward_normal);
        rec.mat = this.mat;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tmax && temp > tmin) {
        rec.t = temp;
        rec.p = ray.at(rec.t);
        rec.normal = sub(rec.p, this.center).division(this.radius);
        const outward_normal = sub(rec.p, this.center).division(this.radius);;
        rec.set_face_normal(ray, outward_normal);
        rec.mat = this.mat;
        return true;
      }
    }
    return false;
  }
}