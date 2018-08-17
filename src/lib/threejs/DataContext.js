export default (PlotData) => {

    this.animationData = PlotData.animationData; //Holds imported data. Column 1 is time info
    this.fluxData = PlotData.fluxData; //Holds imported data. Column 1 is time info
    this.dataPoints = PlotData.dataPoints;
    this.labels = PlotData.labels;
    this.arrows = PlotData.arrows;
    this.step = PlotData.step;

    this.currentPlot = PlotData;

    this.labelMode = false;
    this.onLoad = null;

    this.injectDataPointList = json => loadPointData(json, this);
    this.injectFluxList = json => loadFluxData(json, this);

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

}