import Delaunator from 'delaunator';
import type { mat4 } from 'gl-matrix';
import PoissonDiskSampling from 'poisson-disk-sampling';
import SimplexNoise from 'simplex-noise';
import { initShaderProgram, ProgramInfo } from './shader';
import terrainVert from './shaders/terrain.vert';
import terrainFrag from './shaders/terrain.frag';

export class Terrain {
    delaunay: Delaunator<[number, number]>;
    points2d: Array<[number, number]>;
    colors: Array<[number, number, number, number]>;
    simplex;

    constructor() {
        const p = new PoissonDiskSampling({
            shape: [500, 500],
            minDistance: 15,
            maxDistance: 25,
            tries: 10
        });
        const filled = p.fill();

        const size = 50;

        this.points2d = filled.map((p: [number, number]) => {
            return [((p[0] / 500) * size) - (size / 2), ((p[1] / 500) * size) - (size / 2)];
        });

        const delaunay: Delaunator<[number, number]> = Delaunator.from(this.points2d, p => p[0], p => p[1]);

        this.delaunay = delaunay;   

        this.simplex = new SimplexNoise();

        const redMin = 150 / 255;
        const redMax = 255 / 255;
        const redRange = redMax - redMin;

        const greenSubMin = 20 / 255;
        const greenSubMax = 50 / 255;
        const greenSubRange = greenSubMax - greenSubMin;

        const blueSubMin = 20 / 255;
        const blueSubMax = 50 / 255;
        const blueSubRange = blueSubMax - blueSubMin;

        this.colors = this.points2d.map(_ => {
            const red = (Math.random() * redRange) + redMin;
            const green = red - ((Math.random() * greenSubRange) + greenSubMin);
            const blue = green - ((Math.random() * blueSubRange) + blueSubMin);
            return [red, green, blue, 1.0];
        });
    }

    toGL(gl: WebGLRenderingContext): GLTerrain {
        return new GLTerrain(gl, this.delaunay, this.points2d, this.colors);
    }
}

export class GLTerrain {
    context: WebGLRenderingContext;
    terrainProgram: ProgramInfo;
    vertexCount: number;
    vertexBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
    elementBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext, delaunay: Delaunator<[number, number]>, points2d: Array<[number, number]>, colors: Array<[number, number, number, number]>) {
        this.context = gl;

        const terrainShaderProgram = initShaderProgram(gl, terrainVert, terrainFrag);
        const terrainProgramInfo = {
            program: terrainShaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(terrainShaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(terrainShaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(terrainShaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(terrainShaderProgram, 'uModelViewMatrix'),
                time: gl.getUniformLocation(terrainShaderProgram, 'uTime'),
                amplitude: gl.getUniformLocation(terrainShaderProgram, 'uAmplitude')
            },
        }
        this.terrainProgram = terrainProgramInfo;

        this.vertexCount = delaunay.triangles.length;

        const vertexArray: Array<number> = points2d.flat();
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;

        const colorArray: Array<number> = colors.flat();
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
        this.colorBuffer = colorBuffer;

        const elementArray: Uint32Array = delaunay.triangles;
        const elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementArray, gl.STATIC_DRAW);
        this.elementBuffer = elementBuffer;
    }

    get gl() {
        return this.context;
    }

    render(time: number, projectionMatrix: mat4, modelViewMatrix: mat4): void {
        {
            const numComponents = 2;
            const tpe = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.vertexAttribPointer(
                this.terrainProgram.attribLocations.vertexPosition,
                numComponents,
                tpe,
                normalize,
                stride,
                offset
            );
            this.gl.enableVertexAttribArray(
                this.terrainProgram.attribLocations.vertexPosition
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
                this.terrainProgram.attribLocations.vertexColor,
                numComponents,
                tpe,
                normalize,
                stride,
                offset
            );
            this.gl.enableVertexAttribArray(
                this.terrainProgram.attribLocations.vertexColor
            );
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);

        this.gl.useProgram(this.terrainProgram.program);

        this.gl.uniformMatrix4fv(
            this.terrainProgram.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.terrainProgram.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        this.gl.uniform1f(
            this.terrainProgram.uniformLocations.time,
            time);
        this.gl.uniform1f(
            this.terrainProgram.uniformLocations.amplitude,
            1.0);
        
        {
            const vertexCount = this.vertexCount;
            const tpe = this.gl.UNSIGNED_INT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, tpe, offset);
        }
    }
}
