import SceneManager from './SceneManager';
import Interface from '../datGui/Interface';
import Controller from '../datGui/Controller';
import MouseHandler from '../MouseHandler';

export default (container, dataContext) => {
    const canvas = createCanvas(document, container);
    const sceneManager = new SceneManager(canvas, dataContext);
    const mouseHandler = new MouseHandler(canvas, dataContext);
    const controller = new Controller(dataContext);
    const menu = new Interface(controller);

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