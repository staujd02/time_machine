/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three'

class DataPoint {

    constructor(index, previousState = null) {
        var tinycolor = require('tinycolor2');
        const origRadius = 40;

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

        this.withinCircle = function (x, y) {
            let pos = this.object.mesh.position;
            let distance = Math.sqrt((x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y));
            return !(distance > this.radius);
        };

        this.adjustScale = function (newRadius) {
            this.radius = newRadius;
            let newScale = this.radius / origRadius;
            this.object.scale.set(newScale, newScale, newScale);
            this.shadow.scale.set(newScale, newScale, newScale);
        };

        this.appendText = function (font, text, xpos, ypos) {
            this.labelText = text;
            var geometry = new THREE.TextGeometry(text, {
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
        };

        this.moveText = function (newX, newY) {
            var box = new THREE.Box3().setFromObject(this.textMesh); // To center text horizontally
            this.textMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, this.textPullForward);
        }

        this.moveIndexText = function (newX, newY) {
            var box = new THREE.Box3().setFromObject(this.indexTextMesh); // To center text horizontally
            this.indexTextMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, this.textPullForward);
        }

        this.setPosition = function (x, y, z) {
            this.position.set(x, y, z);
            this.shadow.position.set(x, y, this.shadowPushBack);
        }

        this.changeTextSize = function (newScale) {
            let scale = newScale / origRadius;
            this.textMesh.scale.set(scale, scale, scale + this.textPullForward);
        }
        this.changeIndexTextSize = function (newScale) {
            let scale = newScale / origRadius;
            this.indexTextMesh.scale.set(scale, scale, scale + this.textPullForward);
        }

        this.transformColor = function (colorObject) {
            return tinycolor({
                r: colorObject[0],
                g: colorObject[1],
                b: colorObject[2]
            }).toHexString();
        }

        this.changeColor = function (colorObject) {
            this.baseColor = this.transformColor(colorObject);
            this.object.mesh.material.color.set(this.baseColor.toString());
        };

        this.lightenColor = function (percent) {
            this.object.mesh.material.color.set(tinycolor(this.baseColor).lighten(percent).toString());
        };

        this.darkenColor = function (percent) {
            this.object.mesh.material.color.set(tinycolor(this.baseColor).darken(percent).toString());
        };

        this.showIndex = function (font) {
            var geometry = new THREE.TextGeometry(this.dataIndex.toString(), {
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
            this.moveIndexText(this.position.x, this.position.y + (3/4)*(this.radius));
            this.indexTextMesh.rotation.set(0, 0, Math.PI);
            this.changeIndexTextSize(this.radius);
        };

        if (isState) {
            this.adjustScale(previousState.radius);
            this.object.mesh.position.set(previousState.position.x, previousState.position.y, previousState.position.z);
            this.shadow.mesh.position.set(previousState.shadow.position.x, previousState.shadow.position.y, previousState.shadow.position.z);
        }

        this.update = function () {

        };
    };
}

export default DataPoint;