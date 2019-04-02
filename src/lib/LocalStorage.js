import Model from './threejs/Model';
import localforage from 'localforage';

const WEB_STORAGE_KEY = "plots";

export default class LocalStorage {

    async addNewModelToLocal(modelName){
        let model = this.newModelTemplate(modelName);
        let models = await this.loadModelsFromDefaultContainer();
        models.push(model);
        await this.saveToStore(WEB_STORAGE_KEY, models, "Failed to add a new model").catch(() => {return model}); 
        return model;
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
    //  addition must be Model
    async updateStorage(name, addition){
        let models = await this.loadModelsFromDefaultContainer();
        for (const modelId in models) {
            if (models.hasOwnProperty(modelId) && models[modelId].name === name) {
                const element = models[modelId];
                let id = element.versions.length + 1;
                addition.id = name + id;
                element.versions = [this.newModelVersion(addition)];
            }
        }
        this.saveToStore(WEB_STORAGE_KEY, models, "Failed to save the models");
    }
    
    async removeFromStorage(name){
        let models = await this.loadModelsFromDefaultContainer();
        let reducedList = [];
        for (const modelId in models) {
            if (models.hasOwnProperty(modelId)) {
                if(models[modelId].name !== name){
                    reducedList.push(models[modelId]);
                }
            }
        }
        this.saveToStore(WEB_STORAGE_KEY, reducedList, "Failed to save the models");
    }

    async loadFromStorage() {
        let models = await this.loadModelsFromDefaultContainer();
        if(models.length === 0){
            models.push(this.newModelTemplate());
            this.saveToStore(WEB_STORAGE_KEY, models, "Failed to save the models");
        }
        return models;
    }

    async loadModelsFromDefaultContainer(){
        let models = await this.fetchFromStore(WEB_STORAGE_KEY, "Failed to Access Memory").catch();
        if (!models || !models.length) {
            models = [];
        }
        return models;
    }
    
    async writeToLocalStorage(dataArray){
        if (!dataArray || !dataArray.length) {
            dataArray = [];
        }
        await this.saveToStore(WEB_STORAGE_KEY, dataArray);
    }

    newModelTemplate(name = "Default Storage") {
       return {
                name: name,
                versions: [this.newModelVersion(new Model(name + "." + 1))]
            };
    }

    newModelVersion(model){
        return {
            plot: model
        }
    }

}