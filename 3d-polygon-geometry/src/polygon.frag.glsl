#version 300 es
precision mediump float;

uniform vec3 color;
uniform vec3 scanColor;
uniform sampler2D map;
uniform float time;
uniform float duration;

in vec2 vUv;
out vec4 out_FragColor;

const vec3 luminanceWeighting = vec3(0.2125, 0.7154, 0.0721);

float brightness(vec4 color) {
	return dot(color.rgb, luminanceWeighting);
}

void main() 
{
	float d = duration * 2.0;
	float t = mod(time, d);
	vec4 color1 = texture( map, vUv);
	float b = brightness(color1);
	float ratio = 0.0;
	float low, mid, hi;
	if(t > duration) {
		float r = (t - duration) / duration;
		low = r;
		hi = r + 0.02;
		mid = (hi + low) / 2.0;
		if (b > r && b < r + 0.02) {
			low = r;
			hi = r + 
			ratio = 0.3;
		}
	} else {
		low = 
		if(b < t / duration && b > t / duration - 0.02) {
			ratio = 0.3;
		}
	}
	if(ratio == 0.0) {
		out_FragColor = vec4(color, 1.0);
	} else {
		out_FragColor = vec4(scanColor + ratio, 1.0);
	}
}
