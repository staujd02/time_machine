import * as THREE from 'three'

export default class DataPoint {   

    DataPoint(){
        
    }

    createDataPoint(radius, x, y){
        var geometry = new THREE.CircleGeometry( radius, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0x808080 } );
        var circle = new THREE.Mesh(geometry, material );
        circle.position.set(x, y, 1);
        return circle;
    }
}