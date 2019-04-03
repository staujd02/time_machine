import * as dat from 'dat.gui';

class Interface {

    constructor(controller) {
        this.gui = new dat.GUI({
            autoPlace: false
        });
        createHTMLElement(this.gui);
        createMenu(this.gui, controller);
        this.updateDisplay = this.gui.updateDisplay;
    }

    createHTMLElement(gui) {
        document.getElementById('datGuiAnchor').appendChild(gui.domElement);
        gui.domElement.id = 'datGuiAnchor';
    }

    createMenu(gui, controller) {
        gui.add(controller.controls, 'seekHelp').name("Help");
        buildAnimationFolder(gui.addFolder("Animation"), controller);
        buildEditingFolder(gui.addFolder("Model Editing"), controller);
        buildInterpretationFolder(gui.addFolder("Interpretation"), controller);
    }

    buildAnimationFolder(folder, controller) {
        folder.add(controller.controls, 'singleStep').name("Step - -- -- -| \u21E5");
        folder.add(controller.controls, 'startStepping').name("Start - -- -- -| \u25B6");
        folder.add(controller.controls, 'pauseAnimation').name("Pause - -- -| \u23F8");
        folder.add(controller.controls, 'resetAnimation').name("Reset - --- -| \u21BB");
        folder.add(controller.controls, 'stepDelay').name("Delay (in ms)")
            .min(0)
            .max(500)
            .step(10)
            .onChange(controller.stepDelayCallback);
        folder.add(controller.controls, 'skipSteps').name("Step Size")
            .onChange(controller.skipStepsCallback);
        return folder;
    }

    buildEditingFolder(editFolder, controller) {
        editFolder.add(controller.controls, 'generateCompartments').name("Generate Comps.");
        editFolder.add(controller.controls, 'generateFluxArrows').name("Generate Flux.");
        editFolder.add(controller.controls, 'editMode').name("Edit Mode")
            .onChange(controller.editModeCallback);
        editFolder.add(controller.controls, 'labelMode').name("Import Labels")
            .onChange(controller.labelModeCallback);
        editFolder.add(controller.controls, 'showIndices').name("Show Indices")
            .onChange(controller.showIndicesCallback);
        editFolder.add(controller.controls, 'compIndex').name("Data Index")
            .listen()
            .onFinishChange(controller.compIndexCallback);
        editFolder.add(controller.controls, 'label').name("Comp. Label")
            .listen()
            .onFinishChange(controller.labelCallback);
        editFolder.add(controller.controls, 'addPoint').name("Add Compartment");
        editFolder.add(controller.controls, 'addArrow').name("Add Arrow");
        editFolder.add(controller.controls, 'deletePoint').name("Delete Compartment");
        editFolder.add(controls, 'size').name("Size")
            .min(10)
            .max(100)
            .step(1)
            .onChange(controller.sizeCallback);
        return editFolder;
    }

    buildInterpretationFolder(folder, controller) {
        folder.add(controller.controls, 'valueMax').name("Comp. Maximum")
            .onChange(controller.valueMaxCallback);
        folder.add(controller.controls, 'fluxMax').name("Flux Maximum")
            .onChange(controller.fluxMaxCallback);
        folder.addColor(controller.controls, 'color').name("50% Max Color")
            .onChange(controller.colorCallback);
        return folder;
    }
}

export default Interface;