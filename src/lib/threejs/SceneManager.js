/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import DataPoint from './DataPoint';
import * as dat from 'dat.gui';
import ActionUtilities from '../ActionUtilities';
import ProgressBar from './ProgressBar';
import FluxArrow from './FluxArrow';

export default (canvas, IController, data) => {

    const actionUtil = new ActionUtilities();

    const origin = new THREE.Vector3(0, 0, 0);
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    const origRadius = 40;

    var paused = true;
    var timeStep = 300;
    var stepInc = 1;
    var maxQuantity = 1;
    var maxFlux = 1;
    var halfQuantity = maxQuantity / 2.0;
    var halfFlux = maxFlux / 2.0;
    var baseColor = [170, 0, 255, 1];
    var radius = origRadius;

    var mouseDown = false;
    var dataPointToMove = -1;
    var dataPointToDelete = -1;

    var progressBar;
    var editMode;
    var arrowMode = 0; //0 = Off, 1 = Waiting for 1st point, 2 = Waiting for 2nd point
    var arrowPoints = [] //After `Add Arrow`, [0] holds FROM data point's index, [1] holds TO data point's index

    var fontResource;

    const controls = {
        size: origRadius,
        maxValue: maxQuantity,
        maxFlux: maxFlux,
        timeValue: timeStep,
        color: [170, 0, 255, 1],
        changeStep: function () {
            startStepping();
        },
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
        incrementStep: stepInc,
        editMode: false,
        labelMode: false
    }

    loadFont();
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    buildGUI();

    IController.resetDataAnimation = function () {
        if (data.animationData) {
            data.step = 0;
            paused = true;
            progressBar.updateProgress(0, data.animationData[0][0]);
            applyStep();
        }
    };

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
            hydratedPoints.push(restoreDataPoint(oldPoint));
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

        gui.add(controls, 'changeStep').name("Step Forward");
        var sizeController = gui.add(controls, 'size').name("Size").min(10).max(100).step(1);
        sizeController.onChange(function (newValue) {
            radius = newValue; //Ratio of original size
            changeAllRadius();
        });
        var timeController = gui.add(controls, 'timeValue').name("Delay (in ms)").min(0).max(500).step(10)
        timeController.onChange(function (newValue) {
            timeStep = newValue;
        })
        var maxController = gui.add(controls, 'maxValue').name("Max Value");
        maxController.onChange(function (newValue) {
            maxQuantity = newValue;
            halfQuantity = maxQuantity / 2.0;
        });
        var maxFluxController = gui.add(controls, 'maxFlux').name("Max Flux");
        maxFluxController.onChange(function (newValue) {
            maxFlux = newValue;
            halfFlux = maxFlux / 2.0;
        });
        var colorController = gui.addColor(controls, 'color');
        colorController.onChange(function (newValue) {
            baseColor = newValue;
            changeColor(baseColor);
        })

        var editFolder = gui.addFolder("Edit");
        editFolder.add(controls, 'editMode').name("Edit Mode").onChange(function (newValue) {
            editMode = newValue;
        });
        editFolder.add(controls, 'labelMode').name("Import Labels").onChange(function (newValue) {
            data.labelMode = newValue;
        });
        editFolder.add(controls, 'addPoint').name("Add Data Point");
        editFolder.add(controls, 'addArrow').name("Add Arrow");
        editFolder.add(controls, 'deletePoint').name("Delete Data Point");

        var incFolder = gui.addFolder("Adjust Increment")
        incFolder.add(controls, 'incrementStep').name("Skip Steps").onChange(function (newValue) {
            stepInc = newValue;
        })
    }

    function buildProgressBar() {
        //Calculate positions for start/stop buttons
        var startPos = {
            x: (canvas.width / 5),
            y: (canvas.height / 4) * 3,
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
        var newX, newY;
        newX = (canvas.width / 2) - mousePos.x;
        newY = mousePos.y - (canvas.height / 2);
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

    async function startStepping() {
        if (isDataLoaded()) {
            paused = false;
            stepForward();
        }
    }

    async function stepForward() {
        if (data.hasNextStep()) {
            if (!paused) {
                applyStep();
                data.step += stepInc;
                await actionUtil.sleep(timeStep);
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
        for (var i = 0; i < data.dataPoints.length; i++) {
            data.dataPoints[i].changeColor(newColor);
        }
    }

    function changeAllRadius() {
        for (let i = 0; i < data.dataPoints.length; i++) {
            data.dataPoints[i].adjustScale(radius);
            data.dataPoints[i].changeTextSize(radius)
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