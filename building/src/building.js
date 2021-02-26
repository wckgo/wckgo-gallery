import { BaseObject } from "maptalks.three";
import * as maptalks from 'maptalks';
import * as THREE from 'three';
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { getExtrudeGeometry, getCenterOfPoints } from './util/ExtrudeUtil';
import { getGeoJSONCenter, isGeoJSONPolygon } from './util/GeoJSONUtil';

const OPTIONS = {
  altitude: 0,
  topColor: null,
  bottomColor: '#2d2f61',
};

class Building extends BaseObject {
  constructor(polygons, options, material, layer) {
    const { altitude } = options;
    const centers = [];
    const len = polygons.length;
    for (let i = 0; i < len; i++) {
      const polygon = polygons[i];
      centers.push(isGeoJSONPolygon(polygon) ? getGeoJSONCenter(polygon) : polygon.getCenter());
    }
    const center = getCenterOfPoints(centers);
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, polygons, coordinate: center });
    const geometries = [];
    polygons.forEach(polygon => {
      const height = (isGeoJSONPolygon(polygon) ? polygon.properties : polygon.getProperties() || {}).height || 1;
      const geometry = getExtrudeGeometry(polygon, height, layer, center);
      geometries.push(geometry);
    });
    const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
    super();
    this._initOptions(options);
    this._createMesh(bufferGeometry, material);
    const z = layer.distanceToVector3(altitude, altitude).x;
    const v = layer.coordinateToVector3(center, z);
    this.getObject3d().position.copy(v);
  }
}

export default Building;