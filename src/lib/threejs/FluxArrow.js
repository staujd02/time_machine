import * as THREE from 'three'
        
const initialCompartmentRadius = 40;
const tinyColor = require('tinycolor2');

class FluxArrow {

    constructor(arrowInfo, legacySaveIndex) {

        this.arrowInfo = arrowInfo;

        // Keep a defined value or fallback to legacy index
        this.arrowInfo.dataIndex = (arrowInfo.dataIndex !== undefined) ? arrowInfo.dataIndex : legacySaveIndex;

        this.arrowLength = 22 * (arrowInfo.dataPointRadius / initialCompartmentRadius);
        this.arrowWidth = 15 * (arrowInfo.dataPointRadius / initialCompartmentRadius); //Keep relative proportions linked with compartments of radius 40 
        this.textPullForward = -5;
        this.baseColor = "#222222"
        this.object = {};
        
        this.dir = this.calculateDir();
        this.dir.normalize();
        this.length = this.calculateLength();
        this.position = this.calculatePos();

        this.calculateLength = this.calculateLength.bind(this);
        this.calculateDir = this.calculateDir.bind(this);
        this.calculatePos = this.calculatePos.bind(this);
        this.lightenColor = this.lightenColor.bind(this);
        this.darkenColor = this.darkenColor.bind(this);
        this.updatePos = this.updatePos.bind(this);
        this.setLength = this.setLength.bind(this);
        this.delete = this.delete.bind(this);
        this.adjustScale = this.adjustScale.bind(this);
        this.showIndex = this.showIndex.bind(this);
        this.changeIndexTextSize = this.changeIndexTextSize.bind(this);
        this.moveIndexText = this.moveIndexText.bind(this);

        this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, this.baseColor, this.arrowLength, this.arrowWidth);
    }

    calculateLength() {
        //Length from center to center
        let distance = Math.sqrt((this.arrowInfo.point2.x - this.arrowInfo.point1.x) * (this.arrowInfo.point2.x - this.arrowInfo.point1.x) +
            (this.arrowInfo.point2.y - this.arrowInfo.point1.y) * (this.arrowInfo.point2.y - this.arrowInfo.point1.y));
        //Moves each end to edge of circle plus 1/2 of radius more
        distance = distance - 3 * (this.arrowInfo.dataPointRadius)
        return distance;
    }

    calculateDir() {
        return (new THREE.Vector3(this.arrowInfo.point2.x - this.arrowInfo.point1.x, this.arrowInfo.point2.y - this.arrowInfo.point1.y, 0));
    }

    calculatePos() {
        let adjust = new THREE.Vector3(1.5 * this.arrowInfo.dataPointRadius * this.dir.x, 1.5 * this.arrowInfo.dataPointRadius * this.dir.y, 0) //1.5 * 40 = To edge + 50% of circle radius
        let shiftAmount = this.arrowInfo.dataPointRadius / 3.5;
        if (this.arrowInfo.shift) {
            let diff = (this.dir.x - this.dir.y);
            if (diff >= 0) {
                if (this.dir.y <= -.5) {
                    adjust.x += shiftAmount;
                } else {
                    adjust.y += shiftAmount;
                }
            } else {
                if (this.dir.y >= .5) {
                    adjust.x += shiftAmount;
                } else {
                    adjust.y += shiftAmount;
                }
            }
        }
        return new THREE.Vector3(this.arrowInfo.point1.x + adjust.x, this.arrowInfo.point1.y + adjust.y, 0)
    }

    lightenColor(percent) {
        let newColor = tinyColor(this.baseColor).lighten(percent).toString();
        this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, newColor, this.arrowLength, this.arrowWidth);
    }

    darkenColor(percent) {
        let newColor = tinyColor(this.baseColor).darken(percent).toString();
        this.object = new THREE.ArrowHelper(this.dir, this.position, this.length, newColor, this.arrowLength, this.arrowWidth);
    }

    updatePos(to, from) {
        this.arrowInfo.point1 = to;
        this.arrowInfo.point2 = from;

        this.dir = this.calculateDir();
        this.dir.normalize();
        this.length = this.calculateLength();
        this.position = this.calculatePos();
        
        if(this.arrowLength > this.length)
            this.object.setLength(this.arrowLength + 5, this.arrowLength, this.arrowWidth);
        else
            this.object.setLength(this.length, this.arrowLength, this.arrowWidth);
        this.object.setDirection(this.dir);
        this.object.position.set(this.position.x, this.position.y, 0);
    }

    setLength(len) {
        this.object.setLength(len);
    }

    delete() {
        this.scene.remove(this.object);
    }

    adjustScale(newRadius) {
        this.arrowInfo.dataPointRadius = newRadius
        this.arrowLength = 22 * (this.arrowInfo.dataPointRadius / initialCompartmentRadius);
        this.arrowWidth = 15 * (this.arrowInfo.dataPointRadius / initialCompartmentRadius);
        this.updatePos(this.arrowInfo.point1, this.arrowInfo.point2);
    }

    showIndex(font) {
        let geometry = new THREE.TextGeometry(this.arrowInfo.dataIndex.toString(), {
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
    }

    changeIndexTextSize(newScale) {
        let scale = newScale / this.origLength;
        scale = scale === 0 ? (scale = 0.00010) : scale;
        this.indexTextMesh.scale.set(scale, scale, scale + this.textPullForward);
    }

    moveIndexText(newX, newY) {
        let box = new THREE.Box3().setFromObject(this.indexTextMesh); // To center text horizontally
        this.indexTextMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, this.textPullForward);
    }
}


export default FluxArrow