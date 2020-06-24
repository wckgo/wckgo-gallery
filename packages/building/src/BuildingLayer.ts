import { CustomLayerInterface, Map, MercatorCoordinate } from "mapbox-gl";
import * as THREE from "three";

export default class BuildingLayer implements CustomLayerInterface {
  id: string = "CustomBuildingLayer";
  type: "custom" = "custom";
  renderingMode?: '2d' | '3d' = "3d";
  map: Map;
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  buildingGroup: THREE.Group = new THREE.Group();
  minzoom: number = 15;
  onAdd(map: Map, gl: WebGLRenderingContext) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    // create two three.js lights to illuminate the model
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    this.scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    this.scene.add(directionalLight2);
    this.scene.add(this.buildingGroup);
    this.map = map;
    // use the Mapbox GL JS map canvas for three.js
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true
    });
    this.renderer.autoClear = false;
  }

  render(gl: WebGLRenderingContext, matrix: number[]) { 
    const zoom = this.map.getZoom();
    if(zoom <= 16) return;
    const m = new THREE.Matrix4().fromArray(matrix);
    this.camera.projectionMatrix = m;
    const features = this.map.querySourceFeatures("composite", {sourceLayer: "building"});
    this.buildingGroup.children.forEach(child => this.buildingGroup.remove(child));
    features.forEach(feature => {
      const geometry = (feature.geometry as GeoJSON.Polygon);
      const height: number = feature.properties["height"];
      const extrudeOptions = {
        steps: 2, 
        depth: height,
        bevelEnabled: false
      }
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff
      });
      geometry.coordinates.forEach(postions => {
        if(postions.length <= 2) return;
        const rect = new THREE.Shape();
        postions.forEach((postion, index) => {
          const coord = MercatorCoordinate.fromLngLat([postion[0], postion[1]]);
          if(index === 0) {
            rect.moveTo(coord.x, coord.y);
          } else {
            rect.lineTo(coord.x, coord.y);
          }
        })
        const geo = new THREE.ShapeGeometry(rect);
        this.buildingGroup.add(new THREE.Mesh(geo, material));
      });
    });
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }
}