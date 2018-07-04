/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three'

class DataPoint {

    constructor(scene) {
        const defaultColor = "#aa00ff";
        var tinycolor = require('tinycolor2');

        this.scene = scene;
        this.color = tinycolor(defaultColor);
        this.radius = 40;
        this.object = {};
        this.object.geometry = new THREE.CircleGeometry(this.radius, 32);
        this.object.mesh = new THREE.Mesh(this.object.geometry);
        this.object.mesh.material =
            new THREE.MeshBasicMaterial({ color: this.color.toString() });

        this.object.mesh.position.set(0, 0, 0);

        this.position = this.object.mesh.position;
        this.scale = this.object.mesh.scale;

        scene.add(this.object.mesh);

        this.withinCircle = function (x, y) {
            let pos = this.object.mesh.position;
            let distance = Math.sqrt((x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y))
            return !(distance > this.radius);
        };

        this.delete = function () {
            this.scene.remove(this.object.mesh);
        };

        this.appendText = function (font) {
            var geometry = new THREE.TextGeometry('Hello three.js!', {
                font: font,
                size: 5,
                height: 5,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 2,
                bevelSegments: 5
            });
            let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            let mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
        };

        this.lighterColor = function (percent) {
            return this.color.lighten(percent).toString();
        };

        this.darkerColor = function (percent) {
            return this.color.darken(percent).toString();
        };

        this.wrapColor = function(){
            return {color: this.transformColor(this.colorValue).toString()};
        };

        this.transformColor = function(colorObject){
            return tinycolor({r: colorObject[0], g: colorObject[1], b: colorObject[2]});               
        }

        this.changeColor = function (colorObject) {
            this.color = this.transformColor(colorObject);
            this.object.mesh.material =
                new THREE.MeshBasicMaterial({ color: this.color.toString() });
        };

        this.lightenColor = function (percent) {
            this.object.mesh.material =
                new THREE.MeshBasicMaterial({ color: this.lighterColor(percent) });
        };

        this.darkenColor = function (percent) {
            this.object.mesh.material =
                new THREE.MeshBasicMaterial({ color: this.darkerColor(percent) });
        };

        this.update = function () {

        };
    };
}

export default DataPoint; 