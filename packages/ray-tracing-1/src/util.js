export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  multiply(t) {
    this.x *= t;
    this.y *= t;
    this.z *= t;
    return this;
  }

  division(t) {
    this.x /= t;
    this.y /= t;
    this.z /= t;
    return this;
  }

  length() {
    return Math.sqrt(this.length_squared());
  }

  length_squared() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  normalize() {
    this.division(this.length());
    return this;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  static random(min = 0, max = 1) {
    return new Vec3(random(min, max), random(min, max), random(min, max));
  }

}

export function add(u, v) {
  return new Vec3(u.x + v.x, u.y + v.y, u.z + v.z);
}

export function sub(u, v) {
  return new Vec3(u.x - v.x, u.y - v.y, u.z - v.z);
}

export function multiply(u, v) {
  return new Vec3(u.x * v.x, u.y * v.y, u.z * v.z);
}

export function dot(u, v) {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function cross(u, v) {
  return new Vec3(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);
}

export function normalize(v) {
  return new Vec3().copy(v).normalize();
}

export function random(min = 0, max = 1) {
  return min + (max - min) * Math.random();
}

export function random_unit_sphere() {
  while (true) {
    const p = Vec3.random();
    if (p.length_squared() >= 1) continue;
    return p;
  }
}

export function random_unit_vector() {
  const a = random(0, 2 * Math.PI);
  const z = random(-1, 1);
  const r = Math.sqrt(1 - z * z);
  return new Vec3(r * Math.cos(a), r * Math.sin(a), z);
}

export function random_in_hemisphere(normal) {
  const in_unit_sphere = random_unit_sphere();
  if (dot(in_unit_sphere, normal) > 0.0) {
    return in_unit_sphere;
  } else {
    return -in_unit_sphere;
  }
}

export function reflect(v, n) {
  return new Vec3().copy(v).sub(new Vec3().copy(n).multiply(dot(v, n) * 2));
}

export function refract(uv, n, etai_over_etat) {
  const cos_theta = dot(new Vec3().copy(uv).multiply(-1), n);
  const r_out_parallel = new Vec3().copy(uv).add(new Vec3().copy(n).multiply(cos_theta)).multiply(etai_over_etat);
  const r_out_perp = new Vec3().copy(n).multiply(-Math.sqrt(1 - r_out_parallel.length_squared()));
  return add(r_out_parallel, r_out_perp);
}

export function random_in_unit_disk() {
  while (true) {
    const p = new Vec3(random(-1, 1), random(-1, 1), 0);
    if (p.length_squared() >= 1)
      continue;
    return p;
  }
}

export function degrees_to_radians(degrees) {
  return degrees * Math.PI / 180;
}

export function clamp(x, min, max) {
  if (x < min)
    return min;
  if (x > max)
    return max;
  return x;
}
