/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import DataPoint from './DataPoint';
import * as dat from 'dat.gui';
import ActionUtilities from '../ActionUtilities';
import ProgressBar from './ProgressBar';
import FluxArrow from './FluxArrow';

export default (canvas, data) => {

    const actionUtil = new ActionUtilities();

    const origin = new THREE.Vector3(0, 0, 0);
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    const origRadius = 40;

    var paused = true;
    var stepInc = 1;
    data.color = data.color || [70, 156, 150, 1];
    data.stepDelay = data.stepDelay || 300;
    data.valueMax = data.valueMax || 1;
    data.fluxMax = data.fluxMax || 1;
    data.skipSteps = data.skipSteps || 1;
    data.radius = data.radius || origRadius;
    var halfQuantity = data.valueMax / 2.0;
    var halfFlux = data.fluxMax / 2.0;
    var baseColor = [170, 0, 255, 1];
    var radius = data.radius || origRadius;

    var mouseDown = false;
    var dataPointToMove = -1;
    var dataPointToDelete = -1;

    var progressBar;
    var editMode;
    var arrowMode = 0; //0 = Off, 1 = Waiting for 1st point, 2 = Waiting for 2nd point
    var arrowPoints = [] //After `Add Arrow`, [0] holds FROM data point's index, [1] holds TO data point's index

    var fontResource;

    const controls = {
        size: radius,
        valueMax: data.valueMax,
        fluxMax: data.fluxMax,
        stepDelay: data.stepDelay,
        color: data.color,
        skipSteps: data.skipSteps,
        seekHelp: function () {
            window.open('/help.html','_blank'); 
        },
        changeStep: function () {
            startStepping(true);
        },
        startAnimation: function () {
            startStepping();
        },
        pauseAnimation: function () {
            paused = true;
        },
        resetAnimation: reset,
        addPoint: function () {
            if (editMode) {
                addDataPoint();
            }
        },
        addArrow: function () {
            if (editMode) {
                arrowMode = 1;
            }
        },
        deletePoint: function () {
            if (editMode) {
                deleteDataPoint();
            }
        },
        editMode: false,
        labelMode: false
    }

    loadFont();
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    var datGui = buildGUI();

    function reset() {
        if (data.animationData) {
            data.step = 0;
            paused = true;
            progressBar.updateProgress(0, data.animationData[0][0]);
            applyStep();
        }
    }

    data.onFluxLoad = () => {}
    data.onLoad = () => {
        if (data.animationData != null) {
            progressBar.appendText(data.animationData[0][0]);
            progressBar.setSteps(data.animationData.length);
        }
    }
    data.registerCallback(reloadScene);

    function loadFont() {
        var loader = new THREE.FontLoader();
        loader.load(
            'https://threejs.org//examples/fonts/helvetiker_regular.typeface.json',
            fontLoadingComplete
        );
    }

    function fontLoadingComplete(font) {
        fontResource = font;
        reloadScene();
    }

    function reloadScene() {
        clearScene();
        reloadDataPoints();
        reloadArrows();
        buildProgressBar();
        updatePanel();
    }

    function updatePanel() {
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
        datGui.updateDisplay();
    }

    function clearScene() {
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

    function reloadArrows() {
        let hydratedArrows = [];
        data.arrows.forEach(oldArrow => {
            hydratedArrows.push(restoreArrow(oldArrow));
        });
        data.arrows = hydratedArrows;
    }

    function reloadDataPoints() {
        let hydratedPoints = [];
        data.dataPoints.forEach(oldPoint => {
            let point = restoreDataPoint(oldPoint);
            hydratedPoints.push(point);
            point.moveText(point.object.mesh.position.x, point.object.mesh.position.y);
        });
        data.dataPoints = hydratedPoints;
    }

    function buildGUI() {
        var gui = new dat.GUI({
            autoPlace: false
        });
        var customContainer = document.getElementById('datGuiAnchor');
        customContainer.appendChild(gui.domElement);
        gui.domElement.id = 'datGuiAnchor';
        gui.add(controls, 'seekHelp').name("Help");
        var animation = gui.addFolder("Animation");
        buildAnimationFolder(animation);
        var editing = gui.addFolder("Model Editing");
        buildEditingFolder(editing);
        var interpretation = gui.addFolder("Interpretation");
        buildInterpretationFolder(interpretation);
        return gui;
    }

    function buildAnimationFolder(folder) {
        folder.add(controls, 'changeStep').name("Step Forward");
        folder.add(controls, 'startAnimation').name("Start");
        folder.add(controls, 'pauseAnimation').name("Pause");
        folder.add(controls, 'resetAnimation').name("Reset");
        var timeController = folder.add(controls, 'stepDelay').name("Delay (in ms)").min(0).max(500).step(10)
        timeController.onChange(function (newValue) {
            data.stepDelay = newValue;
        });
        folder.add(controls, 'skipSteps').name("Step Size").onChange(function (newValue) {
            data.skipSteps = newValue;
        });
        return folder;
    }

    function buildEditingFolder(editFolder) {
        editFolder.add(controls, 'editMode').name("Edit Mode").onChange(function (newValue) {
            editMode = newValue;
        });
        editFolder.add(controls, 'labelMode').name("Import Labels").onChange(function (newValue) {
            data.labelMode = newValue;
        });
        editFolder.add(controls, 'addPoint').name("Add Compartment");
        editFolder.add(controls, 'addArrow').name("Add Arrow");
        editFolder.add(controls, 'deletePoint').name("Delete Compartment");
        var sizeController = editFolder.add(controls, 'size').name("Size").min(10).max(100).step(1);
        sizeController.onChange(function (newValue) {
            radius = newValue; //Ratio of original size
            data.radius = radius;
            changeAllRadius();
        });
        return editFolder;
    }

    function buildInterpretationFolder(folder) {
        var maxController = folder.add(controls, 'valueMax').name("Comp. Maximum");
        maxController.onChange(function (newValue) {
            data.valueMax = newValue;
            halfQuantity = data.valueMax / 2.0;
        });
        var maxFluxController = folder.add(controls, 'fluxMax').name("Flux Maximum");
        maxFluxController.onChange(function (newValue) {
            data.fluxMax = newValue;
            halfFlux = data.fluxMax / 2.0;
        });
        var colorController = folder.addColor(controls, 'color').name("50% Max Color");
        colorController.onChange(function (newValue) {
            baseColor = newValue;
            changeColor(baseColor);
        })
        return folder;
    }

    function buildProgressBar() {
        //Calculate positions for start/stop buttons
        var startPos = {
            x: (canvas.width / 5),
            y: (canvas.height / 4) * 2.75,
        }
        startPos = canvasToThreePos(startPos);
        var stopPos = {
            x: startPos.x,
            y: startPos.y + 50,
        }
        var buttonInfo = {
            startPos: startPos,
            stopPos: stopPos,
        }
        progressBar = new ProgressBar(scene, fontResource, buttonInfo);
        progressBar.appendText("0");
        progressBar.addStart();
        progressBar.addStop();
    }

    function setupEventListeners() {
        canvas.addEventListener("mousedown", function (evt) {
            mouseDown = true;
            checkWithinRange(canvas, evt);
        });
        canvas.addEventListener("mouseup", function (evt) {
            if (editMode) {
                if (arrowMode === 1) {
                    arrowMode = 2;
                    checkWithinRange(canvas, evt);
                    if ((arrowPoints[0] != null) && (arrowPoints[1] != null)) {
                        addArrow();
                    } else {
                        alert("Dragged line was not between two data points");
                    }
                    //Reset arrow points
                    arrowPoints[0] = null;
                    arrowPoints[1] = null;
                }
                mouseDown = false;
                dataPointToMove = -1; //No current selected dataPoint
            }
            if (data.arrows.length > 0) {
                updateArrows(-1);
            }
        });
        canvas.addEventListener("mousemove", function (evt) {
            if (editMode) {
                if (mouseDown) {
                    var mousePos = getMousePos(canvas, evt);
                    var newMousePos = canvasToThreePos(mousePos);
                    if (dataPointToMove > -1) {
                        data.dataPoints[dataPointToMove].setPosition(newMousePos.x, newMousePos.y, 0);
                        data.dataPoints[dataPointToMove].moveText(newMousePos.x, newMousePos.y);
                    }
                }
            }
        });
    }

    function checkWithinRange(canvas, evt) {
        var mousePos = canvasToThreePos(getMousePos(canvas, evt));
        //Check if click was on data point
        if (editMode) {
            for (var i = 0; i < data.dataPoints.length; i++) {
                var selected = data.dataPoints[i].withinCircle(mousePos.x, mousePos.y);
                if (selected && arrowMode === 1) {
                    arrowPoints[0] = i
                } else if (selected && arrowMode === 2) {
                    arrowPoints[1] = i
                } else if (selected) {
                    dataPointToMove = i;
                    dataPointToDelete = i;
                    break;
                }
            }
        }
        if (dataPointToMove === -1 && progressBar) { //Click was not on a datapoint
            dataPointToDelete = -1; //Deselect previous selection
            if (data.animationData && !isDataLoaded()) {
                alert("Please import data first");
                return;
            }

            //Check if click was on progress bar
            if (progressBar.withinBar(mousePos.x, mousePos.y) && data.animationData) {
                var clickedStep = progressBar.getStep(mousePos.x);
                let text = data.animationData[clickedStep - 1];
                progressBar.updateProgress(clickedStep, text ? text[0] : "0")
                data.step = clickedStep - 1;
                applyStep();
            } else if (progressBar.withinStop(mousePos.x, mousePos.y)) {
                paused = true;
            } else if (progressBar.withinStart(mousePos.x, mousePos.y)) {
                paused = false;
                stepForward();
            }
        }
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function canvasToThreePos(mousePos) {
        var rect = canvas.getBoundingClientRect();
        var newX, newY;
        newX = (rect.width / 2) - mousePos.x;
        newY = mousePos.y - (rect.height / 2);
        return {
            x: newX,
            y: newY
        };
    }

    function buildScene() {
        setupEventListeners();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#FFF");
        return scene;
    }

    function buildRender({
        width,
        height
    }) {
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

    function buildCamera({
        width,
        height
    }) {
        var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / -2, height / 2, 1, 1000);
        camera.position.set(0, 0, -10);
        camera.lookAt(origin)
        return (camera);
    }

    function isDataLoaded() {
        if (data && !data.dataLoaded()) {
            alert("Please import data first");
        }
        return data.dataLoaded();
    }

    async function startStepping(singleStep = false) {
        if (isDataLoaded()) {
            paused = false;
            stepForward(singleStep);
        }
    }

    async function stepForward(singleStep = false) {
        if (data.hasNextStep()) {
            if (!paused) {
                applyStep();
                data.step += stepInc;
                await actionUtil.sleep(data.stepDelay);
                if(!singleStep)
                    stepForward();
            }
        }
    }

    function applyStep() {
        let text = data.step < 0 ? '0' : data.animationData[data.step][0];
        if (data.step >= 0) {
            colorPoints();
        }
        progressBar.updateProgress(data.step + 1, text);
    }

    function colorPoints() {
        let changePercent, diff;

        for (let i = 0; i < data.dataPoints.length; i++) {
            if (data.animationData[data.step][i + 1] > halfQuantity) { //i+1 because column 0 holds time info
                //Darken
                diff = data.animationData[data.step][i + 1] - halfQuantity;
                changePercent = diff / halfQuantity;
                data.dataPoints[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
            } else {
                //Lighten
                diff = halfQuantity - data.animationData[data.step][i + 1];
                changePercent = diff / halfQuantity;
                data.dataPoints[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
            }
        }
        if (data.fluxData != null) {
            for (let i = 0; i < data.arrows.length; i++) {
                if (data.fluxData[data.step][i + 1] > halfFlux) { //i+1 because column 0 holds time info
                    //Darken
                    diff = data.fluxData[data.step][i + 1] - halfFlux;
                    changePercent = diff / halfFlux;
                    scene.remove(data.arrows[i].object);
                    data.arrows[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
                    scene.add(data.arrows[i].object) //Add newly colored arrow
                } else {
                    //Lighten
                    diff = halfFlux - data.fluxData[data.step][i + 1];
                    changePercent = diff / halfFlux;
                    scene.remove(data.arrows[i].object);
                    data.arrows[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
                    scene.add(data.arrows[i].object) //Add newly colored arrow
                }
            }
        }
    }

    function restoreArrow(savedData) {
        let arrow = new FluxArrow(savedData.arrowInfo);
        scene.add(arrow.object);
        return arrow;
    }

    function restoreDataPoint(savedData) {
        let labels = data.labels;
        let dataPoint = new DataPoint(savedData);
        scene.add(dataPoint.object.mesh);
        scene.add(dataPoint.shadow.mesh);
        let labelText = savedData.textMesh ? savedData.textMesh.geometries[0].text : " ";
        if (!labelText)
            labelText = " ";
        dataPoint.appendText(fontResource, labelText, dataPoint.position.x, dataPoint.position.y);
        scene.add(dataPoint.textMesh);
        labels.push(labelText);
        return dataPoint;
    }

    function addDataPoint() {
        let labels = data.labels;
        let labelMode = data.labelMode;
        let dataPoints = data.dataPoints;
        var labelText;
        if (labelMode && labels.length > dataPoints.length + 1) {
            labelText = labels[dataPoints.length + 1]
        } else {
            if (labelMode && labels.length <= dataPoints.length) {
                labelText = window.prompt("Imported data does not contain a column #" + dataPoints.length + ".\nPlease label your data point: ");

            } else {
                labelText = window.prompt("Label your data point: ");
            }
        }
        if ((!labelText) || (labelText === "")){
            alert("No label entered");
            return;
        }
        let dataPoint = new DataPoint();
        scene.add(dataPoint.object.mesh);
        scene.add(dataPoint.shadow.mesh);

        dataPoint.changeColor(baseColor);
        dataPoint.adjustScale(radius);
        dataPoint.appendText(fontResource, labelText, dataPoint.position.x, dataPoint.position.y);
        scene.add(dataPoint.textMesh);
        dataPoints.push(dataPoint);
        labels.push(labelText);

        dataPoint.setPosition( 0, 0, 0);
        dataPoint.moveText( 0, 0);
    }

    function removeFromScene(dataPoint) {
        scene.remove(dataPoint.object.mesh);
        scene.remove(dataPoint.shadow.mesh);
        scene.remove(dataPoint.textMesh);
    }

    function addArrow() {
        let arrows = data.arrows;
        var shift = false;
        //Check if new arrow is between an already arrowed combination
        for (var i = 0; i < arrows.length; i++){
            if (arrows[i].arrowInfo.pointIndex1 === arrowPoints[0] && arrows[i].arrowInfo.pointIndex2 === arrowPoints[1]){
                //Arrow already exists in that direction-- do nothing
                return
            }
            if (arrows[i].arrowInfo.pointIndex1 === arrowPoints[1] && arrows[i].arrowInfo.pointIndex2 === arrowPoints[0]){
                //Arrow exists in opposite direction-- shift new arrow
                shift = true;
            }
        }
        var arrowInfo = {
            shift: shift,
            len: 200,
            pointIndex1: arrowPoints[0],
            pointIndex2: arrowPoints[1],
            point1: data.dataPoints[arrowPoints[0]].position,
            point2: data.dataPoints[arrowPoints[1]].position,
            dataPointRadius: radius,
        }
        let arrow = new FluxArrow(arrowInfo);
        scene.add(arrow.object);
        arrowMode = 0;
        arrows.push(arrow);
    }

    function updateArrows(deletedDataPoint) {
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
                if ((index2 > deletedDataPoint) && (deletedDataPoint !== -1)){
                    index2--;
                    arrows[i].arrowInfo.pointIndex2--;
                }
                arrows[i].updatePos(data.dataPoints[index1].position, data.dataPoints[index2].position);
            }
        }
    }

    function deleteDataPoint() {
        if (dataPointToDelete > -1) {
            removeFromScene(data.dataPoints[dataPointToDelete]);
            data.dataPoints.splice(dataPointToDelete, 1);
            data.labels.splice(dataPointToDelete, 1);
        }
        updateArrows(dataPointToDelete);
    }

    function changeColor(newColor) {
        data.color = newColor;
        for (var i = 0; i < data.dataPoints.length; i++) {
            data.dataPoints[i].changeColor(newColor);
        }
    }

    function changeAllRadius() {
        let point;
        for (let i = 0; i < data.dataPoints.length; i++) {
            point = data.dataPoints[i];
            point.adjustScale(radius);
            point.changeTextSize(radius)
            point.moveText(point.object.mesh.position.x, point.object.mesh.position.y);
        }
        for (let i = 0; i < data.arrows.length; i++){
            data.arrows[i].adjustScale(radius);
        }
    }

    function update() {
        renderer.render(scene, camera);
    }

    return {
        update
    }
}