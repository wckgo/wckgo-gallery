import { CustomLayerInterface } from "mapbox-gl";

export default class BuildingLayer implements CustomLayerInterface {
  id: string = "BuildingLayer";
  type: "custom" = "custom";
  renderingMode?: '2d' | '3d' = "3d";
  render() {

  }
}