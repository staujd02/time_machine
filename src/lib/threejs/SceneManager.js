/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import Compartment from './Compartment';
import ProgressBar from './ProgressBar';
import FluxArrow from './FluxArrow';

class SceneManager {

    constructor(canvas, dataContext) {
        const screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };
        this.dataContext = dataContext;
        this.dataContext.origin = new THREE.Vector3(0, 0, 0);
        this.loadFont(this.fontLoadingComplete.bind(this));
        this.canvas = canvas;
        this.scene = this.buildScene();
        this.renderer = this.buildRender(screenDimensions, canvas);
        this.camera = this.buildCamera(screenDimensions, this.dataContext);
        this.registerCallbacks(this.dataContext, this.scene, this.reloadScene);
        this.update = this.update.bind(this);
        this.reloadScene = this.reloadScene.bind(this);
        this.reloadCompartments = this.reloadCompartments.bind(this);
        this.reloadArrows = this.reloadArrows.bind(this);
        this.buildProgressBar = this.buildProgressBar.bind(this);
        this.changeAllRadius = this.changeAllRadius.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.updateArrows = this.updateArrows.bind(this);
        this.addFluxArrow = this.addFluxArrow.bind(this);
        this.removeFromScene = this.removeFromScene.bind(this);
        this.addCompartment = this.addCompartment.bind(this);
        this.addArrow = this.addArrow.bind(this);
        this.renameCompartment = this.renameCompartment.bind(this);
        this.updateCompartmentIndexText = this.updateCompartmentIndexText.bind(this);
        this.generateCompartments = this.generateCompartments.bind(this);
        this.showCompartmentIndexText = this.showCompartmentIndexText.bind(this);
        this.hideCompartmentIndexText = this.hideCompartmentIndexText.bind(this);
        this.showFluxIndexText = this.showFluxIndexText.bind(this);
        this.hideFluxIndexText = this.hideFluxIndexText.bind(this);
        this.updateProgressBar = this.updateProgressBar.bind(this);
        this.colorPoints = this.colorPoints.bind(this);
        this.moveCamera = this.moveCamera.bind(this);
        this.canvasToThreePos = this.canvasToThreePos.bind(this);
    }

    updateProgressBar(step, text){
        if (this.dataContext.progressBar.textMesh) {
            this.scene.remove(this.dataContext.progressBar.textMesh);
        }
        this.dataContext.progressBar.updateProgress(step, text);
        this.scene.add(this.dataContext.progressBar.textMesh);
    }

    showCompartmentIndexText(compartment) {
        compartment.showIndex(this.dataContext.fontResource);
        this.scene.add(compartment.indexTextMesh);
    }

    hideCompartmentIndexText(compartment) {
        this.scene.remove(compartment.indexTextMesh);
    }

    showFluxIndexText(arrow) {
        arrow.showIndex(this.dataContext.fontResource);
        this.scene.add(arrow.indexTextMesh);
    }

    hideFluxIndexText(arrow) {
        this.scene.remove(arrow.indexTextMesh);
    }


    renameCompartment(compartment, newName) {
        this.scene.remove(compartment.textMesh);
        compartment.appendText(this.dataContext.fontResource, newName, compartment.position.x, compartment.position.y);
        this.scene.add(compartment.textMesh);
    }

    updateCompartmentIndexText(compartment, showIndex = false) {
        this.scene.remove(compartment.indexTextMesh);
        if (showIndex) {
            compartment.showIndex(this.dataContext.fontResource);
            this.scene.add(compartment.indexTextMesh);
        }
    }

    loadFont(fontLoadingComplete) {
        (new THREE.FontLoader()).load(
            'https://threejs.org//examples/fonts/helvetiker_regular.typeface.json',
            fontLoadingComplete
        );
    }

    fontLoadingComplete(font) {
        this.dataContext.fontResource = font;
        this.reloadScene();
    }

    buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#FFF");
        return scene;
    }

    buildRender(screenDimensions, canvas) {
        const {
            width,
            height
        } = screenDimensions;
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    buildCamera({
        width,
        height
    }, dataContext) {
        let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / -2, height / 2, 1, 1000);
        camera.position.set(0, 0, -10);
        camera.lookAt(dataContext.origin);
        return (camera);
    }

    moveCamera(x, y){
        this.camera.position.x += x;
        this.camera.position.y += y;
    }

    registerCallbacks(dataContext, scene, reloadScene) {
        dataContext.onFluxLoad = () => {};
        dataContext.onLoad = () => {
            if (dataContext.animationData != null) {
                if (dataContext.progressBar.textMesh) {
                    scene.remove(dataContext.progressBar.textMesh);
                }
                dataContext.progressBar.createText(dataContext.animationData[0][0]);
                dataContext.progressBar.setSteps(dataContext.animationData.length);
                scene.add(dataContext.progressBar.textMesh);
            }
        };
        dataContext.registerCallback(reloadScene.bind(this));
    }

    reloadScene() {
        this.clearScene(this.scene);
        this.reloadCompartments();
        this.reloadArrows();
        this.buildProgressBar();
    }

    clearScene(scene) {
        let remove = [];
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.ArrowHelper) {
                remove.push(child);
            }
        });
        for (let i = 0; i < remove.length; i++) {
            scene.remove(remove[i]);
        }
    }

    reloadArrows() {
        let hydratedArrows = [];
        let legacyArrowIndex = 0;
        this.dataContext.arrows.forEach(oldArrow => {
            hydratedArrows.push(this.restoreArrow(oldArrow, legacyArrowIndex++, this.scene));
        });
        this.dataContext.arrows = hydratedArrows;
    }
    
    canvasToThreePos(mousePos) {
        let rect = this.canvas.getBoundingClientRect();
        let newX, newY;
        newX = (rect.width / 2) - mousePos.x + this.camera.position.x;
        newY = mousePos.y - (rect.height / 2) + this.camera.position.y;
        return {
            x: newX,
            y: newY
        };
    }


    reloadCompartments() {
        let hydratedCompartments = [];
        let c = 0;
        this.dataContext.compartments.forEach(oldPoint => {
            if (!oldPoint.dataIndex) { // For converting legacy saves on the fly
                oldPoint.dataIndex = c++;
            }
            let point = this.restoreCompartment(oldPoint, this.scene, this.dataContext);
            hydratedCompartments.push(point);
            point.moveText(point.object.mesh.position.x, point.object.mesh.position.y);
        });
        this.dataContext.compartments = hydratedCompartments;
    }

    buildProgressBar() {
        let rect = this.canvas.getBoundingClientRect();
        this.dataContext.progressBar = new ProgressBar(this.dataContext.fontResource, (-rect.height / 2.0) + 25);
        this.scene.add(this.dataContext.progressBar.bar.mesh);
        this.scene.add(this.dataContext.progressBar.progress.mesh);
        if (this.dataContext.progressBar.textMesh !== null) {
            this.scene.remove(this.dataContext.progressBar.textMesh)
        }
        this.dataContext.progressBar.createText("0");
        this.scene.add(this.dataContext.progressBar.textMesh);
        this.dataContext.progressBar.createTitle();
        this.scene.add(this.dataContext.progressBar.titleTextMesh);
    }

    restoreArrow(savedData, legacyIndex, scene) {
        let arrow = new FluxArrow(savedData.arrowInfo, legacyIndex);
        scene.add(arrow.object);
        return arrow;
    }

    restoreCompartment(savedData, scene, dataContext) {
        let compartment = new Compartment(savedData.dataIndex, savedData);
        scene.add(compartment.object.mesh);
        scene.add(compartment.shadow.mesh);
        let labelText = savedData.textMesh ? savedData.textMesh.geometries[0].text : " ";
        if (!labelText)
            labelText = " ";
        compartment.appendText(dataContext.fontResource, labelText, compartment.position.x, compartment.position.y);
        scene.add(compartment.textMesh);
        return compartment;
    }

    addCompartment(labelText, showIndex = false) {
        let compartments = this.dataContext.compartments;
        let compartment = new Compartment(compartments.length + 1);
        this.scene.add(compartment.object.mesh);
        this.scene.add(compartment.shadow.mesh);
        if (showIndex) {
            compartment.showIndex(this.dataContext.fontResource);
            this.scene.add(compartment.indexTextMesh);
        }
        compartment.changeColor(this.dataContext.baseColor);
        compartment.adjustScale(this.dataContext.radius);
        compartment.appendText(this.dataContext.fontResource, labelText, compartment.position.x, compartment.position.y);
        this.scene.add(compartment.textMesh);
        compartments.push(compartment);
        compartment.setPosition(0, 0, 0);
        compartment.moveText(0, 0);
    }
    
    addArrow() {
        let arrows = this.dataContext.arrows;
        let data = this.dataContext;
        let shift = false;
        //Check if new arrow is between an already arrowed combination
        for (var i = 0; i < arrows.length; i++) {
            if (arrows[i].arrowInfo.pointIndex1 === data.arrowPoints[0] && arrows[i].arrowInfo.pointIndex2 === data.arrowPoints[1]) {
                //Arrow already exists in that direction-- do nothing
                return
            }
            if (arrows[i].arrowInfo.pointIndex1 === data.arrowPoints[1] && arrows[i].arrowInfo.pointIndex2 === data.arrowPoints[0]) {
                //Arrow exists in opposite direction-- shift new arrow
                shift = true;
            }
        }
        this.addFluxArrow({
            shift: shift,
            len: 200,
            pointIndex1: data.arrowPoints[0],
            pointIndex2: data.arrowPoints[1],
            point1: data.compartments[data.arrowPoints[0]].position,
            point2: data.compartments[data.arrowPoints[1]].position,
            dataPointRadius: data.radius,
            dataIndex: data.arrows.length + 1,
        }
);
    }

    removeFromScene(compartment) {
        this.scene.remove(compartment.object.mesh);
        this.scene.remove(compartment.shadow.mesh);
        this.scene.remove(compartment.textMesh);
    }

    addFluxArrow(arrowInfo) {
        let arrows = this.dataContext.arrows;

        this.dataContext.arrowMode = 0;

        let arrow = new FluxArrow(arrowInfo);
        this.scene.add(arrow.object);
        arrows.push(arrow);
    }

    updateArrows(deletedDataPoint) {
        let arrows = this.dataContext.arrows;
        for (var i = 0; i < arrows.length; i++) {
            let index1 = arrows[i].arrowInfo.pointIndex1;
            let index2 = arrows[i].arrowInfo.pointIndex2;
            if ((index1 === deletedDataPoint) || (index2 === deletedDataPoint)) {
                this.scene.remove(arrows[i].object)
                arrows.splice(i, 1);
                i--; //To go back and check arrow that just moved into i'th position
            } else {
                if ((index1 > deletedDataPoint) && (deletedDataPoint !== -1)) {
                    index1--;
                    arrows[i].arrowInfo.pointIndex1--;
                }
                if ((index2 > deletedDataPoint) && (deletedDataPoint !== -1)) {
                    index2--;
                    arrows[i].arrowInfo.pointIndex2--;
                }
                arrows[i].updatePos(this.dataContext.compartments[index1].position, this.dataContext.compartments[index2].position);
                if (this.dataContext.showIndices()) {
                    arrows[i].moveIndexText(arrows[i].position.x, arrows[i].position.y);
                }
            }
        }
    }

    changeColor(newColor) {
        this.dataContext.color = newColor;
        for (let i = 0; i < this.dataContext.compartments.length; i++) {
            this.dataContext.compartments[i].changeColor(newColor);
        }
    }
    
    colorPoints() {
        let changePercent, diff;
        let data = this.dataContext;

        for (let i = 0; i < data.compartments.length; i++) {
            if (data.animationData[data.step][data.compartments[i].dataIndex] > data.halfQuantity) { //i+1 because column 0 holds time info
                //Darken
                diff = data.animationData[data.step][data.compartments[i].dataIndex] - data.halfQuantity;
                changePercent = diff / data.halfQuantity;
                data.compartments[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
            } else {
                //Lighten
                diff = data.halfQuantity - data.animationData[data.step][data.compartments[i].dataIndex];
                changePercent = diff / data.halfQuantity;
                data.compartments[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
            }
        }
        if (data.fluxData != null) {
            for (let i = 0; i < data.arrows.length - 1; i++) {
                if (data.fluxData[data.step][data.arrows[i].arrowInfo.dataIndex] > data.halfFlux) { //i+1 because column 0 holds time info
                    //Darken
                    diff = data.fluxData[data.step][data.arrows[i].arrowInfo.dataIndex] - data.halfFlux;
                    changePercent = diff / data.halfFlux;
                    this.scene.remove(data.arrows[i].object);
                    data.arrows[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
                    this.scene.add(data.arrows[i].object) //Add newly colored arrow
                } else {
                    //Lighten
                    diff = data.halfFlux - data.fluxData[data.step][data.arrows[i].arrowInfo.dataIndex];
                    changePercent = diff / data.halfFlux;
                    this.scene.remove(data.arrows[i].object);
                    data.arrows[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
                    this.scene.add(data.arrows[i].object) //Add newly colored arrow
                }
            }
        }
    }
    
    generateCompartments(showIndex) {
        let data = this.dataContext;
        if (data.animationData == null) {
            alert("Compartment data must be uploaded first");
            return;
        } else if (data.compartments.length > 0) {
            alert("Compartments already exist");
            return;
        }
        let rect = this.canvas.getBoundingClientRect();
        let freeSpace = rect.width - ((data.animationData[0].length - 1) * (data.radius * 2)) - 2 * data.radius; // - 2*radius allocates for a radius buffer space on each end
        let spaceBetween = freeSpace / (data.animationData[0].length - 2);
        for (let eColumn = 1; eColumn < data.animationData[0].length; eColumn++) {
            let compartmentIndex = eColumn - 1;
            let xPos = -((rect.width / 2) - data.radius) + (compartmentIndex * data.radius * 2) + (compartmentIndex * spaceBetween) + data.radius; // + radius gives a radius buffer space on each end
            let label = !!data.labels[eColumn] ? data.labels[eColumn] : (eColumn).toString();
            this.addCompartment(label, showIndex);
            //Move to appropriate location
            data.compartments[compartmentIndex].setPosition(-xPos, -1, 0);
            data.compartments[compartmentIndex].moveText(-xPos, 0);
            if (showIndex) {
                data.compartments[compartmentIndex].moveIndexText(-xPos, (3 / 4) * (data.compartments[compartmentIndex].radius));
            }
        }
    }

    changeAllRadius() {
        let point;
        for (let i = 0; i < this.dataContext.compartments.length; i++) {
            point = this.dataContext.compartments[i];
            point.adjustScale(this.dataContext.radius);
            point.changeTextSize(this.dataContext.radius)
            point.moveText(point.object.mesh.position.x, point.object.mesh.position.y);
        }
        for (let i = 0; i < this.dataContext.arrows.length; i++) {
            this.dataContext.arrows[i].adjustScale(this.dataContext.radius);
        }
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

}

export default SceneManager;