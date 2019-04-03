'use strict';

import ActionUtilities from '../utilities/ActionUtilities';
    
const actionUtil = new ActionUtilities();

class Controller {

    constructor(dataContext) {
        this.dataContext = dataContext;
        this.controls = createControls(dataContext);
        this.callbacks = createCallbacks(this);
    }

    createControls(data) {
        return {
            size: radius,
            valueMax: data.valueMax,
            fluxMax: data.fluxMax,
            stepDelay: data.stepDelay,
            color: data.color,
            skipSteps: data.skipSteps,
            generateCompartments: generateCompartments,
            generateFluxArrows: generateFluxArrows,
            seekHelp: seekHelp,
            singleStep: singleStep,
            startStepping: startStepping,
            pauseAnimation: pauseAnimation,
            resetAnimation: reset,
            addPoint: addPoint,
            addArrow: addArrow,
            deletePoint: deletePoint,
            showIndices: false,
            compIndex: "",
            label: "",
            editMode: false,
            labelMode: false
        }
    }

    createCallbacks(Controller) {
        Controller.stepDelayCallback = this.stepDelayCallback.bind(this);
        Controller.skipStepsCallback = this.skipStepsCallback.bind(this);
        Controller.labelModeCallback = this.labelModeCallback.bind(this);
        Controller.showIndicesCallback = this.showIndicesCallback.bind(this);
        Controller.compIndexCallback = this.compIndexCallback.bind(this);
        Controller.labelCallback = this.labelCallback.bind(this);
        Controller.sizeCallback = this.sizeCallback.bind(this);
        Controller.valueMaxCallback = this.valueMaxCallback.bind(this);
        Controller.fluxMaxCallback = this.fluxMaxCallback.bind(this);
        Controller.colorCallback = this.colorCallback.bind(this);
    }

    colorCallback(newValue) {
        baseColor = newValue;
        changeColor(baseColor);
    }

    fluxMaxCallback(newValue) {
        data.fluxMax = newValue;
        halfFlux = data.fluxMax / 2.0;
    }

    valueMaxCallback(newValue) {
        data.valueMax = newValue;
        halfQuantity = data.valueMax / 2.0;
    }

    sizeCallback(newValue) {
        radius = newValue; //Ratio of original size
        data.radius = radius;
        changeAllRadius();
    }

    labelCallback(newValue) {
        scene.remove(data.compartments[userSelectedDataPoint].textMesh);
        data.compartments[userSelectedDataPoint].appendText(fontResource, newValue, data.compartments[userSelectedDataPoint].position.x, data.compartments[userSelectedDataPoint].position.y);
        scene.add(data.compartments[userSelectedDataPoint].textMesh);
    }

    compIndexCallback(newValue) {
        if (userSelectedDataPoint !== -1) {
            if ((newValue > data.compartments.length) || (newValue < 1)) {
                alert("Invalid Index");
            } else {
                data.compartments[userSelectedDataPoint].dataIndex = newValue;
                scene.remove(data.compartments[userSelectedDataPoint].indexTextMesh);
                if (controls.showIndices) {
                    data.compartments[userSelectedDataPoint].showIndex(fontResource);
                    scene.add(data.compartments[userSelectedDataPoint].indexTextMesh);
                }
            }
        }
    }

    showIndicesCallback(show) {
        revealIndices(show);
    }

    labelModeCallback(newValue) {
        data.labelMode = newValue;
    }

    editModeCallback(newValue) {
        editMode = newValue;
    }

    skipStepsCallback(newValue) {
        this.dataContext.skipSteps = newValue;
    }

    stepDelayCallback(newValue) {
        this.dataContext.stepDelay = newValue;
    }

    isDataLoaded() {
        if (data && !data.dataLoaded()) {
            alert("Please import data first");
        }
        return data.dataLoaded();
    }

    applyStep() {
        let text = data.step < 0 ? '0' : data.animationData[data.step][0];
        if (data.step >= 0) {
            colorPoints();
        }
        updateProgressBar(data.step + 1, text);
    }

    colorPoints() {
        let changePercent, diff;

        for (let i = 0; i < data.compartments.length; i++) {
            if (data.animationData[data.step][data.compartments[i].dataIndex] > halfQuantity) { //i+1 because column 0 holds time info
                //Darken
                diff = data.animationData[data.step][data.compartments[i].dataIndex] - halfQuantity;
                changePercent = diff / halfQuantity;
                data.compartments[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
            } else {
                //Lighten
                diff = halfQuantity - data.animationData[data.step][data.compartments[i].dataIndex];
                changePercent = diff / halfQuantity;
                data.compartments[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
            }
        }
        if (data.fluxData != null) {
            for (let i = 0; i < data.arrows.length - 1; i++) {
                if (data.fluxData[data.step][data.arrows[i].arrowInfo.dataIndex] > halfFlux) { //i+1 because column 0 holds time info
                    //Darken
                    diff = data.fluxData[data.step][data.arrows[i].arrowInfo.dataIndex] - halfFlux;
                    changePercent = diff / halfFlux;
                    scene.remove(data.arrows[i].object);
                    data.arrows[i].darkenColor(changePercent * 50); //Multiply by 50 - percent available to darken by
                    scene.add(data.arrows[i].object) //Add newly colored arrow
                } else {
                    //Lighten
                    diff = halfFlux - data.fluxData[data.step][data.arrows[i].arrowInfo.dataIndex];
                    changePercent = diff / halfFlux;
                    scene.remove(data.arrows[i].object);
                    data.arrows[i].lightenColor(changePercent * 50); //Multiply by 50 - percent available to lighten by
                    scene.add(data.arrows[i].object) //Add newly colored arrow
                }
            }
        }
    }

    reset() {
        if (data.animationData) {
            data.step = 0;
            paused = true;
            updateProgressBar(0, data.animationData[0][0]);
            applyStep();
        }
    }
    
    addPoint() {
        let labels = data.labels;
        let labelMode = data.labelMode;
        let compartments = data.compartments;
        var labelText;
        if (labelMode && labels.length > compartments.length + 1) {
            labelText = labels[compartments.length + 1]
        } else {
            if (labelMode && labels.length <= compartments.length) {
                labelText = window.prompt("Imported data does not contain a column #" + compartments.length + ".\nPlease label your data point: ");

            } else {
                labelText = window.prompt("Label your data point: ");
            }
        }
        if ((!labelText) || (labelText === "")) {
            alert("No label entered");
            return;
        }
        addCompartment(labelText);
    }


    deletePoint() {
        if (editMode) {
            deleteDataPoint();
        }
    }

    addArrow() {
        if (editMode) {
            arrowMode = 1;
        }
    }

    addPoint() {
        if (editMode) {
            addPoint();
        }
    }

    pauseAnimation() {
        paused = true;
    }

    seekHelp() {
        window.open(window.location.href + 'help.html', '_blank');
    }

    singleStep() {
        startStepping(true);
    }

    async startStepping(singleStep = false) {
        if (isDataLoaded()) {
            paused = false;
            stepForward(singleStep);
        }
    }
    
    async stepForward(singleStep = false) {
        if (data.hasNextStep()) {
            if (!paused) {
                applyStep();
                data.step += stepInc;
                await actionUtil.sleep(data.stepDelay);
                if (!singleStep)
                    stepForward();
            }
        }
    }


    generateCompartments() {
        if (data.animationData == null) {
            alert("Compartment data must be uploaded first");
            return;
        } else if (data.compartments.length > 0) {
            alert("Compartments already exist");
            return;
        }
        var rect = canvas.getBoundingClientRect();
        var freeSpace = rect.width - (data.animationData[0].length * (radius * 2)) - 2 * radius; // - 2*radius allocates for a radius buffer space on each end
        var spaceBetween = freeSpace / (data.animationData[0].length - 1);
        for (var i = 0; i < data.animationData[0].length; i++) {
            let xPos = -((rect.width / 2) - radius) + (i * radius * 2) + (i * spaceBetween) + radius; // + radius gives a radius buffer space on each end
            let label = !!data.labels[i + 1] ? data.labels[i + 1] : (i + 1).toString();
            addDataPoint(label);
            //Move to appropriate location
            data.compartments[i].setPosition(-xPos, -1, 0);
            data.compartments[i].moveText(-xPos, 0);
            if (controls.showIndices) {
                data.compartments[i].moveIndexText(-xPos, (3 / 4) * (data.compartments[dataPointToMove].radius));
            }
        }
    }

    generateFluxArrows() {
        if (data.arrows.length > 0) {
            alert("Flux Arrows already exist");
            return;
        } else if (!data.fluxData) {
            alert("Flux data must be uploaded first before automatic generation can take place.");
            return;
        } else if (!data.fluxOriginLabels && !data.fluxDestinationLabels) {
            alert("File Format does not support flux arrows. The first row must be the origin compartment and " +
                "the second row must be the destination compartment.");
            return;
        } else if (data.compartments.length <= 0) {
            alert("Compartments must be created first for this operation to succeed.");
            return;
        }
        for (let i = 0; i < data.fluxData[0].length; i++) {
            if (data.fluxDestinationLabels.length - 1 < i || data.fluxOriginLabels.length - 1 < i)
                break;
            if (!data.fluxDestinationLabels[i] || !data.fluxOriginLabels[i])
                continue;
            arrowPoints[0] = null;
            arrowPoints[1] = null;
            for (let j = 0; j < data.compartments.length; j++) {
                const element = data.compartments[j].labelText.toLowerCase().trim();
                if (element === data.fluxOriginLabels[i].toLowerCase().trim()) {
                    arrowPoints[0] = j;
                    if (arrowPoints[1] !== null) {
                        addArrow();
                        break;
                    }
                    continue;
                }
                if (element === data.fluxDestinationLabels[i].toLowerCase().trim()) {
                    arrowPoints[1] = j;
                    if (arrowPoints[0] !== null) {
                        addArrow();
                        break;
                    }
                    continue;
                }
            }
        }
    }
}

export default Controller;