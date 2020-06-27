import * as maptalks from "maptalks";
import { MapboxglLayer } from "maptalks.mapboxgl";
import { ThreeLayer } from "maptalks.three";
import * as THREE from "three";
import { KeepStencilOp } from "three";

const accessToken =
  "pk.eyJ1Ijoid2NrZ28iLCJhIjoiY2thbHpnNmI5MDA0MDJ5cm16MGxpZnN1biJ9.9qEgTwbCZbxgaMwyxp92-Q";
const map = new maptalks.Map("app", {
  center: [116.405285, 39.904989],
  zoom: 10,
  maxPitch: 60,
});
const mapboxLayer = new MapboxglLayer("tile", {
  glOptions: {
    style: "mapbox://styles/mapbox/dark-v10",
    accessToken,
    hash: true,
  },
}).addTo(map);
const buildingLayer = new ThreeLayer("building", {
  forceRenderOnMoving: true,
  forceRenderOnRotating: true,
});
const texture = new THREE.TextureLoader().load("assets/wall.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
buildingLayer.prepareToDraw = function (gl, scene, camera) {
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, -10, 10).normalize();
  scene.add(light);
  const light1 = new THREE.AmbientLight(0xffffff);
  scene.add(light1);
  this.buildingGroup = new Map();
};
buildingLayer.draw = function () {
  const mapbox = mapboxLayer.getGlMap();
  const features = mapbox.querySourceFeatures("composite", {
    sourceLayer: "building",
  });
  const ids = [];
  const add = [];
  const deletes = [];
  features.forEach((feature) => {
    const id = feature.id;
    ids.push(id);
    if (this.buildingGroup.has(id)) return;
    const _texture = texture.clone();
    _texture.needsUpdate = true
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: _texture,
      side: THREE.DoubleSide,
    });
    const height = feature.properties["height"];
    const mesh = this.toExtrudePolygon(
      maptalks.GeoJSON.toGeometry(feature),
      {
        height: height + 30,
      },
      material
    );
    add.push(mesh);
    this.buildingGroup.set(id, mesh);
  });
  const keys = this.buildingGroup.keys();
  for (let key of keys) {
    if (!ids.includes(key)) {
      deletes.push(this.buildingGroup.get(key));
      this.buildingGroup.delete(key);
    }
  }
  this.addMesh(add);
  this.removeMesh(deletes);
};
buildingLayer.addTo(map);
console.log(buildingLayer)