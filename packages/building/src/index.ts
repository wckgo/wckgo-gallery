import { Map } from "mapbox-gl";
import BuildingLayer from "./BuildingLayer";
const accessToken  = "pk.eyJ1Ijoid2NrZ28iLCJhIjoiY2thbHpnNmI5MDA0MDJ5cm16MGxpZnN1biJ9.9qEgTwbCZbxgaMwyxp92-Q";
const map = new Map({
  container: "app",
  accessToken,
  style: "mapbox://styles/mapbox/dark-v10",
  center: [116.405285, 39.904989],
  zoom: 10,
  hash: true
});
map.on('style.load', function() {
  map.addLayer(new BuildingLayer());
});
