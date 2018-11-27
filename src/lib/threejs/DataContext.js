export default (PlotData) => {

    let context = {};

    context.plot_id = PlotData.id;
    
    context.callbacks = [];
    context.labelMode = false;
    context.onLoad = null;
    context.animationData = null;
    context.fluxData = null;

    Object.assign(context, PlotData);

    context.callObservers = () => {
        context.callbacks.forEach(call => {
           call(); 
        });
    };

    context.registerCallback = (call) => {
        context.callbacks.push(call);
    };

    context.currentPlot = (plot = null) => {
        if(plot){
            return context.loadPlot(plot.versions[plot.versions.length - 1].plot);
        } else{
            return {
                id: context.plot_id,
                dataPoints: context.dataPoints,
                labels: context.labels,
                arrows: context.arrows,
                step: context.step,
                valueMax: context.valueMax,
                fluxMax: context.fluxMax,
                stepDelay: context.stepDelay,
                color: context.color,
                skipSteps: context.skipSteps
            }
        }
    };

    context.loadPlot = (plot) => {
        Object.assign(context, plot);
        context.plot_id = plot.id;
        context.callObservers();
        return plot;
    };

    context.injectDataPointList = json => loadPointData(json, context);
    context.injectFluxList = json => loadFluxData(json, context);

    context.dataLoaded = function dataLoaded() {
        return context.animationData != null;
    }

    context.hasNextStep = function hasNextStep() {
        return context.dataLoaded() && context.step < context.animationData.length;
    }

    return context;

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