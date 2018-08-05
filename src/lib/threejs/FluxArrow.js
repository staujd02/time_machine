import * as THREE from 'three'

class FluxArrow {
    constructor (scene, arrowInfo){
        this.calculateLength = function(){
            //Length from center to center
            let distance = Math.sqrt((arrowInfo.point2.x - arrowInfo.point1.x) * (arrowInfo.point2.x - arrowInfo.point1.x)
             + (arrowInfo.point2.y - arrowInfo.point1.y) *(arrowInfo.point2.y - arrowInfo.point1.y));
             //Moves each end to edge of circle plus 1/4 of radius more
             distance = distance - 2.5 * (arrowInfo.dataPointRadius)
             return distance;
        };
        this.calculateDir = function(){
            return new THREE.Vector3(arrowInfo.point2.x - arrowInfo.point1.x, arrowInfo.point2.y - arrowInfo.point1.y, 0);
        }
        this.calculatePos = function(){
            var adjust = new THREE.Vector3(1.25 * 40 * this.dir.x, 1.25 * 40 * this.dir.y, 0)//1.25 * 40 = To edge + 1/4 of circle radius
            return new THREE.Vector3(arrowInfo.point1.x + adjust.x, arrowInfo.point1.y + adjust.y, 0)
        }

        this.baseColor = "#222222"
        this.scene = scene;
        this.object = {};
        this.dir = this.calculateDir();
        this.dir.normalize();
        this.length = this.calculateLength();
        this.position = this.calculatePos();

        this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, this.baseColor );
        scene.add(this.object);
    };
}

export default FluxArrow