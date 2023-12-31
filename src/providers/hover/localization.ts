// Library
import * as vscode from 'vscode';
import { bg3 } from '../../library';

// ---------------------------
// LOCALIZATION HOVER PROVIDER
// ---------------------------

class _LocalizationHoverProvider implements vscode.HoverProvider {

    /** Regular expression to match localization handles
     * @example h55e8dd17gb5c8g4d34gac23gd8616a2c1925
    */
    private static handleRegex = /h[\da-fA-F]{8}g[\da-fA-F]{4}g[\da-fA-F]{4}g[\da-fA-F]{4}g[\da-fA-F]{12}/;

    constructor() {

    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Get the word that is currently being hovered over
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        // Return early if the word is not a localization handle
        if (_LocalizationHoverProvider.handleRegex.test(word)) { return; }

        // Return the content to be shown on hover
        return new vscode.Hover("HANDLE");

    }
}

export const LocalizationHoverProvider = new _LocalizationHoverProvider();
