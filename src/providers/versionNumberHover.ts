// Library
import * as vscode from 'vscode';

// Helpers
import { bg3 } from "../helpers";

export default vscode.languages.registerHoverProvider(['xml'], {
    provideHover(document, position, token) {
        const line = document.lineAt(position.line);
        if (!bg3.Version.lsxRegex.test(line.text)) { return; };

        const capture = bg3.Version.lsxRegex.exec(line.text)?.at(1) || '0';
        const bigIntVersion = BigInt(capture);

        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        if (word === capture) {
            const version = new bg3.Version(bigIntVersion);
            return new vscode.Hover(version.toString());
        }
    },
});
