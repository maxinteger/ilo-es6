import {radians, makePerspective, Quanternion} from './math';
import {Vector3, Matrix} from '../vendor/babylon';

/**
 * Camere class
 *
 * @class
 */
export class Camera {
    constructor() {
        this.quan = new Quanternion();
        this.matrix = Matrix.Identity();
        this.position = Vector3.Zero();
        this.target = Vector3.Zero();
        this.rotate = Vector3.Zero();
        this.frustum = [];
    }

    reset () {
        this.position = Vector3.Zero();
        this.rotate = Vector3.Zero();
        this.update();
    }

    moveTo (x, y, z) {
        this.position.add(new Vector3(x, y, z));
    }

    flyTo (speed) {
        this.position.x += Math.sin(radians(-this.rotate.z) ) * speed;
        this.position.y += Math.cos(radians(-this.rotate.z) ) * speed;
    }

    update () {
        var rMat = Matrix.RotationX(this.rotate.x),
            tMat = Matrix.Identity();

        tMat.m[3 ] = this.position.x;
        tMat.m[7 ] = this.position.y;
        tMat.m[11] = this.position.z;

        this.quan.rotate(90.0, this.rotate.z, this.rotate.y);
        this.matrix = this.quan.toMatrix();
        this.matrix = rMat.multiply( this.matrix.multiply( tMat ) );
    }
}

/**
 * Mash class
 *
 * @class
 */
export class Mesh{
    constructor (name, verticesCount, facesCount) {
        this.name = name;
        this.vertices = new Array(verticesCount);
        this.faces = new Array(facesCount);
        this.rotation = new Vector3(0, 0, 0);
        this.position = new Vector3(0, 0, 0);
    }
}


/**
 * Engine class
 *
 * @class
 */
export class Engine {
    constructor(canvas, meshes) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");
        this.screenW = canvas.width;
        this.screenH = canvas.height;
        this.aspect = this.screenW / this.screenH;

        this.mvMatrix = Matrix.Identity();
        this.perspectiveMatrix = Matrix.Identity();

        this.shaderProgram = null;
        this.vertexPositionAttribute = null;
        this.squareVerticesBuffer = null;

        this.vbos = [];

        this.initShaders();
        this.initRender();
    }

    initRender () {
        this.gl.viewport(0, 0, this.screenW, this.screenH);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }


    loadMeshes (meshes) {
        var gl = this.gl;

        this.vbos = _.each(meshes, function (mesh) {
            var vbo = gl.createBuffer(),
                vertices = _.flatten(_.map(mesh.faces, function (face) {
                    return [mesh.vertices[face.A].toArray(),
                        mesh.vertices[face.B].toArray(),
                        mesh.vertices[face.C].toArray()];
                }));

            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            mesh.buffer = {
                vbo: vbo,
                numOfFace: vertices.length / 3
            };
        });
        this.meshes = meshes;
    }

    initShaders () {
        var gl = this.gl,
            fragmentShader = this.getShader(gl, "shader-fs"),
            vertexShader = this.getShader(gl, "shader-vs");

        // Create the shader program
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            window.alert("Unable to initialize the shader program.");
        }

        gl.useProgram(this.shaderProgram);

        this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.vertexPositionAttribute);
    }

    /**
         getShader

         Loads a shader program by scouring the current document,
         looking for a src with the specified ID.
     */
    getShader (gl, id) {
        var shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.
        if (!shaderScript) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.
        var theSource = "";
        var currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType === 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader src we have,
        // based on its MIME type.
        var shader;

        if (shaderScript.type === "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;  // Unknown shader type
        }

        // Send the source to the shader object
        gl.shaderSource(shader, theSource);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            window.alert("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    clear () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //this.gl.clearColor(0,0,0,0);
    }

    setMatrixUniforms () {
        var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(Matrix.Transpose(this.perspectiveMatrix).toArray()));

        var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.toArray()));
    }

    render (camera, meshes) {
        var gl = this.gl;

        this.clear();

        this.mvMatrix = Matrix.LookAtLH(camera.position, camera.Target, Vector3.Up());
        this.mvMatrix = new Matrix(1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -5.333, 1
        );
        this.perspectiveMatrix = makePerspective(45, this.aspect, 0.1, 100.0);

        _.each(this.meshes, function (mesh) {
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer.vbo);
            gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
            this.setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLES, 0, mesh.buffer.numOfFace);
        }, this);
    }
}