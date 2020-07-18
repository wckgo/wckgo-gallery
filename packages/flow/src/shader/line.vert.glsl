#version 300 es

out vec3 vColor;

void main() 
{

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vColor = normalize(position);

}
