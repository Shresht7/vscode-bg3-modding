// Library
import * as vscode from 'vscode';
import { HoverProvider } from './_base';
import { regex } from '../../constants';

// ---------------------------
// LOCALIZATION HOVER PROVIDER
// ---------------------------

/** Provides hover information for localization handles in xml files */
export class LocalizationHoverProvider extends HoverProvider {

    /** A map from localization handles to their associated content value */
    private static references: Map<string, string> = new Map();

    /** A selector that defines the documents this provider is applicable to */
    private static readonly documentSelector: vscode.DocumentSelector = ['xml'];

    constructor() {
        super(LocalizationHoverProvider.documentSelector);
        this.register();
    }

    /** Lookup the localization handle in the references map and returns the corresponding contents
     * @param handle The localization handle to lookup
    */
    static getContent(handle: string): string | undefined {
        return this.references.get(handle);
    }

    /** Set the content value to correspond to the given localization handle
 * @param handle The localization handle you want to set the content of
 * @param content The string to associate with the localization handle
*/
    static setContent(handle: string, content: string) {
        this.references.set(handle, content);
    }

    /** Clears out any existing localization references */
    static clearContent() {
        this.references.clear();
    }

    override provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Get the word that is currently being hovered over
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        // Return early if the word is not a localization handle
        if (!regex.handle.test(word)) { return; }

        // Get content for the given localization handle
        const content = LocalizationHoverProvider.getContent(word);
        if (!content) { return; }

        // Return the content to be shown on hover
        return new vscode.Hover(content);

    }

}
