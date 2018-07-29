/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import DataPoint from './DataPoint';
import * as dat from 'dat.gui';
import ActionUtilities from '../ActionUtilities';
import ProgressBar from './ProgressBar';

export default (canvas, IController) => {

    const actionUtil = new ActionUtilities();

    const origin = new THREE.Vector3(0, 0, 0);
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    const origRadius = 40;

    var paused = true;
    var timeStep = 300;
    var step = 0;
    var maxQuantity = 1;
    var halfQuantity = maxQuantity / 2.0;
    var baseColor = [170, 0, 255, 1];
    var radius = origRadius;
    var changeData = null; //Holds imported data. Column 1 is time info

    var mouseDown = false;
    var dataPointToMove = -1;
    var dataPointToDelete = -1;

    var progressBar;
    var dataPoints = [];
    var labels = [];
    var labelMode = false;
    var editMode;

    var fontResource;

    const controls = {
        size: origRadius,
        maxValue: maxQuantity,
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
    buildGUI();

    IController.resetDataAnimation = function () {
        step = 0;
        paused = true;
        progressBar.updateProgress(0, changeData[0][0]);
        applyStep();
    };

    IController.injectDataPointList = xlsxData => {
        labels = xlsxData[0];
        xlsxData.splice(0, 1);//Remove label column
        changeData = xlsxData;
        addStartStopText();
        progressBar.appendText(changeData[0][0]);
        progressBar.setSteps(changeData.length);
    };

    function loadFont() {
        var loader = new THREE.FontLoader();
        loader.load(
            'https://threejs.org//examples/fonts/helvetiker_regular.typeface.json',
            fontLoadingComplete
        );
    }

    function fontLoadingComplete(font) {
        fontResource = font;
        buildProgressBar();
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
            update();
        });
        var timeController = gui.add(controls, 'timeValue').name("Milliseconds Per Step").min(0).max(500).step(10)
        timeController.onChange(function (newValue) {
            timeStep = newValue;
        })
        var maxController = gui.add(controls, 'maxValue').name("Max Value");
        maxController.onChange(function (newValue) {
            maxQuantity = newValue;
            halfQuantity = maxQuantity / 2.0;
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
            labelMode = newValue;
        });
        editFolder.add(controls, 'addPoint').name("Add Data Point");
        editFolder.add(controls, 'deletePoint').name("Delete Data Point");

    }

    function buildProgressBar() {
        progressBar = new ProgressBar(scene, fontResource);
        progressBar.appendText("0");
        progressBar.addStart();
        progressBar.addStop();
        addStartStopText();
    }

    function setupEventListeners() {
        canvas.addEventListener("mousedown", function (evt) {
            mouseDown = true;
            checkWithinRange(canvas, evt);
        });
        canvas.addEventListener("mouseup", function (evt) {
            if (editMode) {
                mouseDown = false;
                dataPointToMove = -1; //No current selected dataPoint
            }

        });
        canvas.addEventListener("mousemove", function (evt) {
            if (editMode) {
                if (mouseDown) {
                    var mousePos = getMousePos(canvas, evt);
                    var newMousePos = canvasToThreePos(mousePos);
                    if (dataPointToMove > -1) {
                        dataPoints[dataPointToMove].position.set(newMousePos.x, newMousePos.y, 0);
                        dataPoints[dataPointToMove].moveText(newMousePos.x, newMousePos.y + (2 * radius));
                    }
                }
            }
        });
    }

    function checkWithinRange(canvas, evt) {
        var mousePos = canvasToThreePos(getMousePos(canvas, evt));
        //Check if click was on data point
        if (editMode) {
            for (var i = 0; i < dataPoints.length; i++) {
                var selected = dataPoints[i].withinCircle(mousePos.x, mousePos.y);
                if (selected) {
                    dataPointToMove = i;
                    dataPointToDelete = i;
                    break;
                }
            }
        }
        if (dataPointToMove === -1) { //Click was not on a datapoint
            dataPointToDelete = -1; //Deselect previous selection
            //Check if click was on progress bar
            if (progressBar && progressBar.withinBar(mousePos.x, mousePos.y)) {
                var clickedStep = progressBar.getStep(mousePos.x);
                let text = changeData[clickedStep - 1];
                progressBar.updateProgress(clickedStep, text ? text[0] : "0")
                step = clickedStep - 1;
                applyStep();
            }else if (progressBar.withinStop(mousePos.x, mousePos.y)){
                if (changeData == null) {
                    alert("Please import data first");
                }else{
                paused = true;
                }
            }else if (progressBar.withinStart(mousePos.x, mousePos.y)){
                if (changeData == null) {
                    alert("Please import data first");
                }else{
                    paused = false;
                    stepForward();
                }
            }
        }
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left, // + 145,
            y: evt.clientY - rect.top // + 86.5
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

    function validDataFound(changeData) {
        var noData = changeData == null;
        if (noData) {
            alert("Please import data first");
        }
        return !noData;
    }

    function dataExhausted(dataLength) {
        var stop = stepIndexExceedsDataLength(dataLength);
        return stop;
    }

    function stepIndexExceedsDataLength(dataLength) {
        return step >= dataLength;
    }

    async function startStepping() {
        if (validDataFound(changeData))
            paused = false;
            stepForward();
    }

    async function stepForward() {
        if (!dataExhausted(changeData.length)) {
            if(!paused){
                applyStep();
            step++;
            await actionUtil.sleep(timeStep);
            stepForward();
            }
        }
    }

    function applyStep() {
        let text = step < 0 ? '0' : changeData[step][0];
        if (step >= 0) {
            colorPoints();
        }
        progressBar.updateProgress(step + 1, text);
    }

    function colorPoints() {
        let changePercent, diff;

        for (var i = 0; i < dataPoints.length; i++) {
            if (changeData[step][i + 1] > halfQuantity) { //i+1 because column 0 holds time info
                //Darken
                diff = changeData[step][i + 1] - halfQuantity;
                changePercent = diff / halfQuantity;
                dataPoints[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
            } else {
                //Lighten
                diff = halfQuantity - changeData[step][i + 1];
                changePercent = diff / halfQuantity;
                dataPoints[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
            }
        }
    }

    function addDataPoint() {
        let dataPoint = new DataPoint(scene);
        dataPoint.changeColor(baseColor);
        dataPoint.scale.set(radius / origRadius, radius / origRadius, radius / origRadius);
        var labelText;
        if(labelMode && labels.length > dataPoints.length + 1){
            labelText = labels[dataPoints.length + 1]
        }else{
            if (labels.length <= dataPoints.length){
                labelText = window.prompt("Imported data does not contain a column #" + dataPoints.length + ".\nPlease label your data point: ");

            }else{
                labelText = window.prompt("Label your data point: ");
            }
        }
        
        dataPoint.appendText(fontResource, labelText, 0, (2 * radius));
        dataPoints.push(dataPoint);
        update();
    }


    function deleteDataPoint() {
        if (dataPointToDelete > -1) {
            dataPoints[dataPointToDelete].delete();
            dataPoints.splice(dataPointToDelete, 1);
        }
    }

    function changeColor(newColor) {
        for (var i = 0; i < dataPoints.length; i++) {
            dataPoints[i].changeColor(newColor);
        }
        update();
    }

    function changeAllRadius() {
        for (var i = 0; i < dataPoints.length; i++) {
            dataPoints[i].scale.set(radius / origRadius, radius / origRadius, radius / origRadius);
            dataPoints[i].changeTextSize(radius / origRadius)
        }
    }

    function addStartStopText(){
        var startText = document.createElement('div');
        startText.id = "startText";
        startText.style.position = 'absolute';
        startText.innerHTML = "Start";
        startText.style.top =  75 + 445 + 'px';//75 is navbar height
        startText.style.left = 200 + 'px';
        var stopText = document.createElement('div');
        stopText.id = "stopText";
        stopText.style.position = 'absolute';
        stopText.innerHTML = "Stop";
        stopText.style.top = 75 + 490 + 'px';//75 is navbar height
        stopText.style.left = 200 + 'px';
        removeTextSelection(startText);
        removeTextSelection(stopText);
        document.body.appendChild(startText);
        document.body.appendChild(stopText);
    }

    function removeTextSelection(text){
        text.style.MozUserSelect = "none";
    }

    function update() {
        renderer.render(scene, camera);
    }

    return {
        update
    }
}