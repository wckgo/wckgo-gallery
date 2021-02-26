import * as maptalks from "maptalks";
import { MapboxglLayer } from "maptalks.mapboxgl";
import { ThreeLayer } from "maptalks.three";
import * as THREE from "three";
import Building from "./building";

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
const texture = new THREE.TextureLoader().load("http://p0.qhimg.com/t013aad9b06331e755d.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);
buildingLayer.prepareToDraw = function (gl, scene, camera) {
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, -10, 10).normalize();
  scene.add(light);
  const light1 = new THREE.AmbientLight(0xffffff);
  scene.add(light1);
  this.buildingGroup;
};
buildingLayer.draw = function () {
  this.buildingGroup && this.removeMesh(this.buildingGroup);
  const mapbox = mapboxLayer.getGlMap();
  const features = mapbox.querySourceFeatures("composite", {
    sourceLayer: "building",
  });
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: texture
  });
  const material1 = new THREE.MeshStandardMaterial({
    color: 0xAAAAAA,
  });
  const polygons = features.map((feature) => {
    const height = feature.properties["height"];
    const polygon = maptalks.GeoJSON.toGeometry(feature);
    polygon.setProperties({
      height: height + 30,
    });
    return polygon;
  });
  if(polygons.length > 0) {
    const extrudePolygons = new Building(polygons, {interactive: false}, material, this);
    this.buildingGroup = extrudePolygons;
    buildingLayer.addMesh(extrudePolygons);
  }

};
/* buildingLayer.draw = function () {
  this.buildingGroup && this.removeMesh(this.buildingGroup);
  const mapbox = mapboxLayer.getGlMap();
  const features = mapbox.querySourceFeatures("composite", {
    sourceLayer: "building",
  });
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    // map: texture
  });
  const material1 = new THREE.MeshStandardMaterial({
    color: 0xAAAAAA,
  });
  const polygons = features.map((feature) => {
    const height = feature.properties["height"];
    const polygon = maptalks.GeoJSON.toGeometry(feature);
    polygon.setProperties({
      height: height + 30,
    });
    return polygon;
  });
  if(polygons.length > 0) {
    const extrudePolygons = this.toExtrudePolygons(polygons, {interactive: false}, material);
    this.buildingGroup = extrudePolygons;
    buildingLayer.addMesh(extrudePolygons);
  }

}; */
buildingLayer.addTo(map);
console.log(buildingLayer)