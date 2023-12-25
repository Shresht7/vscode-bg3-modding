// Library
import * as vscode from 'vscode';

// Helpers
import { bg3 } from "../helpers";

/** Regex to match version number line in the `meta.lsx` file */
const regex = /<attribute\s+id="Version64"\s+type="int64"\s+value="(\d+)"\/>/;

export default vscode.languages.registerHoverProvider(['xml'], {
    provideHover(document, position, token) {
        const line = document.lineAt(position.line);
        if (!regex.test(line.text)) { return; };

        const capture = regex.exec(line.text)?.at(1) || '0';
        const bigIntVersion = BigInt(capture);

        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        if (word === capture) {
            const version = new bg3.Version(bigIntVersion);
            return new vscode.Hover(version.toString());
        }
    },
});
