// ====================
// BG3 HELPER FUNCTIONS
// ====================

/**
 * Converts a UUID to a BG3 handle
 * @param uuid The UUID to convert to a handle
 * @returns A BG3 handle (e.g. h853caddag9fb3g4690ga2cfg56bb76f8543d)
 */
export function convertToHandle(uuid: string) {
    return "h" + uuid.replaceAll('-', 'g');
}

/** A class to represent the BG3 Version numbers */
export class Version {

    /** Major Number */
    private readonly major: number = 1;
    /** Minor Number */
    private readonly minor: number = 0;
    /** Revision Number */
    private readonly revision: number = 0;
    /** Build Number */
    private readonly build: number = 0;

    /** Regular expression to match the version line in `meta.lsx` */
    public static readonly lsxRegex = /<attribute\s+id="Version64"\s+type="int64"\s+value="(\d+)"\/>/;

    /**
     * Parse the Version number
     * @param num The long Int64 Version number as specified in the `meta.lsx` file
     */
    constructor(num: bigint) {
        this.major = Number(num >> 55n);
        this.minor = Number((num >> 47n) & 0xFFn);
        this.revision = Number((num >> 31n) & 0xFFFFn);
        this.build = Number(num & 0xFFFFFFn);
    }

    /** Return the string representation of the Version number. (e.g `1.0.0.0`) */
    toString(): string {
        return `${this.major}.${this.minor}.${this.revision}.${this.build}`;
    }
}
