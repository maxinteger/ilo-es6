import {Mesh} from './engine';
import {Vector3} from '../vendor/babylon';

/**
 * Load JSON files
*/
export function loadJSONFileAsync (fileName, callback) {
    var jsonObject = {},
        xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", fileName, true);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            jsonObject = JSON.parse(xmlHttp.responseText);
            callback(jsonObject);
        }
    };
    xmlHttp.send(null);
}

/**
 * Create Mash array from Babylon JSON Model file
*/
export function createMeshesFromJSON (jsonObject) {
    var UV_COUNTS = [6,8,10];
    return _.map(jsonObject.meshes, function(data){
        var verticesArray = data.positions,
            indicesArray = data.indices,
            uvCount = data.uvCount,
            verticesStep = UV_COUNTS[uvCount] || 3;

        var verticesCount = verticesArray.length / verticesStep,
            facesCount = indicesArray.length / 3,
            mesh = new Mesh(data.name, verticesCount, facesCount);

        for (var i = 0; i < verticesCount; i += 1) {
            var x = verticesArray[i * verticesStep],
                y = verticesArray[i * verticesStep + 1],
                z = verticesArray[i * verticesStep + 2];
            mesh.vertices[i] = new Vector3(x, y, z);
        }

        for (var j = 0; j < facesCount; j += 1) {
            var a = indicesArray[j * 3],
                b = indicesArray[j * 3 + 1],
                c = indicesArray[j * 3 + 2];
            mesh.faces[j] = { A: a, B: b, C: c };
        }

        var position = data.position;
        mesh.position = new Vector3(position[0], position[1], position[2]);
        return mesh;
    });
}