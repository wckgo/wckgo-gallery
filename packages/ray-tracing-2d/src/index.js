import { Vec3 } from "./util";
import { random_scene } from "./scene";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const preLinePixelCount = width * 4;

const aspect_ratio = width / height;
const viewport_height = 2.0;
const viewport_width = aspect_ratio * viewport_height;
const focal_length = 1.0;

const lookfrom = new Vec3(13, 2, 3);
const lookat = new Vec3();
const vup = new Vec3(0, 1, 0);
const dist_to_focus = 10.0;
const aperture = 0.1;

const camera = {
  lookfrom,
  lookat,
  vup,
  aspect_ratio,
  dist_to_focus,
  aperture
};

const image = context.createImageData(width, height);

import Worker from "./render.worker.js"

const cores = navigator.hardwareConcurrency;
const workers = [];

for (let i = 0; i < cores; i++) {
  const chunkRenderWorker = new Worker();
  chunkRenderWorker.addEventListener('message', applayPixels);
  workers.push({
    status: "free",
    workerId: i,
    worker: chunkRenderWorker
  });
}

const world = random_scene();
render(width, height);

function applayPixels(event) {
  const { offset, data, workerId, chunkHeight, height } = event.data;
  const view = new Uint8ClampedArray(data);
  for (let i = 0; i < chunkHeight; i++) {
    const currentHeight = height - (offset + i);
    for (let j = 0; j < preLinePixelCount; j++) {
      image.data[((currentHeight - 1) * preLinePixelCount) + j] = view[i * preLinePixelCount + j];
    }
  }
  workers[workerId].status = "free";
  tryApplayImage();
  console.log("done " + workerId);
}

function tryApplayImage() {
  const canDraw = workers.findIndex(worker => worker.status === "busy") === -1;
  canDraw && context.putImageData(image, 0, 0);
}

function render(width, height) {
  const chunkLength = ~~(height / cores);
  workers.forEach(worker => worker.status = "busy");
  workers.forEach((threed, index) => {
    const h = index === workers.length - 1 ? height - (index * chunkLength) : chunkLength;
    threed.worker.postMessage({
      chunkHeight: h,
      offset: index * chunkLength,
      width,
      height,
      camera,
      workerId: threed.workerId,
      world
    });
  });
}
