// Library
import * as vscode from 'vscode';
import { bg3 } from '../../library';
import { HoverProvider } from './_base';

// ----------------------
// VERSION HOVER PROVIDER
// ----------------------

/**
 * Shows the string representation of the version number
 * when hovering over the int64 version number in the `meta.lsx` file 
 */
export class VersionHoverProvider extends HoverProvider {

    /** Regular expression to match the version line in `meta.lsx` */
    public static readonly versionRegex = /<attribute\s+id="Version64"\s+type="int64"\s+value="(\d+)"\/>/;

    /** A selector that defines the documents this provider is applicable to */
    private static readonly documentSelector = ['xml'];

    constructor() {
        super(VersionHoverProvider.documentSelector);
        this.register();
    }

    // PROVIDE HOVER
    // -------------

    override provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Get the line that is currently being hovered over
        const line = document.lineAt(position.line);

        // Capture the int64 version number from the line and parse as BigInt
        const capture = this.execRegex(line.text);
        if (!capture) { return; }
        const bigIntVersion = BigInt(capture);

        // Get the word that is being currently hovered over
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        // If hovering over the version number, show its string representation
        if (word === capture) {
            const version = this.transformVersion(bigIntVersion);
            return new vscode.Hover(version);
        }

    }

    // HELPERS
    // -------

    /** Transform version number from BigInt representation (e.g. ) to a string representation (e.g. 1.0.0.0) */
    private transformVersion(bigIntVersion: bigint): string {
        return new bg3.Version(bigIntVersion).toString();
    }

    /** Perform the regex operation and capture the version64 number */
    private execRegex(line: string): string | undefined {
        // Check if the line matches the version regex
        if (!VersionHoverProvider.versionRegex.test(line)) { return; };
        // Capture version64 from the line
        return VersionHoverProvider.versionRegex.exec(line)?.at(1);
    }

};
