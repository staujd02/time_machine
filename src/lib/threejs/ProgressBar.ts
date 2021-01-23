import * as THREE from 'three'
        
const barLength = 500;

class ProgressBar {

    constructor(fontResource, yPos) {
        this.fontResource = fontResource;
        this.stepLength = 0;
        this.yPos = yPos;

        this.bar = {};
        this.progress = {};
        this.start = {};
        this.stop = {};

        this.bar.geometry = new THREE.BoxGeometry(barLength, 20, 1);
        this.bar.mesh = new THREE.Mesh(this.bar.geometry);
        this.bar.mesh.material = new THREE.MeshBasicMaterial({
            color: "#afafaf"
        });

        this.progressLength = 0;
        this.progress.geometry = new THREE.BoxGeometry(this.progressLength, 20, 1);
        this.progress.mesh = new THREE.Mesh(this.progress.geometry);
        this.progress.mesh.material = new THREE.MeshBasicMaterial({
            color: "#666666"
        });
        this.bar.mesh.position.set(0, this.yPos, 0);
        this.progress.mesh.position.set((barLength - this.progressLength) / 2, this.yPos, 0); //TODO: Make height to bottom of screen + padding

        this.updateProgress = this.updateProgress.bind(this);
        this.createText = this.createText.bind(this);
        this.createTitle = this.createTitle.bind(this);
        this.moveText = this.moveText.bind(this);
        this.withinBar = this.withinBar.bind(this);
        this.getStep = this.getStep.bind(this);
        this.setSteps = this.setSteps.bind(this);
        this.getBar = this.getBar.bind(this);
    }

    updateProgress(step, timeInfo, cX, cY) {
        if (this.stepLength * step <= barLength) {
            this.progressLength = this.stepLength * step;
            this.progress.mesh.geometry = new THREE.BoxGeometry(this.progressLength, 20, 1);
            // this.progress.mesh.position.set(((barLength - this.progressLength) / 2) - cX, this.yPos + cY, 0); //TODO: Make height to bottom of screen + padding
            this.progress.mesh.position.set(((barLength - this.progressLength) / 2) + cX, this.yPos + cY, 0); //TODO: Make height to bottom of screen + padding
            this.createText(timeInfo, cX, cY);
        }
    }

    createText(text, cX, cY) {
        var geometry = new THREE.TextGeometry(text, {
            font: this.fontResource,
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
        this.textMesh.position.set(250 - this.progressLength + cX, this.yPos + 25 + cY, 0);
        this.textMesh.rotation.set(0, 0, Math.PI);
    }

    createTitle() {
        var geometry = new THREE.TextGeometry("Progress Bar:", {
            font: this.fontResource,
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
        this.titleTextMesh = new THREE.Mesh(geometry, material);
        this.titleTextMesh.position.set(350, this.yPos + 7, 0);
        this.titleTextMesh.rotation.set(0, 0, Math.PI);
    }

    moveText(newX, newY) {
        var box = new THREE.Box3().setFromObject(this.textMesh); //To center text horizontally
        this.textMesh.position.set(newX + .5 * (box.max.x - box.min.x), newY, 0);
    }

    withinBar(x, y) {
        var withinHeight = (y < this.yPos + 10) && (y > this.yPos - 10);
        var withinWidth = (x < 250) && (x > -250);
        return withinHeight && withinWidth;
    }

    getStep(x) {
        var clickedPos = 250 - x;
        var step = Math.round(clickedPos / this.stepLength);
        return step;
    }

    setSteps(numOfSteps) {
        this.stepLength = barLength / numOfSteps;
    }

    getBar() {
        return this.progress.mesh
    }
}

export default ProgressBar;