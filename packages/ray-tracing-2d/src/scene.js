import { random, Vec3, sub, multiply } from "./util";

export function random_scene() {
  const word = [];
  word.push({
    center: { x: 0, y: -1000, z: 0 },
    radius: 1000,
    mat: {
      type: "lambertian",
      arg: [{ x: 0.5, y: 0.5, z: 0.5 }]
    }
  });
  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      const choose_mat = random();
      const center = new Vec3(a + 0.9 * random(), 0.2, b + 0.9 * random());
      const point = new Vec3(4, 0.2, 0);
      if (sub(center, point).length() > 0.9) {
        if (choose_mat < 0.8) {
          // diffuse
          const albedo = multiply(Vec3.random(), Vec3.random());
          word.push({
            center,
            radius: 0.2,
            mat: {
              type: "lambertian",
              arg: [albedo]
            }
          });
        } else if (choose_mat < 0.95) {
          // metal
          const albedo = Vec3.random(0.5, 1);
          const fuzz = random(0, 0.5);
          word.push({
            center,
            radius: 0.2,
            mat: {
              type: "metal",
              arg: [albedo, fuzz]
            }
          });
        }
        else {
          // glass
          word.push({
            center,
            radius: 0.2,
            mat: {
              type: "dielectric",
              arg: [1.5]
            }
          });
        }
      }
    }
  }
  
  word.push({
    center: { x: 0, y: 1, z: 0 },
    radius: 1,
    mat: {
      type: "dielectric",
      arg: [1.5]
    }
  });
  word.push({
    center: { x: -4, y: 1, z: 0 },
    radius: 1,
    mat: {
      type: "lambertian",
      arg: [{ x: 0.4, y: 0.2, z: 0.1 }]
    }
  });
  word.push({
    center: { x: 4, y: 1, z: 0 },
    radius: 1,
    mat: {
      type: "metal",
      arg: [{ x: 0.7, y: 0.6, z: 0.5 }, 0]
    }
  });
  return word;
}

