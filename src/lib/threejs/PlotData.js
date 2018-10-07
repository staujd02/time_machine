export class PlotData {
    constructor(id = "untracked") {
        this.id = id;
        this.dataPoints = [];
        this.labels = [];
        this.arrows = [];
        this.step = 0;
        this.fluxMax = 1;
        this.valueMax = 1;
        this.stepDelay = 300;
        this.color = [70, 156, 150, 1];
        this.skipSteps = 1;
    }
}

export default PlotData;