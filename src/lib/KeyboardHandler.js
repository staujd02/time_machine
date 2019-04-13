class keyboardHandler {

    constructor(dataContext, sceneManager) {
        this.dataContext = dataContext;
        this.sceneManager = sceneManager;
        this.keyPress = this.keyPress.bind(this);
        this.bindLocalFunctions(this);
        this.setupEventListeners(this);

    }

    bindLocalFunctions(handler) {
        handler.keyPress = handler.keyPress.bind(handler);
        handler.moveScene = handler.moveScene.bind(handler);
    }

    setupEventListeners(handler) {
        document.addEventListener("keydown", handler.keyPress);
    }

    moveScene(up, left) {
        const moveAmount = 40;
        this.sceneManager.moveCamera(left * moveAmount, up * moveAmount);
        this.sceneManager.update();
    }

    keyPress(event) {
        let preventDefault = true;
        switch (event.code) {
            case "ArrowUp":
                this.moveScene(-1, 0);
                break;
            case "ArrowLeft":
                this.moveScene(0, 1);
                break;
            case "ArrowRight":
                this.moveScene(0, -1);
                break;
            case "ArrowDown":
                this.moveScene(1, 0);
                break;
            default:
                preventDefault = false; 
                break;
        }
        if(preventDefault){
            event.preventDefault();
        }
    }

}

export default keyboardHandler;