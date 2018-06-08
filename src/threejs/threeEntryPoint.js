/** Imported From:  https://github.com/PierfrancescoSoffritti/pierfrancescosoffritti.com/blob/master/src/components/home/header/threejs/threeEntryPoint.js*/
import SceneManager from './SceneManager';

export default container => {
    const canvas = createCanvas(document, container);
    const sceneManager = new SceneManager(canvas);

    bindEventListeners();
    render();

    function createCanvas(document, container) {
        const canvas = document.createElement('canvas');  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.appendChild(canvas);
        return canvas;
    }

    function bindEventListeners() {
       // window.onresize = resizeCanvas;
    }

    function resizeCanvas() {  //TODO: Fix resize function      
        /*canvas.style.width = '100%';
        canvas.style.height= '100%';
        
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        canvasHalfWidth = Math.round(canvas.offsetWidth/2);
        canvasHalfHeight = Math.round(canvas.offsetHeight/2);

        sceneManager.onWindowResize()*/
    }

    function render(time) {
        requestAnimationFrame(render);
        sceneManager.update();
    }
}