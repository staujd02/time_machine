import * as THREE from 'three'

class ProgressBar {

    constructor(scene, fontResource, numOfSteps) {
        const barLength = 500;
        const stepLength = 500/numOfSteps;
        this.bar = {};
        this.progress = {};

        this.bar.geometry = new THREE.BoxGeometry( barLength, 20, 1 );
        this.bar.mesh = new THREE.Mesh(this.bar.geometry);
        this.bar.mesh.material = new THREE.MeshBasicMaterial( {color: "#afafaf"} );

        this.progressLength = 0;
        this.progress.geometry = new THREE.BoxGeometry( this.progressLength, 20, 1 );
        this.progress.mesh = new THREE.Mesh( this.progress.geometry);
        this.progress.mesh.material = new THREE.MeshBasicMaterial( {color: "#666666"} );

        this.bar.mesh.position.set(0, 175, 0);//TODO: Make this dynamic to bottom of screen + padding
        this.progress.mesh.position.set((barLength-this.progressLength)/2, 175, 0);//TODO: Make height to bottom of screen + padding
        scene.add(this.bar.mesh);
        scene.add(this.progress.mesh);

        this.updateProgress = function(step, timeInfo){
            if (stepLength * step <= barLength){
                this.progressLength = stepLength * step;
                this.progress.mesh.geometry = new THREE.BoxGeometry( this.progressLength, 20, 1 );
                this.progress.mesh.position.set((barLength-this.progressLength)/2, 175, 0);//TODO: Make height to bottom of screen + padding
                this.appendText(timeInfo)
            }
        }

        this.appendText = function (text) {
            if(this.textMesh != null){
                scene.remove(this.textMesh)
            }
            var geometry = new THREE.TextGeometry(text, {
                font: fontResource,
                size: 10,
                height: 5,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 2,
                bevelSegments: 5
            });
            let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            this.textMesh = new THREE.Mesh(geometry, material);
            this.textMesh.position.set(250 - this.progressLength, 205, 0);
            this.textMesh.rotation.set(0, 0, Math.PI);
            scene.add(this.textMesh);
        };

        this.moveText = function(newX, newY){
            var box = new THREE.Box3().setFromObject( this.textMesh );//To center text horizontally
            this.textMesh.position.set(newX + .5*(box.max.x - box.min.x), newY, 0);
        }

        this.withinBar = function (x, y) {
            var withinHeight = (y > 175) && (y < 195)
            var withinWidth = (x < 250) && ( x > -250)
            return withinHeight && withinWidth
        };

        this.getStep = function (x) {
            var clickedPos = 250 - x;
            var step = Math.round(clickedPos/stepLength);
            return step;
        };
    };
}

export default ProgressBar; 