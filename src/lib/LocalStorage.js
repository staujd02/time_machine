import PlotData from './threejs/PlotData';

const WEB_STORAGE_KEY = "plots";

export default class LocalStorage {

    addNewToLocal(name){
        let object = this.newTemplate(name);
        let plots = this.loadPlotsFromDefaultContainer();
        plots.push(object);
        window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(plots));
    }

    loadFromStorage() {
        let plots = this.loadPlotsFromDefaultContainer();
        if(plots.length === 0){
            plots.push(this.newTemplate());
            window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(plots));
        }
        return plots;
    }

    loadPlotsFromDefaultContainer(){
        let plots = JSON.parse(window.localStorage.getItem(WEB_STORAGE_KEY));
        if (!plots || !plots.length) {
            plots = [];
        }
        return plots;
    }

    newTemplate(name = "Default Storage") {
       return {
                name: name,
                versions: [
                    { 
                        id: 1,
                        plot: new PlotData()
                    }
                ]
            };
    }

}