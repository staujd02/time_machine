class keyboardHandler {

    constructor(dataContext, sceneManager) {
        this.dataContext = dataContext;
        this.sceneManager = sceneManager;
        this.keyPress = this.keyPress.bind(this);
        this.setupEventListeners(this);

    }

    setupEventListeners(handler) {
        document.addEventListener("keydown", handler.keyPress);
    }

    moveScene = (up, left) => {
        const moveAmount = 40;
        this.sceneManager.moveCamera(left * moveAmount, up * moveAmount);
        this.sceneManager.update();
    }

    zoomScene = direction =>{
        const moveAmount = 40;
        this.sceneManager.zoomCamera(direction * moveAmount);
        this.sceneManager.update();
    }

    keyPress = (event) => {
        let preventDefault = true;
        console.log(event.code);
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
            case "Minus":
            case "NumpadSubtract":
                this.zoomScene(-1);
                break;
            case "Equal":
            case "NumpadAdd":
                this.zoomScene(1);
                break;
            default:
                preventDefault = false; 
                break;
        }
        if(preventDefault)
            event.preventDefault();
    }

}

export default keyboardHandler;