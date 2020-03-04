import ActionUtilities from '../utilities/ActionUtilities';

const actionUtil = new ActionUtilities();

class Controller {

    constructor(dataContext, sceneManager) {
        this.dataContext = dataContext;
        this.sceneManager = sceneManager;
        this.controls = this.createControls.bind(this)(dataContext);
        this.callbacks = this.createCallbacks(this);
        this.dataContext.showIndices = () => {
            return this.controls.showIndices;
        };
        this.dataContext.updateDisplay = (cIndex, label) => {
            this.controls.compIndex = cIndex; 
            this.controls.label = label; 
        };
    }

    createControls(data) {
        this.bindControllerFunctions(this);
        return {
            size: data.radius,
            valueMax: data.valueMax,
            fluxMax: data.fluxMax,
            stepDelay: data.stepDelay,
            color: data.color,
            skipSteps: data.skipSteps,
            generateCompartments: this.generateCompartments.bind(this),
            generateFluxArrows: this.generateFluxArrows.bind(this),
            seekHelp: this.seekHelp.bind(this),
            singleStep: this.singleStep.bind(this),
            startStepping: this.startStepping.bind(this),
            pauseAnimation: this.pauseAnimation.bind(this),
            resetAnimation: this.reset.bind(this),
            addPoint: this.addPoint.bind(this),
            addArrow: this.addArrow.bind(this),
            deletePoint: this.deletePoint.bind(this),
            showIndices: false,
            compIndex: "",
            label: "",
            editMode: false,
            labelMode: false
        }
    }

    bindControllerFunctions(controller) {
        controller.singleStep = controller.singleStep.bind(controller);
        controller.generateCompartments = controller.generateCompartments.bind(controller);
        controller.generateFluxArrows = controller.generateFluxArrows.bind(controller);
        controller.startStepping = controller.startStepping.bind(controller);
        controller.pauseAnimation = controller.pauseAnimation.bind(controller);
        controller.resetAnimation = controller.reset.bind(controller);
        controller.addPoint = controller.addPoint.bind(controller);
        controller.addCompartment = controller.addCompartment.bind(controller);
        controller.addArrow = controller.addArrow.bind(controller);
        controller.deletePoint = controller.deletePoint.bind(controller);

        controller.isDataLoaded = controller.isDataLoaded.bind(controller);
        controller.applyStep = controller.applyStep.bind(controller);
        controller.stepForward = controller.stepForward.bind(controller);
        controller.deleteDataPoint = controller.deleteDataPoint.bind(controller);
    }

    createCallbacks(Controller) {
        Controller.stepDelayCallback = this.stepDelayCallback.bind(this);
        Controller.editModeCallback = this.editModeCallback.bind(this);
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
        this.dataContext.baseColor = newValue;
        this.sceneManager.changeColor(newValue);
    }

    fluxMaxCallback(newValue) {
        this.dataContext.fluxMax = newValue;
        this.dataContext.halfFlux = this.dataContext.fluxMax / 2.0;
    }

    valueMaxCallback(newValue) {
        this.dataContext.valueMax = newValue;
        this.dataContext.halfQuantity = this.dataContext.valueMax / 2.0;
    }

    sizeCallback(newValue) {
        this.dataContext.radius = newValue;
        this.sceneManager.changeAllRadius();
    }

    labelCallback(newValue) {
        this.sceneManager.renameCompartment(this.dataContext.compartments[this.dataContext.userSelectedDataPoint], newValue);
    }

    compIndexCallback(newValue) {
        if (this.dataContext.userSelectedDataPoint !== -1) {
            if ((newValue > this.dataContext.compartments.length) || (newValue < 1)) {
                alert("Invalid Index");
            } else {
                let compartment = this.dataContext.compartments[this.dataContext.userSelectedDataPoint];
                compartment.dataIndex = newValue;
                this.sceneManager.updateCompartmentIndexText(compartment, this.controls.showIndices);
            }
        }
    }

    showIndicesCallback(show) {
        this.revealIndices(show);
        this.revealIndices = this.revealIndices.bind(this);
    }

    labelModeCallback(newValue) {
        this.dataContext.labelMode = newValue;
    }

    editModeCallback(newValue) {
        this.dataContext.editMode = newValue;
    }

    skipStepsCallback(newValue) {
        this.dataContext.skipSteps = newValue;
    }

    stepDelayCallback(newValue) {
        this.dataContext.stepDelay = newValue;
    }

    isDataLoaded() {
        if (this.dataContext && !this.dataContext.dataLoaded()) {
            alert("Please import data first");
        }
        return this.dataContext.dataLoaded();
    }

    revealIndices(show) {
        if (show) {
            for (let i = 0; i < this.dataContext.compartments.length; i++) {
                this.sceneManager.showCompartmentIndexText(this.dataContext.compartments[i]);
            }
            for (let i = 0; i < this.dataContext.arrows.length; i++) {
                this.sceneManager.showFluxIndexText(this.dataContext.arrows[i]);
            }
            return;
        }

        for (let i = 0; i < this.dataContext.compartments.length; i++) {
            this.sceneManager.hideCompartmentIndexText(this.dataContext.compartments[i]);
        }
        for (let i = 0; i < this.dataContext.arrows.length; i++) {
            this.sceneManager.hideFluxIndexText(this.dataContext.arrows[i]);
        }
    }


    deleteDataPoint() {
        let deletedPoint = this.dataContext.userSelectedDataPoint;
        if (this.dataContext.userSelectedDataPoint > -1) {
            this.sceneManager.removeFromScene(this.dataContext.compartments[this.dataContext.userSelectedDataPoint]);
            this.dataContext.compartments.splice(this.dataContext.userSelectedDataPoint, 1);
            this.dataContext.userSelectedDataPoint = -1;
        }
        this.sceneManager.updateArrows(deletedPoint);
    }

    applyStep() {
        let text = this.dataContext.step < 0 ? '0' : this.dataContext.animationData[this.dataContext.step][0];
        if (this.dataContext.step >= 0) {
            this.sceneManager.colorPoints();
        }
        this.sceneManager.updateProgressBar(this.dataContext.step + 1, text);
    }


    reset() {
        if (this.dataContext.animationData) {
            this.dataContext.step = 0;
            this.dataContext.paused = true;
            this.sceneManager.updateProgressBar(0, this.dataContext.animationData[0][0]);
            this.applyStep();
        }
    }

    addCompartment() {
        let data = this.dataContext;
        let labels = data.labels;
        let labelMode = data.labelMode;
        let compartments = data.compartments;
        let labelText;
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
        this.sceneManager.addCompartment(labelText, this.controls.showIndices);
    }


    deletePoint() {
        if (this.dataContext.editMode) {
            this.deleteDataPoint();
        }
    }

    addArrow() {
        if (this.dataContext.editMode) {
            this.dataContext.arrowMode = 1;
        }
    }

    addPoint() {
        if (this.dataContext.editMode) {
            this.addCompartment();
        }
    }

    pauseAnimation() {
        this.dataContext.paused = true;
    }

    seekHelp() {
        window.open(window.location.href + 'help.html', '_blank');
    }

    singleStep() {
        this.startStepping(true);
    }

    async startStepping(singleStep = false) {
        if (this.isDataLoaded()) {
            this.dataContext.paused = false;
            this.stepForward(singleStep);
        }
    }

    async stepForward(singleStep = false) {
        if (this.dataContext.hasNextStep()) {
            if (!this.dataContext.paused) {
                this.applyStep();
                this.dataContext.step += this.controls.skipSteps;
                await actionUtil.sleep(this.dataContext.stepDelay);
                if (!singleStep)
                    this.stepForward();
            }
        }
    }

    generateCompartments() {
        this.sceneManager.generateCompartments(this.controls.showIndices);
    }

    generateFluxArrows() {
        let data = this.dataContext;
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
            data.arrowPoints[0] = null;
            data.arrowPoints[1] = null;
            for (let j = 0; j < data.compartments.length; j++) {
                const element = data.compartments[j].labelText.toLowerCase().trim();
                if (element === data.fluxOriginLabels[i].toLowerCase().trim()) {
                    data.arrowPoints[0] = j;
                    if (data.arrowPoints[1] !== null) {
                        this.sceneManager.addArrow();
                        break;
                    }
                    continue;
                }
                if (element === data.fluxDestinationLabels[i].toLowerCase().trim()) {
                    data.arrowPoints[1] = j;
                    if (data.arrowPoints[0] !== null) {
                        this.sceneManager.addArrow();
                        break;
                    }
                    continue;
                }
            }
        }
    }
}

export default Controller;