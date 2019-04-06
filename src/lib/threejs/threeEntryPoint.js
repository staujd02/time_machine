import SceneManager from './SceneManager';
import Interface from '../datGui/Interface';
import Controller from '../datGui/Controller';
import MouseHandler from '../MouseHandler';

export default (container, dataContext) => {
    const canvas = createCanvas(document, container);
    ensureDefaults(dataContext, canvas);
    const sceneManager = new SceneManager(canvas, dataContext);
    new MouseHandler(canvas, dataContext, sceneManager);
    const controller = new Controller(dataContext, sceneManager);
    const menu = new Interface(controller);

    dataContext.registerCallback(() => {
        updatePanel(menu, dataContext);
    });

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

    function ensureDefaults(dataContext, canvas) {
        dataContext.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        }
        dataContext.origRadius = 40;
        dataContext.paused = true;
        dataContext.stepInc = 1;
        dataContext.color = dataContext.color || [70, 156, 150, 1];
        dataContext.stepDelay = dataContext.stepDelay || 300;
        dataContext.valueMax = dataContext.valueMax || 1;
        dataContext.fluxMax = dataContext.fluxMax || 1;
        dataContext.skipSteps = dataContext.skipSteps || 1;
        dataContext.radius = dataContext.radius || dataContext.origRadius;
        dataContext.halfQuantity = dataContext.valueMax / 2.0;
        dataContext.halfFlux = dataContext.fluxMax / 2.0;
        dataContext.baseColor = [170, 0, 255, 1];
        dataContext.radius = dataContext.radius || dataContext.origRadius;
        dataContext.mouseDown = false;
        dataContext.dataPointToMove = -1;
        dataContext.userSelectedDataPoint = -1;
        dataContext.progressBar = null;
        dataContext.editMode = false;
        dataContext.arrowMode = 0; //0 = Off, 1 = Waiting for 1st point, 2 = Waiting for 2nd point
        dataContext.arrowPoints = []; //After `Add Arrow`, [0] holds FROM data point's index, [1] holds TO data point's index
        dataContext.fontResource = null;
    }

    function updatePanel(gui, data) {
        data.skipSteps = data.skipSteps || 1;
        data.stepDelay = data.stepDelay || 300;
        data.valueMax = data.valueMax || 1;
        data.fluxMax = data.fluxMax || 1;
        data.color = data.color || [70, 156, 150, 1];
        data.radius = data.radius || data.origRadius;
        data.halfQuantity = data.valueMax / 2.0;
        data.halfFlux = data.fluxMax / 2.0;
        gui.controls.size = data.radius;
        gui.controls.skipSteps = data.skipSteps;
        gui.controls.valueMax = data.valueMax;
        gui.controls.fluxMax = data.fluxMax;
        gui.controls.stepDelay = data.stepDelay;
        gui.controls.color = data.color;
        gui.updateDisplay();
    }


}