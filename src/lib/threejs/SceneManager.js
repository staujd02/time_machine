/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import Compartment from './Compartment';
import ProgressBar from './ProgressBar';
import FluxArrow from './FluxArrow';

class SceneManager {

    constructor(canvas, dataContext) {
        this.dataContext = dataContext;
        this.ensureDefaults(dataContext, canvas);
        this.loadFont(this.fontLoadingComplete.bind(this));
        this.scene = buildScene();
        this.renderer = buildRender(screenDimensions);
        this.camera = buildCamera(screenDimensions);
        this.registerCallbacks(dataContext, scene, this.reloadScene);
        this.update = this.update.bind(this);
        this.reloadScene = this.reloadScene.bind(this);
        this.reloadCompartments = this.reloadCompartments.bind(this);
        this.reloadArrows = this.reloadArrows.bind(this);
        this.buildProgressBar = this.buildProgressBar.bind(this);
    }
    
    ensureDefaults(dataContext, canvas){
        dataContext.origin = new THREE.Vector3(0, 0, 0);
        dataContext.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        }
        dataContext.origRadius = 40;
        dataContext.paused = true;
        dataContext.stepInc = 1;
        dataContext.color = dataContext.color || [70, 156, 150, 1];
        dataContext.stepDelay = dataContext.stepDelay || 300;
        dataContext.valueMax = dataContext.valueMax || 1;
        dataContext.fluxMax = dataContext.fluxMax || 1;
        dataContext.skipSteps = dataContext.skipSteps || 1;
        dataContext.radius = dataContext.radius || origRadius;
        dataContext.halfQuantity = dataContext.valueMax / 2.0;
        dataContext.halfFlux = dataContext.fluxMax / 2.0;
        dataContext.baseColor = [170, 0, 255, 1];
        dataContext.radius = dataContext.radius || origRadius;
        dataContext.mouseDown = false;
        dataContext.dataPointToMove = -1;
        dataContext.userSelectedDataPoint = -1;
        dataContext.progressBar = null;
        dataContext.editMode = false;
        dataContext.arrowMode = 0; //0 = Off, 1 = Waiting for 1st point, 2 = Waiting for 2nd point
        dataContext.arrowPoints = []; //After `Add Arrow`, [0] holds FROM data point's index, [1] holds TO data point's index
        dataContext.fontResource = null;
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

    buildRender(screenDimensions) {
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
    }) {
        let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / -2, height / 2, 1, 1000);
        camera.position.set(0, 0, -10);
        camera.lookAt(origin);
        return (camera);
    }

    registerCallbacks(dataContext, scene, reloadScene){
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
        dataContext.registerCallback(reloadScene);
    }

    reloadScene() {
        this.clearScene(this.scene);
        this.reloadCompartments();
        this.reloadArrows();
        this.buildProgressBar();
        this.updatePanel();
    }

    /* Come back to this */
    updatePanel() {
        data.skipSteps = data.skipSteps || 1;
        data.stepDelay = data.stepDelay || 300;
        data.valueMax = data.valueMax || 1;
        data.fluxMax = data.fluxMax || 1;
        data.color = data.color || [70, 156, 150, 1];
        data.radius = data.radius || origRadius;
        radius = data.radius;
        halfQuantity = data.valueMax / 2.0;
        halfFlux = data.fluxMax / 2.0;
        controls.size = data.radius;
        controls.skipSteps = data.skipSteps;
        controls.valueMax = data.valueMax;
        controls.fluxMax = data.fluxMax;
        controls.stepDelay = data.stepDelay;
        controls.color = data.color;
        interface.updateDisplay();
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

    reloadCompartments() {
        let hydratedCompartments = [];
        let c = 0;
        this.dataContext.compartments.forEach(oldPoint => {
            if (!oldPoint.dataIndex) { // For converting legacy saves on the fly
                oldPoint.dataIndex = c++;
            }
            let point = this.restoreCompartment(oldPoint, scene, dataContext);
            hydratedCompartments.push(point);
            point.moveText(point.object.mesh.position.x, point.object.mesh.position.y);
        });
        this.dataContext.compartments = hydratedCompartments;
    }

    buildProgressBar() {
        let rect = this.canvas.getBoundingClientRect();
        this.dataContext.progressBar = new ProgressBar(fontResource, (-rect.height / 2.0) + 25);
        this.scene.add(progressBar.bar.mesh);
        this.scene.add(progressBar.progress.mesh);
        if (this.dataContext.progressBar.textMesh !== null) {
            this.scene.remove(progressBar.textMesh)
        }
        this.dataContext.progressBar.createText("0");
        this.scene.add(this.dataContext.progressBar.textMesh);
        this.dataContext.progressBar.createTitle();
        this.scene.add(dataContext.progressBar.titleTextMesh);
    }

    updateProgressBar(step, text) {
        if (progressBar.textMesh) {
            scene.remove(progressBar.textMesh);
        }
        progressBar.updateProgress(step, text);
        scene.add(progressBar.textMesh);
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

    addCompartment(labelText) {
        let compartments = data.compartments;
        let compartment = new Compartment(compartments.length + 1);
        scene.add(compartment.object.mesh);
        scene.add(compartment.shadow.mesh);
        if (controls.showIndices) {
            compartment.showIndex(fontResource);
            scene.add(compartment.indexTextMesh);
        }

        compartment.changeColor(baseColor);
        compartment.adjustScale(radius);
        compartment.appendText(fontResource, labelText, compartment.position.x, compartment.position.y);
        scene.add(compartment.textMesh);
        compartments.push(compartment);
        compartment.setPosition(0, 0, 0);
        compartment.moveText(0, 0);
    }

    removeFromScene(compartment) {
        scene.remove(compartment.object.mesh);
        scene.remove(compartment.shadow.mesh);
        scene.remove(compartment.textMesh);
    }

    addArrow() {
        let arrows = data.arrows;
        var shift = false;
        //Check if new arrow is between an already arrowed combination
        for (var i = 0; i < arrows.length; i++) {
            if (arrows[i].arrowInfo.pointIndex1 === arrowPoints[0] && arrows[i].arrowInfo.pointIndex2 === arrowPoints[1]) {
                //Arrow already exists in that direction-- do nothing
                return
            }
            if (arrows[i].arrowInfo.pointIndex1 === arrowPoints[1] && arrows[i].arrowInfo.pointIndex2 === arrowPoints[0]) {
                //Arrow exists in opposite direction-- shift new arrow
                shift = true;
            }
        }
        var arrowInfo = {
            shift: shift,
            len: 200,
            pointIndex1: arrowPoints[0],
            pointIndex2: arrowPoints[1],
            point1: data.compartments[arrowPoints[0]].position,
            point2: data.compartments[arrowPoints[1]].position,
            dataPointRadius: radius,
            dataIndex: data.arrows.length + 1,
        }
        let arrow = new FluxArrow(arrowInfo);
        scene.add(arrow.object);
        arrowMode = 0;
        arrows.push(arrow);
    }

    updateArrows(deletedDataPoint) {
        let arrows = data.arrows;
        for (var i = 0; i < arrows.length; i++) {
            var index1 = arrows[i].arrowInfo.pointIndex1;
            var index2 = arrows[i].arrowInfo.pointIndex2;
            if ((index1 === deletedDataPoint) || (index2 === deletedDataPoint)) {
                scene.remove(arrows[i].object)
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
                arrows[i].updatePos(data.compartments[index1].position, data.compartments[index2].position);
                if (controls.showIndices) {
                    arrows[i].moveIndexText(arrows[i].position.x, arrows[i].position.y);
                }
            }
        }
    }

    deleteDataPoint() {
        if (userSelectedDataPoint > -1) {
            removeFromScene(data.compartments[userSelectedDataPoint]);
            data.compartments.splice(userSelectedDataPoint, 1);
            userSelectedDataPoint = -1;
        }
        updateArrows(userSelectedDataPoint);
    }

    changeColor(newColor) {
        data.color = newColor;
        for (var i = 0; i < data.compartments.length; i++) {
            data.compartments[i].changeColor(newColor);
        }
    }

    changeAllRadius() {
        let point;
        for (let i = 0; i < data.compartments.length; i++) {
            point = data.compartments[i];
            point.adjustScale(radius);
            point.changeTextSize(radius)
            point.moveText(point.object.mesh.position.x, point.object.mesh.position.y);
        }
        for (let i = 0; i < data.arrows.length; i++) {
            data.arrows[i].adjustScale(radius);
        }
    }

    revealIndices(show) {
        if (show) {
            for (let i = 0; i < data.compartments.length; i++) {
                data.compartments[i].showIndex(fontResource);
                scene.add(data.compartments[i].indexTextMesh);
            }
            for (let i = 0; i < data.arrows.length; i++) {
                data.arrows[i].showIndex(fontResource);
                scene.add(data.arrows[i].indexTextMesh);
            }
            return;
        }

        for (let i = 0; i < data.compartments.length; i++) {
            scene.remove(data.compartments[i].indexTextMesh);
        }
        for (let i = 0; i < data.arrows.length; i++) {
            scene.remove(data.arrows[i].indexTextMesh);
        }
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

}

export default SceneManager;