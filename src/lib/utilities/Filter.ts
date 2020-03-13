import Helper from './Helper';

class Filter {

    GroomInvalidPairs(set1: string[], set2: string[]): void{
        let min = Helper.min(set1, set2);
        this.weedOutBadPairs(set1, set2);
        this.weedOutBadPairs(set2, set1);
    }

    private weedOutBadPairs(arr1: string[], arr2: string[]) {
        let i;
        while ((i = this.findIndex(arr1)) > -1) {
            arr1.splice(i, 1);
            arr2.splice(i, 1);
        }
    }

    private findIndex(arr: string[]): number {
        return arr.findIndex(x => x.trim() === '');
    }

}

export default new Filter();