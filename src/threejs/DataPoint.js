import * as THREE from 'three'

export default class DataPoint extends THREE.Mesh{   
   
    changeColor(percent){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color: tinycolor("#aa00ff").lighten(10).toString()});
    }

    lightenColor(percent){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color:tinycolor("#aa00ff").lighten(percent).toString() } );
    }

    darkenColor(percent){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color:tinycolor("#aa00ff").darken(percent).toString() } );
    }
    
}