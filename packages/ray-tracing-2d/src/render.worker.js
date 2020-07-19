import { Vec3, dot } from "./Vec3";
import Ray from "./ray";

self.onmessage = function (event) {
  const { height, width, offset, chunkHeight, workerId, camera } = event.data;
  const preLinePixelCount = width * 4;
  const pixelTotalCount = preLinePixelCount * chunkHeight;
  const buffer = new ArrayBuffer(pixelTotalCount);
  const view = new Uint8ClampedArray(buffer);
  for (let i = 0; i < chunkHeight; i++) {
    for (let j = 0; j < width; j++) {
      const u = j / (width - 1);
      const v = (i + offset) / (height - 1);
      const direction = new Vec3().copy(camera.lower_left_corner)
        .add(new Vec3().copy(camera.horizontal).multiply(u))
        .add(new Vec3().copy(camera.vertical).multiply(v))
        .sub(camera.origin);
      const r = new Ray(new Vec3().copy(camera.origin), direction);
      const color = ray_color(r);
      const index = i * preLinePixelCount + j * 4;
      view[index] = color.x;
      view[index + 1] = color.y;
      view[index + 2] = color.z;
      view[index + 3] = 255;
    }
  }
  self.postMessage({ height, width, offset, chunkHeight, workerId, data: buffer }, [buffer]);
}

function ray_color(ray) {
  let t = hit_sphere(new Vec3(0, 0, -1), 0.5, ray);
  if (t > 0) {
    const n = ray.at(t).sub(new Vec3(0, 0, -1)).normalize();
    return n.add(new Vec3(1, 1, 1)).multiply(0.5).multiply(255);
  }
  const normalize = ray.direction.clone().normalize();
  t = 0.5 * (normalize.y + 1);
  return new Vec3(1, 1, 1).multiply(1 - t).add(new Vec3(0.5, 0.7, 1.0).multiply(t)).multiply(255);
}

function hit_sphere(center, radius, r) {
  const oc = r.origin.clone().sub(center);
  const a = r.direction.length_squared();
  const half_b = dot(oc, r.direction);
  const c = oc.length_squared() - radius ** 2;
  const discriminant = half_b ** 2 - a * c;
  if (discriminant < 0) {
    return -1;
  } else {
    return (-half_b - Math.sqrt(discriminant)) / a;
  }
}