import LocalStorage from './LocalStorage';
import IndexedStorage from './IndexedStorage';

export default class Storage {

    constructor() {
        if (setupDatabase()) {
            const indexed = new IndexedStorage();
            this.addNewToLocal = indexed.addNewToLocal;
            this.loadFromStorage = indexed.loadFromStorage;
            this.loadModelsFromDefaultContainer = indexed.loadModelsFromDefaultContainer;
            this.writeToLocalStorage = indexed.writeToLocalStorage;
            this.updateStorage = indexed.updateStorage;
        } else{
            const local = new LocalStorage();
            this.addNewToLocal = local.addNewToLocal;
            this.loadFromStorage = local.loadFromStorage;
            this.loadModelsFromDefaultContainer = local.loadModelsFromDefaultContainer;
            this.writeToLocalStorage = local.writeToLocalStorage;
            this.updateStorage = local.updateStorage;
        }

        return this;
    }

    setupDatabase() {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
            READ_WRITE: "readwrite"
        };
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. LocalStorage will be used instead and restricted to at most 10MB of data");
            return false;
        }

        return true;
    }
}