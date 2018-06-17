import * as THREE from 'three'

export default class DataPoint extends THREE.Mesh{   
   
    changeColor(percent){
        var tinycolor = require("tinycolor2")
        this.material = new THREE.MeshBasicMaterial( { color:tinycolor("808080").darken(percent).toString() } );
    }
    
}