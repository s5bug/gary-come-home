#pragma glslify: noise3D = require('glsl-noise/simplex/3d')

attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uAmplitude;

varying lowp vec4 vColor;

void main(void) {
    vec3 intoNoise = vec3(aVertexPosition.x / 5.0, aVertexPosition.y / 5.0, uTime / 10000.0);
    float terrainHeight = noise3D(intoNoise) / 2.0;
    vec3 simplexPoint = vec3(aVertexPosition.x, terrainHeight * uAmplitude, aVertexPosition.y);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(simplexPoint, 1.0);
    vColor = aVertexColor;
}
