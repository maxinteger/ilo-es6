
import {Camera, Engine} from './ilo/engine';
import {loadJSONFileAsync, createMeshesFromJSON} from './ilo/utils';
import {Vector3} from './vendor/babylon';

var canvas, camera, meshes, engine;

function ready () {
    canvas = document.getElementById('canvas');
    camera = new Camera();
    engine = new Engine(canvas);

    camera.position = new Vector3(-0.0, 0.0, 1.0);
    camera.Target   = new Vector3( 0.0, 0.0, 0.0);

    loadJSONFileAsync('assets/monkey.babylon').then(function(data){
        meshes = createMeshesFromJSON(data);
        engine.loadMeshes(meshes);
        renderLoop();
    });
}

function renderLoop(){
    engine.render(camera);
    //window.requestAnimationFrame(renderLoop, document.body);
}

ready();
