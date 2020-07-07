import { getExtrudeGeometry, getCenterOfPoints } from '../util/ExtrudeUtil';
import { getGeoJSONCenter, isGeoJSONPolygon } from '../util/GeoJSONUtil';

self.addEventListener("message", event => {
  const { polygons } = event.data;
  const centers = [];
  const len = polygons.length;
  for (let i = 0; i < len; i++) {
    const polygon = polygons[i];
    centers.push(isGeoJSONPolygon(polygon) ? getGeoJSONCenter(polygon) : polygon.getCenter());
  }
  const center = getCenterOfPoints(centers);
  


});