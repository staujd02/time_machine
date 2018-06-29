import * as THREE from 'three'

export default class DataPoint extends THREE.Mesh{   
   
    resetColor(){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color: tinycolor("#aa00ff").toString()});
    }

    changeColor(newColor){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color:tinycolor({r: newColor[0], g: newColor[1], b: newColor[2]}).toString()});
    }
    
    lightenColor(baseColor, percent){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color:tinycolor({r: baseColor[0], g: baseColor[1], b: baseColor[2]}).lighten(percent).toString() } );
    }

    darkenColor(baseColor, percent){
        var tinycolor = require("tinycolor2");
        this.material = new THREE.MeshBasicMaterial( { color:tinycolor({r: baseColor[0], g: baseColor[1], b: baseColor[2]}).darken(percent).toString() } );
    }

    withinCircle(x, y, radius){//Checks if inputted point is within circle
        //alert("DATA POINT POSITION: " + this.position.x + "\\" + this.position.y);
        var distance = Math.sqrt((x - this.position.x)*(x - this.position.x) + (y - this.position.y)*(y - this.position.y))
        if(distance > radius){
            return false;
        }else{
            return true;
        }
    }
    
}