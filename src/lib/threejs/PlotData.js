export class PlotData {
    constructor(id = "untracked") {
        this.id = id;
        this.dataPoints = [];
        this.labels = [];
        this.arrows = [];
        this.step = 0;
    }
}

export default PlotData;