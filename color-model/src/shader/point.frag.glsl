#version 300 es
precision mediump float;

in vec3 vColor;

out vec4 out_FragColor;

void main() 
{
	if(length(gl_PointCoord - vec2(0.5)) > 0.5) {
    discard;
  }
	out_FragColor = vec4( vColor, 1.0 );

}
