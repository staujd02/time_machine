/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import DataPoint from './DataPoint';
import * as dat from 'dat.gui';

export default (canvas, IController) => {

    const origin = new THREE.Vector3(0,0,0);

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
    const controls = {
        size: 40,
        changeStep : function(){
            startStepping();
        }
    }

    var step = 0;
    var maxQuantity = 1; //Highest quantity the vitamin will reach
    var halfQuantity = maxQuantity/2.0;
    var baseColor = 0xaa00ff;
    var changeData = null; //Holds imported data 

    var dataPointGeometry = new THREE.CircleGeometry( 40, 32 );
    var dataPointMaterial = new THREE.MeshBasicMaterial( { color: baseColor } );
    var dataPointScale = 1.0;
    var dataPoints = createSampleDataPoints(40);
    
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    buildGUI();

    IController.injectDataPointList = processDataPointList;

    function buildGUI(){
        var gui = new dat.GUI();
        gui.add(controls, 'changeStep').name("Step Forward");
        var sizeController = gui.add(controls, 'size').min(10).max(100).step(1);
        sizeController.onChange(function(newValue){
            dataPointScale = newValue/40.0; //Ratio of original size (40)
            update();
        });
    }
   
    function buildScene() {
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
        hold[0].position.set(0, 0, 1);
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
        await sleep(600);
        stepForward();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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