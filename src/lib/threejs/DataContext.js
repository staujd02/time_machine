export default (PlotData) => {

    this.dataPoints = PlotData.dataPoints;
    this.labels = PlotData.labels;
    this.arrows = PlotData.arrows;
    this.step = PlotData.step;

    this.callbacks = [];

    this.plot_id = PlotData.id;

    this.callObservers = () => {
        this.callbacks.forEach(call => {
           call(); 
        });
    };
    this.registerCallback = (call) => {
        this.callbacks.push(call);
    };
    this.currentPlot = (plot = null) => {
        if(plot){
            return this.loadPlot(plot.versions[plot.versions.length - 1].plot);
        } else{
            return {
                id: this.plot_id,
                dataPoints: this.dataPoints,
                labels: this.labels,
                arrows: this.arrows,
                step: this.step
            }
        }
    };

    this.loadPlot = (plot) => {
        this.plot_id = plot.id;
        this.dataPoints = plot.dataPoints;
        this.labels = plot.labels;
        this.arrows = plot.arrows;
        this.step = plot.step;
        this.callObservers();
        return plot;
    };
    this.labelMode = false;
    this.onLoad = null;
    this.animationData = null; //Holds imported data. Column 1 is time info
    this.fluxData = null; //Holds imported data. Column 1 is time info

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