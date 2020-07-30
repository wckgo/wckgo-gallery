#version 300 es
precision mediump float;

uniform vec3 color;
uniform sampler2D map;
uniform float time;
uniform float duration;

in vec2 vUv;
out vec4 out_FragColor;

float brightness(vec4 color) {
	return 0.3 * color.x + 0.6 * color.y + 0.1 * color.z;
}

void main() 
{
	float d = duration * 2.0;
	float t = mod(time, d);
	vec4 color1 = texture( map, vUv);
	float b = brightness(color1);
	if(t > duration) {
		if (b > (t - duration) / duration) {
			discard;
		}
	} else {
		if(b < t / duration) {
			discard;
		}
	}
	out_FragColor = vec4(color, 0.5);
}
