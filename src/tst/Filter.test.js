import Filter from "../lib/utilities/Filter";

describe('The Filter utility', () => {

    describe('when grooming an array', () => {
        it('can slice out invalid pairs', () => {
            let set1 = ['a', 'b', 'c', '', '', 'f', '', 'a', 'a'];
            let set2 = ['', 'b', 'c', 'd', 'e', 'f', '', 'a'];
            Filter.GroomInvalidPairs(set1, set2);
            expect(set1).toEqual(['b', 'c', 'f', 'a'])
            expect(set2).toEqual(['b', 'c', 'f', 'a'])
        });
        
        it('can slice out invalid pairs on the second array', () => {
            let set1 = ['a', 'b', 'c', '', '', 'f', '', 'a'];
            let set2 = ['', 'b', 'c', 'd', 'e', 'f', '', 'a', ''];
            Filter.GroomInvalidPairs(set1, set2);
            expect(set1).toEqual(['b', 'c', 'f', 'a'])
            expect(set2).toEqual(['b', 'c', 'f', 'a'])
        });

        it('can handle doing nothing', () => {
            let set1 = ['b', 'c', 'f', 'a'];
            let set2 = ['b', 'c', 'f', 'a'];
            Filter.GroomInvalidPairs(set1, set2);
            expect(set1).toEqual(['b', 'c', 'f', 'a'])
            expect(set2).toEqual(['b', 'c', 'f', 'a'])
        });
    });
});