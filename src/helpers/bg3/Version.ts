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

    /** Parse the Version number */
    constructor(x: bigint);
    constructor(x: string);
    constructor(x: bigint | string) {

        // Use the string constructor ...
        if (typeof x === 'string') {
            const v = x.split(".");
            this.major = parseInt(v[0]);
            this.minor = parseInt(v[1]);
            this.revision = parseInt(v[2]);
            this.build = parseInt(v[3]);
        }
        // ... else, use the bigint constructor.
        else {
            this.major = Number(x >> 55n);
            this.minor = Number((x >> 47n) & 0xFFn);
            this.revision = Number((x >> 31n) & 0xFFFFn);
            this.build = Number(x & 0xFFFFFFn);
        }

    }

    /** @returns  Int64 representation of the version number */
    toInt64(): bigint {
        const major = BigInt(this.major) << 55n;
        const minor = (BigInt(this.minor) << 47n);
        const revision = (BigInt(this.revision) << 31n);
        const build = (BigInt(this.build));
        return major + minor + revision + build;
    }

    /** @returns String representation of the Version number. (e.g `1.0.0.0`) */
    toString(): string {
        return `${this.major}.${this.minor}.${this.revision}.${this.build}`;
    }

}
