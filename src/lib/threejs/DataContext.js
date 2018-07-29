export default (IController) => {

    this.animationData = null; //Holds imported data. Column 1 is time info
    this.step = 0;

    IController.injectDataPointList = json => loadData(json, this);

    this.dataLoaded = function dataLoaded() {
       return this.animationData != null; 
    }

    this.hasNextStep = function hasNextStep() {
        return this.dataLoaded() && this.step < this.animationData.length; 
    }

    return this;

    function loadData(data, instance) {
       instance.animationData = data;
       IController.onLoad(); 
    }

}