export default (IController) => {

    this.animationData = null; //Holds imported data. Column 1 is time info
    this.dataPoints = [];
    this.labels = [];
    this.arrows = [];
    this.labelMode = false;
    this.step = 0; 

    IController.injectDataPointList = json => loadData(json, this);
    IController.getData = () => {
        let data = [];
        data.push(this.animationData);
        data.push(this.dataPoints);
        return data;
    }

    this.dataLoaded = function dataLoaded() {
        return this.animationData != null;
    }

    this.hasNextStep = function hasNextStep() {
        return this.dataLoaded() && this.step < this.animationData.length;
    }

    return this;

    function loadData(xlsxData, instance) {
        instance.labels = xlsxData[0];
        xlsxData.splice(0, 1);//Remove label column
        instance.animationData = xlsxData;
        IController.onLoad();
    }

}