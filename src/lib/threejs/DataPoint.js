import * as THREE from 'three'

export default class DataPoint extends THREE.Mesh{   
   
    resetColor(){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color: tinycolor("#aa00ff").toString()});
    }

    changeColor(percent){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color: tinycolor("#aa00ff").lighten(percent).toString()});
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