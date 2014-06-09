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
    const UV_COUNTS = [6,8,10];
    return _.map(jsonObject.meshes, function(data){
        let verticesArray = data.positions,
            indicesArray = data.indices,
            uvCount = data.uvCount,
            verticesStep = UV_COUNTS[uvCount] || 3;

        var verticesCount = verticesArray.length / verticesStep,
            facesCount = indicesArray.length / 3,
            mesh = new Mesh(data.name, verticesCount, facesCount);

        for (let index = 0; index < verticesCount; index += 1) {
            let x = verticesArray[index * verticesStep],
                y = verticesArray[index * verticesStep + 1],
                z = verticesArray[index * verticesStep + 2];
            mesh.vertices[index] = new Vector3(x, y, z);
        }

        for (let index = 0; index < facesCount; index += 1) {
            let a = indicesArray[index * 3],
                b = indicesArray[index * 3 + 1],
                c = indicesArray[index * 3 + 2];
            mesh.faces[index] = { A: a, B: b, C: c };
        }

        let position = data.position;
        mesh.position = new Vector3(position[0], position[1], position[2]);
        return mesh;
    });
}