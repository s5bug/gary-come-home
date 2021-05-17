import { mat3, mat4, vec3 } from 'gl-matrix';
import type { ProgramInfo } from './shader';
import { initShaderProgram } from './shader';

export class Skybox {
    context: WebGLRenderingContext;
    skyboxProgram: ProgramInfo;
    vertexBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;

    constructor(context: WebGLRenderingContext, skyboxProgram: ProgramInfo, vertexBuffer: WebGLBuffer, colorBuffer: WebGLBuffer) {
        this.context = context;
        this.skyboxProgram = skyboxProgram;
        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;
    }

    static async init(gl: WebGLRenderingContext): Promise<Skybox> {
        const skyboxVert = await fetch("shaders/skybox.vert").then(r => r.text());
        const skyboxFrag = await fetch("shaders/skybox.frag").then(r => r.text());

        const skyboxShaderProgram = initShaderProgram(gl, skyboxVert, skyboxFrag);
        const skyboxProgramInfo = {
            program: skyboxShaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(skyboxShaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(skyboxShaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(skyboxShaderProgram, 'uProjectionMatrix'),
                viewMatrix: gl.getUniformLocation(skyboxShaderProgram, 'uViewMatrix'),
            },
        }

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        const positions = [
            // Far
            -1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,

            // Left
            -1.0, -1.0,  1.0,
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

             // Near
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Up
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,

            // Down
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        const l = [0x48/0xFF, 0x34/0xFF, 0x75/0xFF, 1.0];
        const d = [0x14/0xFF, 0x18/0xFF, 0x52/0xFF, 1.0];

        const colors = [
            d, l, l, l, d, d,
            l, l, d, d, d, l,
            l, l, d, d, d, l,
            l, d, d, d, l, l,
            d, d, d, d, d, d,
            l, l, l, l, l, l
        ].flat();

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return new Skybox(gl, skyboxProgramInfo, vertexBuffer, colorBuffer);
    }

    get gl() {
        return this.context;
    }

    render(time: number, projectionMatrix: mat4, modelViewMatrix: mat4): void {
        this.gl.depthMask(false);

        {
            const numComponents = 3;
            const tpe = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.vertexAttribPointer(
                this.skyboxProgram.attribLocations.vertexPosition,
                numComponents,
                tpe,
                normalize,
                stride,
                offset
            );
            this.gl.enableVertexAttribArray(
                this.skyboxProgram.attribLocations.vertexPosition
            );
        }

        {
            const numComponents = 4;
            const tpe = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(
                this.skyboxProgram.attribLocations.vertexColor,
                numComponents,
                tpe,
                normalize,
                stride,
                offset
            );
            this.gl.enableVertexAttribArray(
                this.skyboxProgram.attribLocations.vertexColor
            );
        }

        this.gl.useProgram(this.skyboxProgram.program);

        const viewMatrix = mat4.clone(modelViewMatrix);
        const modelTranslation = vec3.create();

        mat4.getTranslation(modelTranslation, viewMatrix);
        vec3.negate(modelTranslation, modelTranslation);

        mat4.translate(viewMatrix, viewMatrix, modelTranslation);

        this.gl.uniformMatrix4fv(
            this.skyboxProgram.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.skyboxProgram.uniformLocations.viewMatrix,
            false,
            viewMatrix);

        {
            const offset = 0;
            const vertexCount = 36;
            this.gl.drawArrays(this.gl.TRIANGLES, offset, vertexCount);
        }

        this.gl.depthMask(true);
    }
}
