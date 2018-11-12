import PlotData from './threejs/PlotData';
import localforage from 'localforage';

const WEB_STORAGE_KEY = "plots";

export default class LocalStorage {

    async addNewToLocal(name){
        let object = this.newTemplate(name);
        let plots = await this.loadPlotsFromDefaultContainer();
        plots.push(object);
        await this.saveToStore(WEB_STORAGE_KEY, plots, "Failed to add a new model").catch(() => {return object}); 
        return object;
    }

    async saveToStore(key, value, failureMsg = "Failed to write to storage"){
        try {
            await localforage.setItem(key, "!" + JSON.stringify(value));
        } catch (error) {
            alert(failureMsg + String(error));
        }
    }

    async fetchFromStore(key, failureMsg = "Failed to fetch from storage"){
        try {
            let result = await localforage.getItem(key);
            if(!result)
                return null;
            return JSON.parse(result.substring(1));
        } catch (error) {
            alert(failureMsg + ": " + String(error));            
        }
    }

    //  item must have name of plot
    //  addition must be PlotData
    async updateStorage(name, addition){
        let plots = await this.loadPlotsFromDefaultContainer();
        for (const plotId in plots) {
            if (plots.hasOwnProperty(plotId) && plots[plotId].name === name) {
                const element = plots[plotId];
                let id = element.versions.length + 1;
                addition.id = name + id;
                element.versions = [this.newVersion(addition)];
            }
        }
        this.saveToStore(WEB_STORAGE_KEY, plots, "Failed to save the models");
    }

    async loadFromStorage() {
        let plots = await this.loadPlotsFromDefaultContainer();
        if(plots.length === 0){
            plots.push(this.newTemplate());
            this.saveToStore(WEB_STORAGE_KEY, plots, "Failed to save the models");
        }
        return plots;
    }

    async loadPlotsFromDefaultContainer(){
        let plots = await this.fetchFromStore(WEB_STORAGE_KEY, "Failed to Access Memory").catch();
        if (!plots || !plots.length) {
            plots = [];
        }
        return plots;
    }
    
    async writeToLocalStorage(plots){
        if (!plots || !plots.length) {
            plots = [];
        }
        await this.saveToStore(WEB_STORAGE_KEY, plots);
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