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

    /** A map from localization handles to their associated content value */
    private references: Map<string, string> = new Map([
        ["h55e8dd17gb5c8g4d34gac23gd8616a2c1925", "First"],
        ["h1b26431cg676cg4475g9e3cg6b2d3eeaad7e", "Second"],
        ["h6bed3d75g1c4ag41b6g8991gf44db46f9f5a", "Third"],
    ]);

    constructor() { }

    /** Lookup the localization handle in the references map and returns the corresponding contents
     * @param handle The localization handle to lookup
    */
    getContent(handle: string): string | undefined {
        return this.references.get(handle);
    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Get the word that is currently being hovered over
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        // Return early if the word is not a localization handle
        if (!_LocalizationHoverProvider.handleRegex.test(word)) { return; }

        // Get content for the given localization handle
        const content = this.getContent(word);
        if (!content) { return; }

        // Return the content to be shown on hover
        return new vscode.Hover(content);

    }
}

export const LocalizationHoverProvider = new _LocalizationHoverProvider();
