#version 300 es

uniform float pointSize;

out vec3 vColor;

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = pointSize;
  vColor = color;
}