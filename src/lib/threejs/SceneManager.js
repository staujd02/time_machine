/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import DataPoint from './DataPoint';
import * as dat from 'dat.gui';
import Action from '../ActionUtilities';
import ActionUtilities from '../ActionUtilities';

export default (canvas, IController) => {

    const actionUtil = new ActionUtilities();

    const origin = new THREE.Vector3(0,0,0);
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
   
    var step = 0;
    var maxQuantity = 1; //Highest quantity the vitamin will reach
    var halfQuantity = maxQuantity/2.0;
    var baseColor = 0xaa00ff;
    var changeData = null; //Holds imported data 

    var mouseDown = false;
    var dataPointToMove = -1;
    var dataPointToDelete = -1;

    var radius = 40;
    var dataPointGeometry = new THREE.CircleGeometry( radius, 32 );
    var dataPointMaterial = new THREE.MeshBasicMaterial( { color: baseColor } );
    var dataPointScale = 1.0;
    var dataPoints = createSampleDataPoints(40);

    const controls = {
        size: radius,
        changeStep : function(){
            startStepping();
        },
        addPoint : function(){
            addDataPoint(dataPoints.length);
        },
        deletePoint : function(){
            deleteDataPoint();
        }
    }
    
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    buildGUI();

    IController.injectDataPointList = processDataPointList;
    IController.resetDataAnimation = () =>    { step = 0 };
    IController.injectDataPointList = json => { changeData = json };

    function buildGUI(){
        var gui = new dat.GUI();
        gui.add(controls, 'changeStep').name("Step Forward");
        gui.add(controls, 'addPoint').name("Add Data Point");
        gui.add(controls, 'deletePoint').name("Delete Data Point");
        var sizeController = gui.add(controls, 'size').min(10).max(100).step(1);
        sizeController.onChange(function(newValue){
            dataPointScale = newValue/radius; //Ratio of original size
            update();
        });
    }

    function setupEventListeners(){
        canvas.addEventListener("mousedown", function(evt) {
            mouseDown = true;
            checkWithinRange(canvas, evt);
        });
        canvas.addEventListener("mouseup", function(evt) {
            mouseDown = false;
            dataPointToMove = -1; //No current selected dataPoint
        });
        canvas.addEventListener("mousemove", function(evt) {
            if(mouseDown){
                var mousePos = getMousePos(canvas, evt);
            var newMousePos = canvasToThreePos(mousePos);
            if(dataPointToMove > -1){
                dataPoints[dataPointToMove].position.set(newMousePos.x, newMousePos.y, 0);
            }
            }
        });
    }

    function checkWithinRange(canvas, evt){
        var mousePos = canvasToThreePos(getMousePos(canvas, evt));
        for(var i = 0; i < dataPoints.length; i++){
            var selected = dataPoints[i].withinCircle(mousePos.x, mousePos.y, 40);
            if(selected){
                dataPointToMove = i;
                dataPointToDelete = i;
            }
        }
        if(dataPointToMove == -1){//Click was not on a datapoint
            dataPointToDelete = -1; //Deselect previous selection
        }
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    function canvasToThreePos(mousePos){
        var newX, newY;
        if(mousePos.x > (canvas.width/2)){
            newX = (canvas.width/2) - mousePos.x;
        }else{
            newX = (canvas.width/2) - mousePos.x;
        }
        if(mousePos.y > (canvas.height / 2)){
            newY =  mousePos.y - (canvas.height/2);
        }else{
            newY = mousePos.y - (canvas.height/2);
        }
        return {
           x: newX,
           y: newY
          };
    }
   
    function buildScene() {
        setupEventListeners();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#FFF");
        for (var i = 0; i < dataPoints.length; i++){
            scene.add(dataPoints[i]);
        }
        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true; 

        return renderer;
    }

    function buildCamera({ width, height }) {
        var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / - 2, height /2, 1, 1000 );
        camera.position.set(0, 0, -10);
        camera.lookAt(origin)
        return(camera);
    }

    function createSampleDataPoints(){
        var hold = [];
        hold[0] = new DataPoint(dataPointGeometry, dataPointMaterial);
        hold[0].position.set(0, 0, 0);
        return hold;
    }

    function processDataPointList(json){
        changeData = json;
    }

    function validDataFound(changeData){
        var b = changeData != null;
        if(!b){
            alert("Please import data first");
        }
        return b;
    }
    
    function dataExhausted(changeData){
        var b = step >= changeData.length;
        if(b)
            alert("No more data!");
        return step >= changeData.length;
    }

    async function startStepping(){
        if(validDataFound(changeData))
            stepForward();
    }

    async function stepForward(){
        if(!dataExhausted(changeData))
            incrementData();
    }

    async function incrementData(){
        let changePercent, diff;

        for(var i = 0; i < dataPoints.length; i++){
            if(changeData[step][i] > halfQuantity){
                //Darken
                diff = changeData[step][i] - halfQuantity;
                changePercent = diff/halfQuantity;
                dataPoints[i].darkenColor(changePercent * 50);//Multiply by 50 - percent available to darken by
            }else{
                //Lighten
                diff = halfQuantity - changeData[step][i];
                changePercent = diff/halfQuantity;
                dataPoints[i].lightenColor(changePercent * 50);//Multiply by 50 - percent available to lighten by
            }
        }
        step++;
        await actionUtil.sleep(600);
        stepForward();
    }

    function addDataPoint(index){
        dataPoints[index] = new DataPoint(dataPointGeometry, dataPointMaterial);
        dataPoints[index].position.set(0, 0, 0);
        scene.add(dataPoints[index]);
        update();
    }

    function deleteDataPoint(){
        if(dataPointToDelete > -1){
            scene.remove(dataPoints[dataPointToDelete]);
            dataPoints[dataPointToDelete] = null;
            var idx = 0;
            dataPoints = new Array();
            for(var i = 0; i < dataPoints.length; i++){
                if(dataPoints[i] != null){
                    dataPoints[idx] = dataPoints[i];
                    idx++;
                }
            }
        }
    }


    function update() {
        for(var i = 0; i < dataPoints.length; i++){
             dataPoints[i].scale.set(dataPointScale, dataPointScale, dataPointScale);
        }
        
        renderer.render(scene, camera);
    }

    return {
        update
    }
}