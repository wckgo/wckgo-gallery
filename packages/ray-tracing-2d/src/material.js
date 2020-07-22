import { random_unit_vector, reflect, refract, normalize, dot, random_unit_sphere, Vec3, random } from "./util";
import Ray from "./ray";

function schlick(cosine, ref_idx) {
  let r0 = (1 - ref_idx) / (1 + ref_idx);
  r0 = r0 * r0;
  return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
}

export class lambertian {
  constructor(albedo) {
    this.albedo = albedo;
  }

  scatter(r_in, rec) {
    const scatter_direction = random_unit_vector().add(rec.normal);
    return {
      scattered: new Ray(rec.p.clone(), scatter_direction),
      attenuation: this.albedo.clone(),
      scatter: true
    };
  }

}

export class metal {
  constructor(albedo, fuzz) {
    this.albedo = albedo;
    this.fuzz = fuzz;
  }

  scatter(r_in, rec) {
    const reflected = reflect(normalize(r_in.direction), rec.normal);
    const scattered = new Ray(rec.p, reflected.add(random_unit_sphere().multiply(this.fuzz)));
    return {
      scattered,
      attenuation: this.albedo,
      scatter: dot(scattered.direction, rec.normal) > 0
    };
  }
}

export class dielectric {
  constructor(ref_idx) {
    this.ref_idx = ref_idx;
  }

  scatter(r_in, rec) {
    const attenuation = new Vec3(1, 1, 1);
    const etai_over_etat = (rec.front_face) ? (1 / this.ref_idx) : (this.ref_idx);
    const unit_direction = normalize(r_in.direction);
    const cos_theta = Math.min(dot(unit_direction.clone().multiply(-1), rec.normal), 1.0);
    const sin_theta = Math.sqrt(1.0 - cos_theta * cos_theta);
    let scattered;
    if (etai_over_etat * sin_theta > 1.0) {
      const reflected = reflect(unit_direction, rec.normal);
      scattered = new Ray(rec.p, reflected.clone());
      return {
        scattered,
        attenuation,
        scatter: true
      };
    }
    const reflect_prob = schlick(cos_theta, etai_over_etat);
    if (random() < reflect_prob) {
      const reflected = reflect(unit_direction, rec.normal);
      scattered = new Ray(rec.p, reflected.clone());
      return {
        scattered,
        attenuation,
        scatter: true
      };
    }
    const refracted = refract(unit_direction, rec.normal, etai_over_etat);
    scattered = new Ray(rec.p, refracted.clone());
    return {
      scattered,
      attenuation,
      scatter: true
    };
  }

}