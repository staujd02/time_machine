import * as THREE from 'three'

class ProgressBar {

    constructor(scene) {
        const barLength = 500;
        this.bar = {};
        this.progress = {};

        this.bar.geometry = new THREE.BoxGeometry( barLength, 20, 1 );
        this.bar.mesh = new THREE.Mesh(this.bar.geometry);
        this.bar.mesh.material = new THREE.MeshBasicMaterial( {color: "#afafaf"} );

        this.progressLength = 0;
        this.progress.geometry = new THREE.BoxGeometry( this.progressLength, 20, 1 );
        this.progress.mesh = new THREE.Mesh( this.progress.geometry);
        this.progress.mesh.material = new THREE.MeshBasicMaterial( {color: "#000000"} );

        this.bar.mesh.position.set(0, 190, 0);//TODO: Make this dynamic to bottom of screen + padding
        this.progress.mesh.position.set((barLength-this.progressLength)/2, 190, 0);//TODO: Make height to bottom of screen + padding
        scene.add(this.bar.mesh);
        scene.add(this.progress.mesh);

        this.updateProgress = function(numOfSteps){
            if (this.progressLength + barLength/numOfSteps <= barLength){
                this.progressLength += barLength/numOfSteps
                this.progress.mesh.geometry = new THREE.BoxGeometry( this.progressLength, 20, 1 );
                this.progress.mesh.position.set((barLength-this.progressLength)/2, 190, 0);//TODO: Make height to bottom of screen + padding
            }
        }
    };
}

export default ProgressBar; 