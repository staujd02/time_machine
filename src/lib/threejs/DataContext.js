class DataContext {

    constructor(plotData) {
        this.plot_id = plotData.id;
        this.callbacks = [];
        this.labelMode = false;
        this.onLoad = null;
        this.animationData = null;
        this.fluxData = null;

        Object.assign(this, plotData);

        this.callObservers = this.callObservers.bind(this);
        this.registerCallback = this.registerCallback.bind(this);
        this.currentPlot = this.currentPlot.bind(this);
        this.currentPlotDetails = this.currentPlotDetails.bind(this);
        this.loadPlot = this.loadPlot.bind(this);
        this.injectDataPointList = this.loadPointData.bind(this);
        this.injectFluxList = this.loadFluxData.bind(this);
        this.dataLoaded = this.dataLoaded.bind(this);
        this.hasNextStep = this.hasNextStep.bind(this);
    }

    dataLoaded() {
        return this.animationData != null;
    }

    hasNextStep() {
        return this.dataLoaded() && this.step < this.animationData.length;
    }

    registerCallback(call) {
        this.callbacks.push(call);
    }

    currentPlot(plot = null) {
        if (plot) {
            return this.loadPlot(plot.versions[plot.versions.length - 1].plot);
        } else {
            return this.currentPlotDetails();
        }
    }

    currentPlotDetails() {
        return {
            id: this.plot_id,
            dataPoints: this.dataPoints,
            labels: this.labels,
            arrows: this.arrows,
            step: this.step,
            valueMax: this.valueMax,
            fluxMax: this.fluxMax,
            stepDelay: this.stepDelay,
            color: this.color,
            skipSteps: this.skipSteps,
            radius: this.radius
        };
    }

    callObservers() {
        this.callbacks.forEach(call => {
            call();
        });
    }

    loadFluxData(xlsxData) {
        if (xlsxData.length > 1 && isNaN(xlsxData[1][1])) {
            this.fluxOriginLabels = xlsxData[0];
            this.fluxDestinationLabels = xlsxData[1];
            this.fluxOriginLabels.splice(0, 1);
            this.fluxDestinationLabels.splice(0, 1);
            xlsxData.splice(0, 1); //Remove extra label column
        }
        xlsxData.splice(0, 1); //Remove label column
        this.fluxData = xlsxData;
        if (this.onLoad && typeof this.onLoad === "function")
            this.onLoad();
    }

    loadPlot(plot) {
        Object.assign(this, plot);
        this.plot_id = plot.id;
        this.callObservers();
        return plot;
    }

    loadPointData(xlsxData) {
        this.labels = xlsxData[0];
        xlsxData.splice(0, 1); //Remove label column
        this.animationData = xlsxData;
        if (this.onLoad && typeof this.onLoad === "function")
            this.onLoad();
    }
}

export default DataContext;