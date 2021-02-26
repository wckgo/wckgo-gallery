in float delay;
in vec3 offsetVert;

uniform float pointSize;
uniform float time;
uniform float duration;
uniform vec3[ROUTER_LENGTH] routers;

out vec3 vColor;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(1.29898,7.8233)))  * 4.37585453);
}

void main()
{
  float routerLength = float(ROUTER_LENGTH);
  float current = mod(time, duration + delay) - delay;
  vec4 final;
  if(current < 0.0) {
    current = 0.0;
    final = vec4(routers[0], 1.0);
  } else {
    float a = fract(current / duration);
    float offset = (routerLength - 1.0) * a;
    vec3 floorVec = routers[int(floor(offset))];
    vec3 ceilVec = routers[int(ceil(offset))];
    vec3 target = mix(floorVec, ceilVec, fract(offset));
    mat4 mv = 
      mat4(
        1, 0, 0, 0,
        0, 1,  0, 0,
        0, 0, 1, 0,
        target.x , target.y, target.z, 1
      )
      *
      mat4(
        1, 0, 0, 0,
        0, cos(time * 2.0), -sin(time * 2.0), 0,
        0, sin(time * 2.0), cos(time * 2.0), 0,
        0, 0, 0, 1
      );
    final = mv * vec4(offsetVert * smoothstep(0.0, 1.2, current / 3.0) * (1.0 + rand(vec2(time, length(offsetVert)))), 1.0);
  }
  vColor = normalize(final).xyz;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(final);
  gl_PointSize = pointSize;
}