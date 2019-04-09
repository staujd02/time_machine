import {
    isUndefined
} from 'util';

class MouseHandler {

    constructor(canvas, dataContext, sceneManager) {
        this.dataContext = dataContext;
        this.sceneManager = sceneManager;
        this.canvas = canvas;
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.bindLocalFunctions(this);
        this.setupEventListeners(canvas, this);

    }

    bindLocalFunctions(handler){
        handler.getMousePos = handler.getMousePos.bind(handler);
        handler.isDataLoaded = handler.isDataLoaded.bind(handler); 
        handler.checkWithinRange = handler.checkWithinRange.bind(handler);
        handler.canvasToThreePos = handler.canvasToThreePos.bind(handler);
        handler.applyStep = handler.applyStep.bind(handler);
    }

    mouseDown(evt) {
        this.dataContext.mouseDown = true;
        this.checkWithinRange(this.canvas, evt);
    }

    mouseUp(evt) {
        let data = this.dataContext;
        if (data.editMode) {
            if (data.arrowMode === 1) {
                data.arrowMode = 2;
                this.checkWithinRange(this.canvas, evt);
                if ((data.arrowPoints[0] != null) && (data.arrowPoints[1] != null)) {
                    this.sceneManager.addArrow();
                } else {
                    alert("Dragged line was not between two data points");
                }
                //Reset arrow points
                data.arrowPoints[0] = null;
                data.arrowPoints[1] = null;
            }
            data.mouseDown = false;
            data.dataPointToMove = -1; //No current selected compartment
        }
        if (data.arrows.length > 0) {
            this.sceneManager.updateArrows(-1);
        }
    }

    mouseMove(evt) {
        let data = this.dataContext;
        if (data.editMode) {
            if (data.mouseDown) {
                let mousePos = this.getMousePos(this.canvas, evt);
                let newMousePos = this.canvasToThreePos(mousePos);
                if (data.dataPointToMove > -1) {
                    data.compartments[data.dataPointToMove].setPosition(newMousePos.x, newMousePos.y, 0);
                    data.compartments[data.dataPointToMove].moveText(newMousePos.x, newMousePos.y);
                    if (data.showIndices()) {
                        data.compartments[data.dataPointToMove].moveIndexText(newMousePos.x, newMousePos.y + (3 / 4) * (data.compartments[data.dataPointToMove].radius));
                    }
                }
            }
        }
    }

    setupEventListeners(canvas, handler) {
        canvas.addEventListener("mousedown", handler.mouseDown);
        canvas.addEventListener("mouseup", handler.mouseUp);
        canvas.addEventListener("mousemove", handler.mouseMove);
    }

    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvasToThreePos(mousePos) {
        let rect = this.canvas.getBoundingClientRect();
        let newX, newY;
        newX = (rect.width / 2) - mousePos.x;
        newY = mousePos.y - (rect.height / 2);
        return {
            x: newX,
            y: newY
        };
    }

    checkWithinRange(canvas, evt) {
        let mousePos = this.canvasToThreePos(this.getMousePos(canvas, evt));
        this.dataContext.updateDisplay("", "");
        let data = this.dataContext;
        if (data.editMode) {
            for (var i = 0; i < data.compartments.length; i++) {
                let selected = data.compartments[i].withinCircle(mousePos.x, mousePos.y);
                if (selected && data.arrowMode === 1) {
                    data.compartments[i].shadow.mesh.material.color.set("#ffff00");
                    data.arrowPoints[0] = i
                } else if (selected && data.arrowMode === 2) {
                    data.compartments[i].shadow.mesh.material.color.set("#ffff00");
                    data.arrowPoints[1] = i
                } else if (selected) {
                    if (data.userSelectedDataPoint !== -1) {
                        data.compartments[data.userSelectedDataPoint].shadow.mesh.material.color.set("#cccccc");
                    }
                    data.compartments[i].shadow.mesh.material.color.set("#ffff00");
                    data.dataPointToMove = i;
                    data.updateDisplay(data.compartments[i].dataIndex, data.compartments[i].labelText);
                    data.userSelectedDataPoint = i;
                    break;
                } else if (!isUndefined(data.compartments[i])) {
                    data.compartments[i].shadow.mesh.material.color.set("#cccccc");
                }
            }
        }
        if (data.dataPointToMove === -1 && data.progressBar) { //Click was not on a datapoint
            data.userSelectedDataPoint = -1; //Deselect previous selection
            if (data.animationData && !this.isDataLoaded()) {
                alert("Please import data first");
                return;
            }

            //Check if click was on progress bar
            if (data.progressBar.withinBar(mousePos.x, mousePos.y) && data.animationData) {
                let clickedStep = data.progressBar.getStep(mousePos.x);
                let text = data.animationData[clickedStep - 1];
                this.sceneManager.updateProgressBar(clickedStep, text ? text[0] : "0");
                data.step = clickedStep - 1;
                this.applyStep();
            }
        }
    }

    isDataLoaded() {
        let data = this.dataContext;
        if (data && !data.dataLoaded()) {
            alert("Please import data first");
        }
        return data.dataLoaded();
    }

    applyStep() {
        let text = this.dataContext.step < 0 ? '0' : this.dataContext.animationData[this.dataContext.step][0];
        if (this.dataContext.step >= 0) {
            this.sceneManager.colorPoints();
        }
        this.sceneManager.updateProgressBar(this.dataContext.step + 1, text);
    }


}

export default MouseHandler;