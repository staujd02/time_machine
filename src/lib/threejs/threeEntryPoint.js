/** Imported From:  https://github.com/PierfrancescoSoffritti/pierfrancescosoffritti.com/blob/master/src/components/home/header/threejs/threeEntryPoint.js*/
import SceneManager from './SceneManager';

export default (container, IController) => {
    const canvas = createCanvas(document, container);
    const sceneManager = new SceneManager(canvas, IController);

    render();

    function createCanvas(document, container) {
        const canvas = document.createElement('canvas');  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.appendChild(canvas);
        return canvas;
    }

    function render(time) {
        requestAnimationFrame(render);
        sceneManager.update();
    }
}