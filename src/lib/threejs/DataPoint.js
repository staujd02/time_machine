/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three'

const tinyColor = require('tinycolor2');
const origRadius = 40;

class DataPoint {

    constructor(index, previousState = null) {

        let isState = !!previousState;

        this.dataIndex = index; // Holds the index the data point will retrieve data from
        this.labelText = "";
        this.baseColor = isState ? previousState.baseColor : "#aa00ff";
        this.radius = origRadius;
        this.shadowMargin = 7;
        this.shadowMargin = isState ? previousState.shadowMargin : 7;
        this.shadowPushBack = 1;
        this.textPullForward = -5;

        this.shadow = {};
        this.shadow.geometry = new THREE.CircleGeometry(this.radius + this.shadowMargin, 32);
        this.shadow.mesh = new THREE.Mesh(this.shadow.geometry);
        this.shadow.mesh.material =
            new THREE.MeshBasicMaterial({
                color: "#cccccc"
            });

        this.object = {};
        this.object.geometry = new THREE.CircleGeometry(this.radius, 32);
        this.object.mesh = new THREE.Mesh(this.object.geometry);
        this.object.mesh.material =
            new THREE.MeshBasicMaterial({
                color: this.baseColor
            });

        this.object.mesh.position.set(0, 0, 0);
        this.shadow.mesh.position.set(0, 0, this.shadowPushBack);

        this.position = this.object.mesh.position;
        this.shadow.position = this.shadow.mesh.position;

        this.object.scale = this.object.mesh.scale;
        this.shadow.scale = this.shadow.mesh.scale;


        if (isState) {
            this.adjustScale(previousState.radius);
            this.object.mesh.position.set(previousState.position.x, previousState.position.y, previousState.position.z);
            this.shadow.mesh.position.set(previousState.shadow.position.x, previousState.shadow.position.y, previousState.shadow.position.z);
        }

        this.withinCircle = this.withinCircle.bind(this);
        this.adjustScale = this.adjustScale.bind(this);
        this.appendText = this.appendText.bind(this);
        this.moveText = this.moveText.bind(this);
        this.moveIndexText = this.moveIndexText.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.changeTextSize = this.changeTextSize.bind(this);
        this.changeIndexTextSize = this.changeIndexTextSize.bind(this);
        this.transformColor = this.transformColor.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.lightenColor = this.lightenColor.bind(this);
        this.darkenColor = this.darkenColor.bind(this);
        this.showIndex = this.showIndex.bind(this);
        this.update = this.update.bind(this);
    }

    update() {

    }

    withinCircle(x, y) {
        let pos = this.object.mesh.position;
        let distance = Math.sqrt((x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y));
        let within = !(distance > this.radius);
        return within;
    }

    adjustScale(newRadius) {
        this.radius = newRadius;
        let newScale = this.radius / origRadius;
        this.object.scale.set(newScale, newScale, newScale);
        this.shadow.scale.set(newScale, newScale, newScale);
    }

    appendText(font, text, xpos, ypos) {
        this.labelText = text;
        let geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 13,
            height: 5,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 2,
            bevelSegments: 5
        });
        let material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        this.textMesh = new THREE.Mesh(geometry, material);
        this.moveText(xpos, ypos);
        this.textMesh.rotation.set(0, 0, Math.PI);
        this.changeTextSize(this.radius);
    }

    moveText(newX, newY) {
        var box = new THREE.Box3().setFromObject(this.textMesh); // To center text horizontally
        this.textMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, this.textPullForward);
    }

    moveIndexText(newX, newY) {
        var box = new THREE.Box3().setFromObject(this.indexTextMesh); // To center text horizontally
        this.indexTextMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, this.textPullForward);
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.shadow.position.set(x, y, this.shadowPushBack);
    }

    changeTextSize(newScale) {
        let scale = newScale / origRadius;
        this.textMesh.scale.set(scale, scale, scale + this.textPullForward);
    }

    changeIndexTextSize(newScale) {
        let scale = newScale / origRadius;
        this.indexTextMesh.scale.set(scale, scale, scale + this.textPullForward);
    }

    transformColor(colorObject) {
        return tinyColor({
            r: colorObject[0],
            g: colorObject[1],
            b: colorObject[2]
        }).toHexString();
    }

    changeColor(colorObject) {
        this.baseColor = this.transformColor(colorObject);
        this.object.mesh.material.color.set(this.baseColor.toString());
    }

    lightenColor(percent) {
        this.object.mesh.material.color.set(tinyColor(this.baseColor).lighten(percent).toString());
    }

    darkenColor(percent) {
        this.object.mesh.material.color.set(tinyColor(this.baseColor).darken(percent).toString());
    }

    showIndex(font) {
        let geometry = new THREE.TextGeometry(this.dataIndex.toString(), {
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
        this.moveIndexText(this.position.x, this.position.y + (3 / 4) * (this.radius));
        this.indexTextMesh.rotation.set(0, 0, Math.PI);
        this.changeIndexTextSize(this.radius);
    }
}

export default DataPoint;