import * as THREE from 'three'

class FluxArrow {
    constructor (scene, arrowInfo){
        const arrowLength = 22;
        const arrowWidth = 15;
        var tinycolor = require('tinycolor2');
        this.arrowInfo = arrowInfo;

        this.calculateLength = function(){
            //Length from center to center
            let distance = Math.sqrt((this.arrowInfo.point2.x - this.arrowInfo.point1.x) * (this.arrowInfo.point2.x - this.arrowInfo.point1.x)
             + (this.arrowInfo.point2.y - this.arrowInfo.point1.y) *(this.arrowInfo.point2.y - this.arrowInfo.point1.y));
             //Moves each end to edge of circle plus 1/4 of radius more
             distance = distance - 2.5 * (this.arrowInfo.dataPointRadius)
             return distance;
        };
        this.calculateDir = function(){
            return new THREE.Vector3(this.arrowInfo.point2.x - this.arrowInfo.point1.x, this.arrowInfo.point2.y - this.arrowInfo.point1.y, 0);
        }
        this.calculatePos = function(){
            var adjust = new THREE.Vector3(1.25 * 40 * this.dir.x, 1.25 * 40 * this.dir.y, 0)//1.25 * 40 = To edge + 1/4 of circle radius
            return new THREE.Vector3(this.arrowInfo.point1.x + adjust.x, this.arrowInfo.point1.y + adjust.y, 0)
        }

        this.baseColor = "#222222"
        this.scene = scene;
        this.object = {};
        this.dir = this.calculateDir();
        this.dir.normalize();
        this.length = this.calculateLength();
        this.position = this.calculatePos();

        this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, this.baseColor, arrowLength, arrowWidth);

        scene.add(this.object);

        this.lightenColor = function (percent) {
           scene.remove(this.object)//Remove old colored arrow
            var newColor = tinycolor(this.baseColor).lighten(percent).toString();
           this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, newColor, arrowLength, arrowWidth);
            scene.add(this.object)//Add newly colored arrow
        };

        this.darkenColor = function (percent) {
            scene.remove(this.object)//Remove old colored arrow
            var newColor = tinycolor(this.baseColor).darken(percent).toString();
            this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, newColor, arrowLength, arrowWidth);
            scene.add(this.object)//Add newly colored arrow
        };

        this.updatePos = function(to, from){
            this.arrowInfo.point1 = to;
            this.arrowInfo.point2 = from;

            this.dir = this.calculateDir();
            this.dir.normalize();
            this.length = this.calculateLength();
            this.position = this.calculatePos();

            this.object.setLength(this.length, arrowLength, arrowWidth);
            this.object.setDirection(this.dir);
            this.object.position.set(this.position.x, this.position.y, 0);
        };

        this.setLength = function (len){
            this.object.setLength(len);
        };

        this.delete = function () {
            this.scene.remove(this.object);
        };
    };
}

export default FluxArrow