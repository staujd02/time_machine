interface LabelDataStrut {
    fluxDestinationLabels: string[]
    fluxOriginLabels: string[]
}

interface FluxDescription {
    origin: string
    destination: string
}

class Digest {

    private data: LabelDataStrut;
    private digest: [FluxDescription[], FluxDescription[], FluxDescription[]]

    constructor(data: LabelDataStrut) {
       this.data = data;
       this.digest = [[],[],[]]
    }

    hasMissing = (): boolean => this.has(0);
    hasUnmapped = (): boolean => this.has(1);
    hasDuplicates = (): boolean => this.has(2);
    has = (i: number): boolean => this.digest[i].length > 0

    appendToMissingDigest = (i: number) => this.appendToDigest(0, i);
    appendToUnmappedDigest = (i: number) => this.appendToDigest(1, i);
    appendToDuplicateDigest = (i: number) => this.appendToDigest(2, i);
    appendToDigest = (digestIndex: number, i: number) => {
        this.digest[digestIndex].push({
            origin: this.data.fluxOriginLabels[i],
            destination: this.data.fluxDestinationLabels[i]
        });
    }

    enumerateMissingDigest = (): string => this.enumerateDigest(0);
    enumerateUnmappedDigest = (): string => this.enumerateDigest(1);
    enumerateDuplicateDigest = (i: number) => this.enumerateDigest(2);
    enumerateDigest = (digestIndex: number) => {
        return this.digest[digestIndex]
                .map(l => `    ${l.origin} => ${l.destination}`)
                    .toString()
                    .split(',')
                    .join('\n')
    }

}

export default Digest;