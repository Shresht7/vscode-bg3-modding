// Library
import * as vscode from 'vscode';

// Helpers
import { bg3 } from "../helpers";

// Hover Provider for the version number in `meta.lsx` file
export default vscode.languages.registerHoverProvider(['xml'], {
    provideHover(document, position, token) {

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

    },
});
