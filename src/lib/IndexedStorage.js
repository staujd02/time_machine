import PlotData from './threejs/PlotData';

const WEB_STORAGE_KEY = "plots";
        
export default class LocalStorage {

    constructor(){
        // setup database like schema changes etc.
    }
    
    addNewToLocal(modelName){
        // Add a new model container to the database
    }

    loadFromStorage(){

        // Return the model list in local storage
        // if none exists, return a new template and save that template to the database

    }

    loadModelsFromDefaultContainer(){
        // Return a list of all models or at least an empty array
    }

    writeToLocalStorage(models){
        // Verify it is an array
        // Write all models to the storage

    }

    updateStorage(modelName, updatedModel){
        // write the updated model over the previous model of the same name
    }

}