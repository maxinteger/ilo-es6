
import {Camera, Engine} from './ilo/engine';
import {loadFile, loadJSONFile, createMeshesFromJSON} from './ilo/utils';
import {Vector3} from './vendor/babylon';

var canvas, camera, meshes, engine;

function ready () {
    canvas = document.getElementById('canvas');
    camera = new Camera();
    engine = new Engine(canvas);

    camera.position = new Vector3(-0.0, 0.0, 1.0);
    camera.Target   = new Vector3( 0.0, 0.0, 0.0);


    Promise.all([
        loadJSONFile('assets/models/monkey.babylon'),
        loadFile('assets/shader/base.fs.glsl'),
        loadFile('assets/shader/base.vs.glsl')
    ]).then(function(results){
        meshes = createMeshesFromJSON(results[0]);
        engine.loadMeshes(meshes);

        engine.addShader();
        renderLoop();
    });
}

function renderLoop(){
    engine.render(camera);
    //window.requestAnimationFrame(renderLoop, document.body);
}

ready();
