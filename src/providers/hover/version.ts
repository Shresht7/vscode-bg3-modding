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

    /** A selector that defines the documents this provider is applicable to */
    private static documentSelector = ['xml'];

    constructor() {
        super(VersionHoverProvider.documentSelector);
        this.register();
    }

    override provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Get the line that is currently being hovered over
        const line = document.lineAt(position.line);
        // Check if the line matches the version number regex
        if (!bg3.Version.lsxRegex.test(line.text)) { return; };

        // Capture the int64 version number from the line and parse as BigInt
        const capture = bg3.Version.lsxRegex.exec(line.text)?.at(1) || '0';
        const bigIntVersion = BigInt(capture);

        // Get the word that is being currently hovered over
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        // If hovering over the version number, show its string representation
        if (word === capture) {
            const version = new bg3.Version(bigIntVersion);
            return new vscode.Hover(version.toString());
        }

    }

};
