import { mat4 } from 'gl-matrix';
import type { ProgramInfo } from './shader';
import { initShaderProgram } from './shader';
import { Skybox } from './skybox';
import { GLTerrain, Terrain } from './terrain';
import defaultVert from './shaders/default.vert';
import defaultFrag from './shaders/default.frag';
import colorVert from './shaders/color.vert';
import colorFrag from './shaders/color.frag';

export class Scene {
    context: WebGLRenderingContext;
    defaultProgram: ProgramInfo;
    skybox: Skybox;
    terrain: GLTerrain;

    constructor(context: WebGLRenderingContext, defaultProgram: ProgramInfo, skybox: Skybox, terrain: GLTerrain) {
        this.context = context;
        this.defaultProgram = defaultProgram;
        this.skybox = skybox;
        this.terrain = terrain;
    }

    static async init(canvas: HTMLCanvasElement): Promise<Scene> {
        const gl: WebGLRenderingContext = canvas.getContext('webgl');
        gl.getExtension('OES_element_index_uint');
    
        const defaultShaderProgram = initShaderProgram(gl, defaultVert, defaultFrag);
        const defaultProgramInfo = {
            program: defaultShaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(defaultShaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(defaultShaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(defaultShaderProgram, 'uModelViewMatrix'),
            },
        };

        const colorShaderProgram = initShaderProgram(gl, colorVert, colorFrag);
        const colorProgramInfo = {
            program: colorShaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(colorShaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(colorShaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(colorShaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(colorShaderProgram, 'uModelViewMatrix'),
            },
        };

        const skybox: Skybox = await Skybox.init(gl);
        const terrain: GLTerrain = new Terrain().toGL(gl);
    
        return new Scene(gl, colorProgramInfo, skybox, terrain);
    }

    get gl() {
        return this.context;
    }

    draw(time: number, w: number, h: number): void {
        this.gl.viewport(0, 0, w, h);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;
        const aspect = w / h;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar);

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix,
                       modelViewMatrix,
                       [0.0, -1.0, -10.0]); 

        this.skybox.render(time, projectionMatrix, modelViewMatrix);
        this.terrain.render(time, projectionMatrix, modelViewMatrix);
    }
}
