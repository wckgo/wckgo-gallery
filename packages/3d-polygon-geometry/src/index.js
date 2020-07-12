import * as THREE from "three";
import { scene } from "./gl_env";
import earcut from "earcut";
import bbox from "@turf/bbox";
import hexGrid from "@turf/hex-grid";
import union from "@turf/union";

const girdHelper = new THREE.GridHelper(100, 100, 0x888888);
scene.add(girdHelper);

const r = 5;

const test = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              77.6953125,
              47.15984001304432
            ],
            [
              77.34374999999999,
              15.284185114076433
            ],
            [
              133.06640625,
              14.093957177836224
            ],
            [
              138.33984375,
              49.03786794532644
            ],
            [
              77.6953125,
              47.15984001304432
            ]
          ]
        ]
      }
    }
  ]
};





// const coords = grid.features.flatMap((feature) => {
//   // const coords = feature.geometry.coordinates[0];
//   // for(let i = 0; i < 3; i++) {
//   //   vertices.push(new THREE.Vector3(...polar2Cartesian(...coords[i], r))) ;
//   // } 
//   return feature.geometry.coordinates[0]
// });
// const indices = earcut(coords);
// const vertices = coords.map(([lng, lat]) => new THREE.Vector3(...polar2Cartesian(lat, lng, r)));

// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute(
//   "position",
//   new THREE.Float32BufferAttribute(
//     new Float32Array(vertices.length * 3),
//     3
//   ).copyVector3sArray(vertices)
// );
// geometry.setIndex(indices);
// geometry.computeVertexNormals();
// const material = new THREE.MeshStandardMaterial({
//   color: 0xFF0000,
//   wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

fetch("assets/100000.json")
  .then((response) => response.json())
  .then((data) => data.features[0].geometry.coordinates)
  .then((multiyPolygon) => {
    // multiyPolygon.forEach((polygon) => {
    //   const geometry = genarateGeometry(polygon);
    //   const material = new THREE.MeshStandardMaterial({
    //     color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    //     wireframe: true,
    //   });
    //   const mesh = new THREE.Mesh(geometry, material);
    //   scene.add(mesh);
    // });
    // const geometry = genarateGeometry(test);
    // const material = new THREE.MeshStandardMaterial({
    //   color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    //   // wireframe: true,
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
  });

function genarateGeometry(polygon) {
  const coord3d = []
  polygon.forEach((p) =>
    p.forEach((coord, index) => {
      if(index !== p.length - 1) {
        const d = distance(coord, p[index + 1])
        if(d / 4 > 1) {
          for(let i = 0; i < d / 4; i++) {

          }  
        }
      }
      polar2Cartesian(...coord, r)
    })
  );
  const { vertices, holes } = earcut.flatten(coords3d);
  const indices = earcut(earcut.flatten(polygon).vertices, holes, 2);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(Float32Array.from(vertices), 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function polar2Cartesian(lat, lng, r = 0) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function distance(coord1, coord2) {
  const lon_distance = Math.abs(coord1[0] - coord2[0]);
  const lat_distance = Math.abs(coord1[1] - coord2[1]);
  return Math.sqrt(lon_distance ** 2 + lat_distance ** 2);
}

function interpolation(coord1, coord2, unit) {
  const lon_distance = Math.abs(coord1[0] - coord2[0]);
  const lat_distance = Math.abs(coord1[1] - coord2[1]);
  
}