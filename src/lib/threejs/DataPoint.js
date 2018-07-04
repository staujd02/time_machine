import * as THREE from 'three'

export default class DataPoint extends THREE.Mesh{   

    constructor(props){
        super(props);
        const tinycolor = require("tinycolor2");
        this.properties = {
            color: tinycolor("#aa00ff").toString(),
            hexColor: "#aa00ff",
            computedColor: () => { return this.properties.computedTinycolor().toString(); },
            computedTinycolor: () =>{ return new tinycolor(this.properties.hexColor); },
            computedMesh: () => { return new THREE.MeshBasicMaterial( this.properties ); }
        };
    }
   
    resetColor(){
        this.properties.hexColor = "#aa00ff";
        this.properties.color = this.properties.computedColor();
        this.material = this.properties.computedMesh();
    }
    
    lightenColor(percent){
        this.properties.color = this.properties.computedTinycolor().lighten(percent);
        this.material = this.properties.computedMesh();
    }

    darkenColor(percent){
        this.properties.color = this.properties.computedTinycolor().darken(percent);
        this.material = this.properties.computedMesh();
    }

    withinCircle(x, y, radius){//Checks if inputted point is within circle
        var distance = Math.sqrt((x - this.position.x)*(x - this.position.x) + (y - this.position.y)*(y - this.position.y))
        return !(distance > radius);
    }
    
}