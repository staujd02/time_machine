export default (PlotData) => {

    this.dataPoints = PlotData.dataPoints;
    this.labels = PlotData.labels;
    this.arrows = PlotData.arrows;
    this.step = PlotData.step;

    this.plot_id = PlotData.id;

    this.currentPlot = () => {
        return {
            id: this.plot_id,
            dataPoints: this.dataPoints,
            labels: this.labels,
            arrows: this.arrows,
            step: this.step
        }
    };
    this.currentPlot.bind(this);

    this.labelMode = false;
    this.onLoad = null;
    this.animationData = null; //Holds imported data. Column 1 is time info
    this.fluxData = null; //Holds imported data. Column 1 is time info

    this.injectDataPointList = json => loadPointData(json, this);
    this.injectFluxList = json => loadFluxData(json, this);

    this.loadPlot = loadPlot.bind(this);

    this.dataLoaded = function dataLoaded() {
        return this.animationData != null;
    }

    this.hasNextStep = function hasNextStep() {
        return this.dataLoaded() && this.step < this.animationData.length;
    }

    return this;

    function loadFluxData(xlsxData, instance) {
        xlsxData.splice(0, 1); //Remove label column
        instance.fluxData = xlsxData;
        if (instance.onLoad && typeof instance.onLoad === "function")
            instance.onLoad();
    }

    function loadPointData(xlsxData, instance) {
        instance.labels = xlsxData[0];
        xlsxData.splice(0, 1); //Remove label column
        instance.animationData = xlsxData;
        if (instance.onLoad && typeof instance.onLoad === "function")
            instance.onLoad();
    }

    function loadPlot(plot) {
        this.dataPoints = PlotData.dataPoints;
        this.labels = PlotData.labels;
        this.arrows = PlotData.arrows;
        this.step = PlotData.step;
        return plot;
    }

}