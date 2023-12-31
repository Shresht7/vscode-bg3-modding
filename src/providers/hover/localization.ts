// Library
import * as vscode from 'vscode';
import { bg3 } from '../../library';

// ---------------------------
// LOCALIZATION HOVER PROVIDER
// ---------------------------

class _LocalizationHoverProvider implements vscode.HoverProvider {

    // 55e8dd17-b5c8-4d34-ac23-d8616a2c1925
    private static handleRegex = /h[\da-fA-F]{8}g[\da-fA-F]{4}g[\da-fA-F]{4}g[\da-fA-F]{4}g[\da-fA-F]{12}/;

    constructor() {

    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Get the word that is currently being hovered over
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        if (_LocalizationHoverProvider.handleRegex.test(word)) {
            return new vscode.Hover("HANDLE");
        }

        return;
    }
}

export const LocalizationHoverProvider = new _LocalizationHoverProvider();
