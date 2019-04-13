export default class ActionUtilities  {

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      
}