// Type Definitions
import type { VersionKind } from "../../types";

/** A class to represent the BG3 Version numbers */
export class Version {

    /** Major Number */
    private major: number = 1;
    /** Minor Number */
    private minor: number = 0;
    /** Revision Number */
    private revision: number = 0;
    /** Build Number */
    private build: number = 0;

    /** Parse the Version number */
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

    /**
     * Bumps the version number according to the given version kind
     * @param kind The version kind
     * @returns self
     */
    bump(kind: VersionKind): Version {
        switch (kind) {
            case "major":
                this.major++;
                this.minor = 0;
                this.revision = 0;
                this.build = 0;
                break;
            case "minor":
                this.minor++;
                this.revision = 0;
                this.build = 0;
                break;
            case "revision":
                this.revision++;
                this.build = 0;
                break;
            case "build":
            default:
                this.build++;
        }
        return this;
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
