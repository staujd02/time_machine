import * as THREE from 'three'

export default class DataPoint extends THREE.Mesh{   

    constructor(dataPointGeometry, dataPointMaterial, hexColor){
        super(dataPointGeometry, dataPointMaterial);
        const tinycolor = require("tinycolor2");
        this.properties = {
            hexColor: hexColor || "#aa00ff",
            computedColor: () => { return this.properties.computedTinycolor().toString(); },
            computedTinycolor: () =>{ return new tinycolor(this.properties.hexColor); },
            computedMesh: () => { return new THREE.MeshBasicMaterial( this.properties ); }
        };
        this.properties = {
            color: tinycolor(this.properties.hexColor).toString()
        };
    }
   
    resetColor(){
        this.properties.hexColor = "#aa00ff";
        this.properties.color = this.properties.computedColor();
        this.material = this.properties.computedMesh();
    }
    
    // lightenColor(percent){
    //     this.properties.color = this.properties.computedTinycolor().lighten(percent);
    //     this.material = this.properties.computedMesh();
    // }

    // darkenColor(percent){
    //     this.properties.color = this.properties.computedTinycolor().darken(percent);
    //     this.material = this.properties.computedMesh();
    // }

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
        var distance = Math.sqrt((x - this.position.x)*(x - this.position.x) + (y - this.position.y)*(y - this.position.y))
        return !(distance > radius);
    }
    
}