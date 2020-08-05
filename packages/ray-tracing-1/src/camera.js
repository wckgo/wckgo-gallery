import { degrees_to_radians, cross, Vec3, random_in_unit_disk, add } from "./util";
import Ray from "./ray";

export default class Camera {
  constructor(lookfrom, lookat, vup, vfov, aspect_ratio, aperture, focus_dist) {
    const theta = degrees_to_radians(vfov);
    const h = Math.tan(theta / 2);
    const viewport_height = 2.0 * h;
    const viewport_width = viewport_height * aspect_ratio;
    const focal_length = 1.0;

    this.w = new Vec3().copy(lookfrom).sub(lookat).normalize();
    this.u = cross(vup, this.w).normalize();
    this.v = cross(this.w, this.u);

    this.origin = lookfrom;
    this.horizontal = new Vec3().copy(this.u).multiply(focus_dist * viewport_width);
    this.vertical = new Vec3().copy(this.v).multiply(focus_dist * viewport_height);
    this.lower_left_corner = this.origin.clone()
      .sub(this.horizontal.clone().division(2))
      .sub(this.vertical.clone().division(2))
      .sub(this.w.clone().multiply(focus_dist));

    this.lens_radius = aperture / 2;
  }

  get_ray(s, t) {
    const rd = random_in_unit_disk().multiply(this.lens_radius);
    const offset = add(this.u.clone().multiply(rd.x), this.v.clone().multiply(rd.y));
    const dir = this.lower_left_corner.clone()
      .add(this.horizontal.clone().multiply(s))
      .add(this.vertical.clone().multiply(t))
      .sub(this.origin)
      .sub(offset);
    return new Ray(add(this.origin, offset), dir);
  }

}