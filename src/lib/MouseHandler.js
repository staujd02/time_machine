'use strict';

import {
    isUndefined
} from 'util';

class MouseHandler {

    constructor(canvas, dataContext) {
        this.dataContext = dataContext;
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        setupEventListeners(canvas, this);
    }

    mouseDown(evt) {
        mouseDown = true;
        checkWithinRange(canvas, evt);
    }

    mouseUp(evt) {
        if (editMode) {
            if (arrowMode === 1) {
                arrowMode = 2;
                checkWithinRange(canvas, evt);
                if ((arrowPoints[0] != null) && (arrowPoints[1] != null)) {
                    addArrow();
                } else {
                    alert("Dragged line was not between two data points");
                }
                //Reset arrow points
                arrowPoints[0] = null;
                arrowPoints[1] = null;
            }
            mouseDown = false;
            dataPointToMove = -1; //No current selected compartment
        }
        if (data.arrows.length > 0) {
            updateArrows(-1);
        }
    }

    mouseMove(evt) {
        if (editMode) {
            if (mouseDown) {
                var mousePos = getMousePos(canvas, evt);
                var newMousePos = canvasToThreePos(mousePos);
                if (dataPointToMove > -1) {
                    data.compartments[dataPointToMove].setPosition(newMousePos.x, newMousePos.y, 0);
                    data.compartments[dataPointToMove].moveText(newMousePos.x, newMousePos.y);
                    if (controls.showIndices) {
                        data.compartments[dataPointToMove].moveIndexText(newMousePos.x, newMousePos.y + (3 / 4) * (data.compartments[dataPointToMove].radius));
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
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvasToThreePos(mousePos) {
        var rect = canvas.getBoundingClientRect();
        var newX, newY;
        newX = (rect.width / 2) - mousePos.x;
        newY = mousePos.y - (rect.height / 2);
        return {
            x: newX,
            y: newY
        };
    }

    checkWithinRange(canvas, evt) {
        var mousePos = canvasToThreePos(getMousePos(canvas, evt));
        //Check if click was on data point
        controls.compIndex = ""; //Clear
        controls.label = ""; //Clear
        if (editMode) {
            for (var i = 0; i < data.compartments.length; i++) {
                var selected = data.compartments[i].withinCircle(mousePos.x, mousePos.y);
                if (selected && arrowMode === 1) {
                    data.compartments[i].shadow.mesh.material.color.set("#ffff00");
                    arrowPoints[0] = i
                } else if (selected && arrowMode === 2) {
                    data.compartments[i].shadow.mesh.material.color.set("#ffff00");
                    arrowPoints[1] = i
                } else if (selected) {
                    if (userSelectedDataPoint !== -1) {
                        data.compartments[userSelectedDataPoint].shadow.mesh.material.color.set("#cccccc");
                    }
                    data.compartments[i].shadow.mesh.material.color.set("#ffff00");
                    dataPointToMove = i;
                    controls.compIndex = data.compartments[i].dataIndex;
                    controls.label = data.compartments[i].labelText;
                    userSelectedDataPoint = i;
                    break;
                } else if (!isUndefined(data.compartments[i])) {
                    data.compartments[i].shadow.mesh.material.color.set("#cccccc");
                }
            }
        }
        if (dataPointToMove === -1 && progressBar) { //Click was not on a datapoint
            userSelectedDataPoint = -1; //Deselect previous selection
            if (data.animationData && !isDataLoaded()) {
                alert("Please import data first");
                return;
            }

            //Check if click was on progress bar
            if (progressBar.withinBar(mousePos.x, mousePos.y) && data.animationData) {
                var clickedStep = progressBar.getStep(mousePos.x);
                let text = data.animationData[clickedStep - 1];
                updateProgressBar(clickedStep, text ? text[0] : "0");
                data.step = clickedStep - 1;
                applyStep();
            }
        }
    }

    isDataLoaded() {
        if (data && !data.dataLoaded()) {
            alert("Please import data first");
        }
        return data.dataLoaded();
    }


}

export default MouseHandler;