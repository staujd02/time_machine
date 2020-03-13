import Helper from "../lib/utilities/Helper";

describe('The helper utility', () => {

    describe('when reducing ragged array lengths', () => {

        it('can reduce an array that is too long', () => {
            let a1 =['a', 'b', 'c', 'd', 'f'];
            let a2 = ['a', 'b', 'c'];
            let result = Helper.min(a1, a2);
            expect(a1).toEqual(['a', 'b', 'c'])
            expect(a2).toEqual(['a', 'b', 'c'])
            expect(result).toEqual(3);
        });
        
        it('can reduce an array that is too short', () => {
            let a1 =['a', 'b', 'c', 'd', 'f'];
            let a2 = ['a', 'b', 'c'];
            let result = Helper.min(a2, a1);
            expect(a1).toEqual(['a', 'b', 'c'])
            expect(a2).toEqual(['a', 'b', 'c'])
            expect(result).toEqual(3);
        });
        
        it('can handle doing nothing', () => {
            let a1 =['a', 'b', 'c'];
            let a2 = ['a', 'b', 'c'];
            let result = Helper.min(a1, a2);
            expect(a1).toEqual(['a', 'b', 'c'])
            expect(a2).toEqual(['a', 'b', 'c'])
            expect(result).toEqual(3);
        });
    });
});