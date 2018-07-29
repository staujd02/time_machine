/** Imported From:  https://github.com/PierfrancescoSoffritti/pierfrancescosoffritti.com/blob/master/src/components/home/header/threejs/threeEntryPoint.js*/
import SceneManager from './SceneManager';
import DataContext from './DataContext';

export default (container, IController) => {
    const canvas = createCanvas(document, container);
    const dataContext = new DataContext(IController);
    const sceneManager = new SceneManager(canvas, IController, dataContext);

    render();

    function createCanvas(document, container) {
        const canvas = document.createElement('canvas');  
        canvas.width = container.scrollWidth;
        canvas.height = container.scrollHeight;
        container.appendChild(canvas);
        return canvas;
    }
   
    function render() {
        requestAnimationFrame(render);
        sceneManager.update();
    }
}