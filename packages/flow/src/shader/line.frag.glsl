#version 300 es

precision highp float;
precision highp int;

in vec3 vColor;

out vec4 out_FragColor;

void main() 
{

	out_FragColor = vec4( vColor, 1.0 );

}
