export class Model {
    constructor(id = "untracked") {
        this.id = id;
        this.compartments = [];
        this.labels = [];
        this.arrows = [];
        this.step = 0;
        this.fluxMax = 1;
        this.valueMax = 1;
        this.stepDelay = 300;
        this.radius = 40;
        this.color = [70, 156, 150, 1];
        this.skipSteps = 1;
    }
}

export default Model;