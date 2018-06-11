/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
import * as THREE from 'three';
import DataPoint from './DataPoint';

export default canvas => {

    const origin = new THREE.Vector3(0,0,0);

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    var dataPointGeometry = new THREE.CircleGeometry( 40, 32 );
    var dataPointMaterial = new THREE.MeshBasicMaterial( { color: 0x808080 } );
    var dataPointScale = 1.0;
    var dataPoints = createSampleDataPoints(40);
    
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
   
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

    function createSampleDataPoints(radius){
        var hold = [];
        for(var i = 0; i < 3; i++){
            hold[i] = new DataPoint(dataPointGeometry, dataPointMaterial);
        }
        hold[0].position.set(0, 0, 1);
        hold[1].position.set(-300, 80, 1);
        hold[2].position.set(400, 200, 1);

        return hold;
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