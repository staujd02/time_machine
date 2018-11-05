import PlotData from './threejs/PlotData';

const WEB_STORAGE_KEY = "plots";

export default class LocalStorage {

    addNewToLocal(name){
        let object = this.newTemplate(name);
        let models = this.loadModelsFromDefaultContainer();
        models.push(object);
        window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(models));
        return object;
    }

    //  item must have name of plot
    //  addition must be PlotData
    updateStorage(name, addition){
        let models = this.loadModelsFromDefaultContainer();
        for (const plotId in models) {
            if (models.hasOwnProperty(plotId) && models[plotId].name === name) {
                const element = models[plotId];
                let id = element.versions.length + 1;
                addition.id = name + id;
                element.versions.push(this.newVersion(addition));
            }
        }
        window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(models));
    }

    loadFromStorage() {
        let models = this.loadModelsFromDefaultContainer();
        if(models.length === 0){
            models.push(this.newTemplate());
            window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(models));
        }
        return models;
    }

    loadModelsFromDefaultContainer(){
        let models = JSON.parse(window.localStorage.getItem(WEB_STORAGE_KEY));
        if (!models || !models.length) {
            models = [];
        }
        return models;
    }
    
    writeToLocalStorage(models){
        if (!models || !models.length) {
            models = [];
        }
        let data = JSON.stringify(models);
        window.localStorage.setItem(WEB_STORAGE_KEY, data);
    }

    newTemplate(name = "Default Storage") {
       return {
                name: name,
                versions: [this.newVersion(new PlotData(name + "." + 1))]
            };
    }

    newVersion(plot){
        return {
            plot: plot
        }
    }

}