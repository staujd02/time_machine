export class PlotData {
    constructor(id = "untracked") {
        this.id = id;
        this.animationData = null; //Holds imported data. Column 1 is time info
        this.fluxData = null; //Holds imported data. Column 1 is time info
        this.dataPoints = [];
        this.labels = [];
        this.arrows = [];
        this.step = 0;
    }
}

export default PlotData;