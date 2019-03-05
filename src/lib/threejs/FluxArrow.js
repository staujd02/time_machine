import * as THREE from 'three'

class FluxArrow {
    constructor(arrowInfo, legacySaveIndex) {
        var tinycolor = require('tinycolor2');
        this.arrowInfo = arrowInfo;
        this.arrowInfo.dataIndex = (arrowInfo.dataIndex !== undefined) ? arrowInfo.dataIndex : legacySaveIndex; // Keep a defined value or fallback to legacy index
        var arrowLength = 22 * (arrowInfo.dataPointRadius/40);
        var arrowWidth = 15 * (arrowInfo.dataPointRadius/40); //Keep relative proportions liked with data points of radius 40 
        this.textPullForward = -5;

        this.calculateLength = function () {
            //Length from center to center
            let distance = Math.sqrt((this.arrowInfo.point2.x - this.arrowInfo.point1.x) * (this.arrowInfo.point2.x - this.arrowInfo.point1.x) +
                (this.arrowInfo.point2.y - this.arrowInfo.point1.y) * (this.arrowInfo.point2.y - this.arrowInfo.point1.y));
            //Moves each end to edge of circle plus 1/2 of radius more
            distance = distance - 3 * (this.arrowInfo.dataPointRadius)
            return distance;
        };
        this.calculateDir = function () {
           return new THREE.Vector3(this.arrowInfo.point2.x - this.arrowInfo.point1.x, this.arrowInfo.point2.y - this.arrowInfo.point1.y, 0);
        }
        this.calculatePos = function () {
            var adjust = new THREE.Vector3(1.5 * arrowInfo.dataPointRadius * this.dir.x, 1.5 * arrowInfo.dataPointRadius * this.dir.y, 0) //1.5 * 40 = To edge + 50% of circle radius
            var shiftAmount = arrowInfo.dataPointRadius/3.5;
            if (arrowInfo.shift){
                var diff = (this.dir.x - this.dir.y)
                if (diff >= 0){
                    if (this.dir.y <= -.5) {
                        adjust.x += shiftAmount;
                    }else{
                        adjust.y += shiftAmount;
                    }
                } else {
                    if (this.dir.y >= .5) {
                        adjust.x += shiftAmount;
                    }else{
                        adjust.y += shiftAmount;
                    }
                }
            }
            return new THREE.Vector3(this.arrowInfo.point1.x + adjust.x, this.arrowInfo.point1.y + adjust.y, 0)
        }


        this.baseColor = "#222222"
        this.object = {};
        this.dir = this.calculateDir();
        this.dir.normalize();
        this.length = this.calculateLength();
        this.position = this.calculatePos();

        this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, this.baseColor, arrowLength, arrowWidth);

        this.lightenColor = function (percent) {
            var newColor = tinycolor(this.baseColor).lighten(percent).toString();
            this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, newColor, arrowLength, arrowWidth);
        };

        this.darkenColor = function (percent) {
            var newColor = tinycolor(this.baseColor).darken(percent).toString();
            this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, newColor, arrowLength, arrowWidth);
        };

        this.updatePos = function (to, from) {
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

        this.setLength = function (len) {
            this.object.setLength(len);
        };

        this.delete = function () {
            this.scene.remove(this.object);
        };

        this.adjustScale = function (newRadius) {
            arrowInfo.dataPointRadius = newRadius
            arrowLength = 22 * (arrowInfo.dataPointRadius/40);
            arrowWidth = 15 * (arrowInfo.dataPointRadius/40);
            this.updatePos(this.arrowInfo.point1, this.arrowInfo.point2);
        };

        this.showIndex = function (font) {
            var geometry = new THREE.TextGeometry(this.arrowInfo.dataIndex.toString(), {
                font: font,
                size: 10,
                height: 5,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,  
                bevelSize: 2,
                bevelSegments: 5
            });
            let material = new THREE.MeshBasicMaterial({
                color: 0x808080
            });
            this.indexTextMesh = new THREE.Mesh(geometry, material);
            this.moveIndexText(this.position.x, this.position.y);
            this.indexTextMesh.rotation.set(0, 0, Math.PI);
           // this.changeIndexTextSize(this.length);
        };

        this.changeIndexTextSize = function (newScale) {
            let scale = newScale / this.origLength;
            scale = scale === 0 ? (scale = 0.00010) : scale; 
            this.indexTextMesh.scale.set(scale, scale, scale + this.textPullForward);
        };

        this.moveIndexText = function (newX, newY) {
            var box = new THREE.Box3().setFromObject(this.indexTextMesh); // To center text horizontally
            this.indexTextMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, this.textPullForward);
        };
    };
}

export default FluxArrow