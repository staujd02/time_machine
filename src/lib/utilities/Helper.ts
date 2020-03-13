class Helper {

    min<T>(arr1: Array<T>, arr2: Array<T>): number{
        if(arr1.length > arr2.length){
            this.reduce<T>(arr1, arr2);
            return arr2.length
        }
        this.reduce<T>(arr2, arr1);
        return arr1.length;
    }

    private reduce<T>(arr1: Array<T>, arr2: Array<T>){
        while (arr1.length > arr2.length)
           arr1.pop(); 
    }
}

export default new Helper();