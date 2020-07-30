import { scene } from "./gl_context";
import { Vector3, BufferGeometry, ShaderMaterial, Points, Float32BufferAttribute, Matrix3, Matrix4 } from "three";
import * as dat from 'dat.gui';
import pointVertSource from "./shader/point.vert.glsl";
import pointFragSource from "./shader/point.frag.glsl";
import Action from "./action";

const segments = 20;

const vectices = [];
const colors = [];

for (let x = 0; x < segments + 1; x++) {
  for (let y = 0; y < segments + 1; y++) {
    for (let z = 0; z < segments + 1; z++) {
      vectices.push(new Vector3(x - segments / 2, y, z - segments / 2));
      colors.push(new Vector3(x / segments, y / segments, z / segments));
    }
  }
}

const currentVecties = vectices.map(item => item.clone());
const geometry = new BufferGeometry();
geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(currentVecties.length * 3), 3).copyVector3sArray(currentVecties));
geometry.setAttribute("color", new Float32BufferAttribute(new Float32Array(colors.length * 3), 3).copyVector3sArray(colors));
const material = new ShaderMaterial({
  vertexShader: pointVertSource,
  fragmentShader: pointFragSource,
  vertexColors: true,
  uniforms: {
    pointSize: {
      value: 5,
    },
  }
});
const points = new Points(geometry, material);
scene.add(points);
const action = new Action(geometry, vectices, 2);

const options = {
  colorModel: "RGB"
}
const colorModels = ["RGB", "HSL", "HSV", "XYZ", "LMS"];
const gui = new dat.GUI();
const controller = gui.add(options, "colorModel", colorModels);
controller.onChange(value => {
  if (value === "HSL") {
    const target = toHSL(colors);
    action.setTarget(target);
  } else if (value === "RGB") {
    action.setTarget(vectices);
  } else if (value === "HSV") {
    action.setTarget(toHSV(colors));
  } else if (value === "XYZ") {
    action.setTarget(toXYZ(colors));
  } else if (value === "LMS") {
    action.setTarget(toLMS(colors));
  }
});


function toHSL(colors) {
  return colors.map(vectex => {
    const { x, y, z } = vectex;
    const max = Math.max(x, y, z);
    const min = Math.min(x, y, z);
    let h, s, l;
    const d = max - min;
    l = (max + min) * 0.5;
    if (max === min) {
      h = 0;
    } else if (max === x && y >= z) {
      h = 60 * ((y - z) / d);
    } else if (max === x && y < z) {
      h = 60 * ((y - z) / d) + 360;
    } else if (max === y) {
      h = 60 * ((z - x) / d) + 120;
    } else if (max === z) {
      h = 60 * ((x - y) / d) + 240;
    }
    if (l === 0 || max === min) {
      s = 0;
    } else if (l > 0 && l <= 0.5) {
      s = d / (2 * l);
    } else if (l > 0.5) {
      s = d / (2 - 2 * l);
    }
    const r = segments / 2 * s;
    return new Vector3(Math.sin(deg2Rad(h)) * r, l * segments, -Math.cos(deg2Rad(h)) * r);
  });
}

function toHSV(colors) {
  return colors.map(vectex => {
    const { x, y, z } = vectex;
    const max = Math.max(x, y, z);
    const min = Math.min(x, y, z);
    let h, s, v;
    const d = max - min;
    v = max;
    if (max === min) {
      h = 0;
    } else if (max === x && y >= z) {
      h = 60 * ((y - z) / d);
    } else if (max === x && y < z) {
      h = 60 * ((y - z) / d) + 360;
    } else if (max === y) {
      h = 60 * ((z - x) / d) + 120;
    } else if (max === z) {
      h = 60 * ((x - y) / d) + 240;
    }
    if (max === 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }
    const r = segments / 2 * s;
    return new Vector3(Math.sin(deg2Rad(h)) * r, v * segments, -Math.cos(deg2Rad(h)) * r);
  });
}

const xyzMat = new Matrix3();
xyzMat.set(
  0.4887180,  0.3106803,  0.2006017,
  0.1762044,  0.8129847,  0.0108109,
  0.0000000,  0.0102048,  0.9897952
)
const xyzMv = new Matrix4().set(
  segments, 0, 0, 0,
  0, segments, 0, 0,
  0, 0, segments, 0,
  0, 0, 0, 1
);

const xyzMv2 = new Matrix4().set(
  1, 0, 0, -segments / 2,
  0, 1, 0, 0,
  0, 0, 1, -segments / 2,
  0, 0, 0, 1
);

function toXYZ(colors) {
  return colors.map(color => color.clone().applyMatrix3(xyzMat).applyMatrix4(xyzMv).applyMatrix4(xyzMv2));
}

const lmsMat = new Matrix3().set(
  0.3811, 0.5783, 0.0402,
  0.1967, 0.7244, 0.0782,
  0.0241, 0.1288, 0.8444
)

function toLMS(colors) {
  return colors.map(color => color.clone().applyMatrix3(lmsMat).applyMatrix4(xyzMv).applyMatrix4(xyzMv2));
}

function deg2Rad(angle) {
  return Math.PI / 180 * angle;
}