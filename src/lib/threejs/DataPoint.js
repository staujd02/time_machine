/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three'

class DataPoint {

    constructor(scene) {
        var tinycolor = require('tinycolor2');

        this.baseColor = "#aa00ff";
        this.scene = scene;
        this.radius = 40;
        this.shadowMargin = 7;
        this.shadowPushBack = 1;

        this.shadow = {};
        this.shadow .geometry = new THREE.CircleGeometry(this.radius + this.shadowMargin, 32);
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

        scene.add(this.object.mesh);
        scene.add(this.shadow.mesh);

        this.withinCircle = function (x, y) {
            let pos = this.object.mesh.position;
            let distance = Math.sqrt((x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y));
            return !(distance > this.radius);
        };

        this.delete = function () {
            this.scene.remove(this.object.mesh);
            this.scene.remove(this.shadow.mesh);
            this.scene.remove(this.textMesh);
        };

        this.adjustScale = function(newScale) {
            this.object.scale.set(newScale, newScale, newScale);
            this.shadow.scale.set(newScale, newScale, newScale);
        };

        this.appendText = function (font, text, xpos, ypos) {
            if (this.textMesh != null) {
                this.scene.remove(this.textMesh)
            }
            var geometry = new THREE.TextGeometry(text, {
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
                color: 0x000000
            });
            this.textMesh = new THREE.Mesh(geometry, material);
            this.textMesh.position.set(xpos, ypos, 0);
            this.textMesh.rotation.set(0, 0, Math.PI);
            this.scene.add(this.textMesh);
        };

        this.moveText = function (newX, newY) {
            var box = new THREE.Box3().setFromObject(this.textMesh); //To center text horizontally
            this.textMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, 0);
        }

        this.setPosition = function(x, y, z){
           this.position.set(x, y, z);
           this.shadow.position.set(x, y, this.shadowPushBack);
        }

        this.changeTextSize = function (scale) {
            this.textMesh.scale.set(scale, scale, scale)
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
            this.object.mesh.material =
                new THREE.MeshBasicMaterial({
                    color: this.baseColor.toString()
                });
        };

        this.lightenColor = function (percent) {
            this.object.mesh.material = new THREE.MeshBasicMaterial({
                color: tinycolor(this.baseColor).lighten(percent).toString()
            });
        };

        this.darkenColor = function (percent) {
            this.object.mesh.material = new THREE.MeshBasicMaterial({
                color: tinycolor(this.baseColor).darken(percent).toString()
            });
        };

        this.update = function () {

        };
    };
}

export default DataPoint;