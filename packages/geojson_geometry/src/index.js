import { Scene } from "spritejs";
import { Mesh3d, shaders } from "sprite-extend-3d";
import earcut from "earcut";
import truf_distance from "@turf/distance";
import { point as truf_point } from "@turf/helpers";
import { triFan, tesselInset } from "@thi.ng/geom-tessellate";

console.log(triFan)

const container = document.getElementById("app");
const scene = new Scene({
  container,
  width: container.clintWidth,
  height: container.clintHeight
});
const layer = scene.layer3d("fglayer", {
  camera: { fov: 45, z: 3 }
});

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

function interpolateGrid(bbox, polygon, resolution = 2) {
  const grid = turf.pointGrid(bbox, resolution, {
    units: "degrees",
    mask: polygon
  });
  return turf.coordAll(grid);
}

const vert = `
precision highp float;
precision highp int;

attribute vec3 position;
attribute vec4 color;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;

void main() {
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = `precision highp float;
precision highp int;

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}`;

// const texture = layer.createTexture({
//   image: 'https://p1.ssl.qhimg.com/t01080e459e8c8d65e3.jpg',
//   needsUpdate: true,
// });

const polygonProgram = layer.createProgram({
  vertex: vert,
  fragment: frag,
  // ...shaders.NORMAL_TEXTURE,
  transparent: true,
  // texture
  cullFace: null
});

const curveProgram = layer.createProgram({
  ...shaders.POLYLINE,
  transparent: true,
  uniforms: {
    uThickness: { value: 1 }
  }
});

const r = 1;

function tessellate()

function genaratePolygonMesh(polygons, nodes) {
  const model = {
    position: {
      data: [],
      size: 3
    },
    index: {
      data: []
    }
  };
  let offset = 0;
  polygons.forEach((polygon) => {
    const r = tesselInset()(polygon[0])
    console.log(r);
    const coords = polygon.map((coordsSegment) =>
      interpolateLine(coordsSegment, 1)
    );
    const { vertices, holes } = earcut.flatten(coords);
    const indices = earcut(vertices, holes, 2);
    const position = [];
    for (let i = 0; i < vertices.length; i += 2) {
      const lng = vertices[i];
      const lat = vertices[i + 1];
      const xyz = latlngToVec(lng, lat);
      position.push(...xyz);
    }
    // const center = turf.center(turf.polygon(polygon));
    // center.geometry.coordinates
    // model.position.data = model.position.data.concat(position);
    // for (let i = 0; i < indices.length; i++) {
    //   model.index.data.push(indices[i] + offset);
    // }
    // offset += position.length / 3;
    const mesh = new Mesh3d(polygonProgram, {
      model: {
        position: {
          data: position,
          size: 3
        },
        index: {
          data: indices
        }
      },
      colors: "#3498DB"
    });
    nodes.push(mesh);
  });
}

fetch("https://s5.ssl.qhres.com/static/55a302c51bdb20e3.json")
  .then((response) => response.json())
  .then((data) => {
    const nodes = [];
    data.features.forEach((feature) => {
      if (feature.geometry.type === "MultiPolygon") {
        genaratePolygonMesh(feature.geometry.coordinates, nodes);
      } else if (feature.geometry.type === "Polygon") {
        genaratePolygonMesh([feature.geometry.coordinates], nodes);
      }
    });
    layer.append(...nodes);
  });

layer.setOrbit();
