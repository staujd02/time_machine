import DataContext from './threejs/DataContext';

const WEB_STORAGE_KEY = "plots";

export default class LocalStorage {

    loadFromStorage(IController) {
        let plots = this.loadPlotsFromDefaultContainer();
        if(plots.length === 0){
            plots.push(this.newTemplate(IController));
            window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(plots));
        }
        return plots;
    }

    loadPlotsFromDefaultContainer(){
        let plots = JSON.parse(window.localStorage.getItem(WEB_STORAGE_KEY));
        if (!plots || plots.length) {
            plots = [];
        }
        return plots;
    }

    newTemplate(controller) {
       return {
                name: "Default Storage",
                versions: [
                    { 
                        id: 1,
                        context: new DataContext(controller)
                    }
                ]
            };
    }

}