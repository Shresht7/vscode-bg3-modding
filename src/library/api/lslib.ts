// ----------------------
// LSLIB (DIVINE.EXE) API
// ----------------------

/**
 * Games supported by the lslib cli (`divine.exe`)
 * @see https://github.com/Norbyte/lslib/blob/6ba2a1cb203b7a523d600d7f10b2fb2516aa17f1/Divine/CLI/CommandLineArguments.cs#L28
 */
type LSLIBSupportedGame = "dos" | "dosee" | "dos2" | "dos2de" | "bg3";

/**
 * Options for instantiating the {@link LSLIB} class
 */
type ConstructorOptions = {
    /** Path to the lslib cli (`divine.exe`) executable */
    path?: string,
    /** The {@link LSLIBSupportedGame | game} to be used by the lslib cli (`divine.exe`). @see {@link LSLIBSupportedGame} */
    game?: LSLIBSupportedGame
};

/**
 * A class representing the lslib cli (`divine.exe`) with methods for creating command lines
 * @see https://github.com/Norbyte/lslib
 */
export class LSLIB {

    /**
     * Path to the lslib cli (`divine.exe`) executable. By default, assumes `divine.exe` is in the PATH
     */
    private readonly path: string = "divine.exe";

    /**
     * The {@link LSLIBSupportedGame | game} to be used by the lslib cli (`divine.exe`). By default, assumes _Baldur's Gate 3_ (`bg3`)
     * @see {@link LSLIBSupportedGame}
     */
    private readonly game: LSLIBSupportedGame = "bg3";


    /**
     * Creates a new instance of the LSLIB (`divine.exe`) class
     * @param opts Options for instantiating the LSLIB (`divine.exe`)
     * @see {@link ConstructorOptions}
     */
    constructor(opts?: ConstructorOptions) {
        this.path = opts?.path ?? this.path;
        this.game = opts?.game ?? this.game;
    }

    /**
     * Creates a string representing the command line to be executed
     * @param args Arguments to be passed to the lslib cli (`divine.exe`) as a string array
     * @returns A string representing the command line to be executed
     */
    private createCmdLine(args: string[]): string {
        return [
            this.path,
            ...args
        ].join(" ");
    }

    /** `divine.exe --help` */
    help(): string {
        return this.createCmdLine(["--help"]);
    }

    /** `divine.exe --game [game] --action create-package --source [source] --destination [destination]` */
    createPackage(source: string, destination: string): string {
        return this.createCmdLine([
            "--game",
            this.game,
            "--action",
            "create-package",
            "--source",
            source,
            "--destination",
            destination
        ]);
    }

    /** `divine.exe --game [game] --action extract-package --source [source] --destination [destination]` */
    convertLoca(source: string, destination: string): string {
        return this.createCmdLine([
            "--game",
            this.game,
            "--action",
            "convert-loca",
            "--source",
            source,
            "--destination",
            destination
        ]);
    }

}

export const divine = new LSLIB();
