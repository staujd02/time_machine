import * as THREE from 'three'

class ProgressBar {

    constructor(scene, fontResource, buttonPosInfo) {
        const barLength = 500;
        this.stepLength = 0;
        this.buttonPosInfo = buttonPosInfo
        
        this.bar = {};
        this.progress = {};
        this.start = {};
        this.stop = {};

        this.bar.geometry = new THREE.BoxGeometry( barLength, 20, 1 );
        this.bar.mesh = new THREE.Mesh(this.bar.geometry);
        this.bar.mesh.material = new THREE.MeshBasicMaterial( {color: "#afafaf"} );

        this.progressLength = 0;
        this.progress.geometry = new THREE.BoxGeometry( this.progressLength, 20, 1 );
        this.progress.mesh = new THREE.Mesh( this.progress.geometry);
        this.progress.mesh.material = new THREE.MeshBasicMaterial( {color: "#666666"} );

        this.bar.mesh.position.set(0, this.buttonPosInfo.startPos.y + 25, 0);//TODO: Make this dynamic to bottom of screen + padding
        this.progress.mesh.position.set((barLength-this.progressLength)/2, this.buttonPosInfo.startPos.y + 25, 0);//TODO: Make height to bottom of screen + padding
        scene.add(this.bar.mesh);
        scene.add(this.progress.mesh);

        this.updateProgress = function(step, timeInfo){
            if (this.stepLength * step <= barLength){
                this.progressLength = this.stepLength * step;
                this.progress.mesh.geometry = new THREE.BoxGeometry( this.progressLength, 20, 1 );
                this.progress.mesh.position.set((barLength-this.progressLength)/2, this.buttonPosInfo.startPos.y + 25, 0);//TODO: Make height to bottom of screen + padding
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
            this.textMesh.position.set(250 - this.progressLength, this.buttonPosInfo.startPos.y + 50, 0);
            this.textMesh.rotation.set(0, 0, Math.PI);
            scene.add(this.textMesh);
        };

        this.moveText = function(newX, newY){
            var box = new THREE.Box3().setFromObject( this.textMesh );//To center text horizontally
            this.textMesh.position.set(newX + .5*(box.max.x - box.min.x), newY, 0);
        }

        this.withinBar = function (x, y) {
            var withinHeight = (y > this.buttonPosInfo.startPos.y + 10) && (y < this.buttonPosInfo.startPos.y + 35)
            var withinWidth = (x < 250) && ( x > -250)
            return withinHeight && withinWidth
        };

        this.withinStart = function (x, y) {
            var withinHeight = (y > this.buttonPosInfo.startPos.y - 15) && (y < this.buttonPosInfo.startPos.y + 15)
            var withinWidth = (x < this.buttonPosInfo.startPos.x + 25) && ( x > this.buttonPosInfo.startPos.x - 25)
            return withinHeight && withinWidth
        };

        this.withinStop = function (x, y) {
            var withinHeight = (y > this.buttonPosInfo.stopPos.y - 15) && (y < this.buttonPosInfo.stopPos.y + 15)
            var withinWidth = (x < this.buttonPosInfo.stopPos.x + 25) && ( x > this.buttonPosInfo.stopPos.x - 25)
            return withinHeight && withinWidth
        };

        this.getStep = function (x) {
            var clickedPos = 250 - x;
            var step = Math.round(clickedPos/this.stepLength);
            return step;
        };

        this.addStart = function (){
            this.start.geometry = new THREE.BoxGeometry( 50, 30, 1 );
            this.start.mesh = new THREE.Mesh(this.start.geometry);
            this.start.mesh.material = new THREE.MeshBasicMaterial( {color: "#00ff00"} );
            //this.start.mesh.position.set(345, 130, 0);
            this.start.mesh.position.set(this.buttonPosInfo.startPos.x, this.buttonPosInfo.startPos.y, 0);
            scene.add(this.start.mesh);

            var geometry = new THREE.TextGeometry("Start", {
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
            material.depthTest = false;
            let textStartMesh = new THREE.Mesh(geometry, material);
            textStartMesh.position.set(this.buttonPosInfo.startPos.x + (50/4), this.buttonPosInfo.startPos.y + (30/4), 0);
            textStartMesh.rotation.set(0, 0, Math.PI);
            scene.add(textStartMesh);
        }

        this.addStop = function (){
            this.stop.geometry = new THREE.BoxGeometry( 50, 30, 1 );
            this.stop.mesh = new THREE.Mesh(this.stop.geometry);
            this.stop.mesh.material = new THREE.MeshBasicMaterial( {color: "#ff0000"} );
            //this.stop.mesh.position.set(345, 175, 1);
            this.stop.mesh.position.set(this.buttonPosInfo.stopPos.x, this.buttonPosInfo.stopPos.y, 0);
            scene.add(this.stop.mesh);

            var geometry = new THREE.TextGeometry("Stop", {
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
            material.depthTest = false;
            let textStopMesh = new THREE.Mesh(geometry, material);
            textStopMesh.position.set(this.buttonPosInfo.stopPos.x + (50/4), this.buttonPosInfo.stopPos.y + (30/4), 0);
            textStopMesh.rotation.set(0, 0, Math.PI);
            scene.add(textStopMesh);
        }

       this.setSteps = function (numOfSteps){
            this.stepLength = barLength/numOfSteps;
        }

        this.getBar = function (){
            return this.progress.mesh
        }
    };
}

export default ProgressBar; 