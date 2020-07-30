import { Vector3, BufferGeometry, Float32BufferAttribute, Color, Clock, ShaderMaterial, Mesh, DoubleSide, Vector2, TextureLoader, RepeatWrapping } from "three";
import { scene, animationLoop } from "./gl_env";
import earcut from "earcut";
import truf_distance from "@turf/distance";
import { point as truf_point } from "@turf/helpers";
import vert from "./polygon.vert.glsl";
import frag from "./polygon.frag.glsl";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

function latlngToVec(lng, lat, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  const x = Math.sin(phi) * Math.cos(theta) * r;
  const y = Math.cos(phi) * r;
  const z = Math.sin(phi) * Math.sin(theta) * r;
  return [x, y, z];
}
const getInterpolatedVals = (start, end, numPnts) => {
  const result = [];
  const seg = (end - start) / (numPnts + 1);
  for (let i = 1; i <= numPnts; i++) {
    result.push(start + seg * i);
  }
  return result;
};
const interpolateLine = (lineCoords = [], maxDegDistance = 1) => {
  const result = [];
  let prevPnt;
  lineCoords.forEach((pnt) => {
    if (prevPnt) {
      const dist = truf_distance(truf_point(prevPnt), truf_point(pnt), {
        units: "degrees"
      });
      if (dist > maxDegDistance) {
        const numAdditionalPnts = Math.floor(dist / maxDegDistance);
        const lngs = getInterpolatedVals(prevPnt[0], pnt[0], numAdditionalPnts);
        const lats = getInterpolatedVals(prevPnt[1], pnt[1], numAdditionalPnts);
        for (let i = 0, len = lngs.length; i < len; i++) {
          result.push([lngs[i], lats[i]]);
        }
      }
    }
    result.push((prevPnt = pnt));
  });
  return result;
};
function genaratePolygonMesh(polygons) {
  let position = [];
  let index = [];
  let uv = [];
  let offset = 0;
  polygons.forEach((polygon) => {
    const coords = polygon.map((coordsSegment) =>
      interpolateLine(coordsSegment, 1)
    );
    const { vertices, holes } = earcut.flatten(coords);
    const indices = earcut(vertices, holes, 2);
    const cposition = [];
    for (let i = 0; i < vertices.length; i += 2) {
      const lng = vertices[i];
      const lat = vertices[i + 1];
      const xyz = latlngToVec(lng, lat);
      cposition.push(new Vector3(...xyz));
      uv.push(new Vector2(Math.abs(lng % 1), Math.abs(lat % 1)));
    }
    position = position.concat(cposition);
    for (let i = 0; i < indices.length; i++) {
      index.push(indices[i] + offset);
    }
    offset += cposition.length;
  });
  return { position, index, uv };
}

const texture = new TextureLoader().load("http://p0.qhimg.com/t016180698510e89d13.png");
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;

fetch("https://s5.ssl.qhres.com/static/55a302c51bdb20e3.json")
  .then((response) => response.json())
  .then((data) => {
    let geos = [];
    data.features.forEach((feature) => {
      let result;
      if (feature.geometry.type === "MultiPolygon") {
        result = genaratePolygonMesh(feature.geometry.coordinates);
      } else if (feature.geometry.type === "Polygon") {
        result = genaratePolygonMesh([feature.geometry.coordinates]);
      }
      const geomerty = new BufferGeometry();
      geomerty.setAttribute("position",
        new Float32BufferAttribute(new Float32Array(result.position.length * 3), 3).copyVector3sArray(result.position)
      );
      geomerty.setAttribute("uv",
        new Float32BufferAttribute(new Float32Array(result.uv.length * 2), 2).copyVector2sArray(result.uv)
      );
      geomerty.setIndex(result.index);
      geos.push(geomerty);
      
    });
    const geo = BufferGeometryUtils.mergeBufferGeometries(geos);
    const material = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      uniforms: {
        color: {
          value: new Color("#85C1E9")
        },
        map: {
          value: texture
        },
        time: {
          value: 0,
        },
        duration: {
          value: 5.0
        }
      },
      side: DoubleSide
    });
    const mesh = new Mesh(geo, material);
    scene.add(mesh);
    const clock = new Clock(true);
    animationLoop.renderLoopFuncs.add(() => {
      material.uniforms.time.value = clock.getElapsedTime();
    });
  });