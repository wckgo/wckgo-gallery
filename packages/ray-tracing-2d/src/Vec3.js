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

}

export function add(u, v) {
  return vec3(u.x + v.x, u.y + v.y, u.z + v.z);
}

export function sub(u, v) {
  return vec3(u.x - v.x, u.y - v.y, u.z - v.z);
}

export function dot(u, v) {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function cross(u, v) {
  return vec3(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);
}

export function normalize(v) {
  return v.clone().normalize();
}
