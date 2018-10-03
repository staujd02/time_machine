export default (PlotData) => {

    Object.assign(this, PlotData);
    this.plot_id = PlotData.id;

    this.callbacks = [];
    this.labelMode = false;
    this.onLoad = null;
    this.animationData = null;
    this.fluxData = null;

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
        Object.assign(this, plot);
        this.plot_id = plot.id;
        this.callObservers();
        return plot;
    };

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