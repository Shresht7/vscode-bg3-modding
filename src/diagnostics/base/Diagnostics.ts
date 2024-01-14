// Library
import * as vscode from 'vscode';

// Helpers
import { xml } from '../../helpers';

// -----------
// DIAGNOSTICS
// -----------

/**
 * An abstract class to manage diagnostics in vscode
 * @member {@linkcode diagnostics}: {@linkcode vscode.DiagnosticCollection}
 * @abstract
 */
export abstract class Diagnostics {

    /** @see {@link vscode.DiagnosticCollection} */
    protected diagnostics: vscode.DiagnosticCollection;

    /**
     * @param name - The name of the {@linkcode diagnostics} collection
     * @returns A new instance of the {@linkcode Diagnostics} class
     */
    constructor(protected name: string) {
        // Create the diagnostics collection
        this.diagnostics = vscode.languages.createDiagnosticCollection(this.name);
    }

    /**
     * Initializes the {@linkcode diagnostics} collection and subscribes to events.
     * This happens after the object has been created using the constructor, so that
     * all the properties have been properly initialized before they are used.
     * @param context The extension context ({@linkcode vscode.ExtensionContext})
     */
    initialize(context: vscode.ExtensionContext) {
        // Update diagnostics for the active editor
        if (vscode.window.activeTextEditor) {
            this.updateDiagnostics(vscode.window.activeTextEditor.document);
        }

        // Subscribe to events
        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (!editor) { return; }
                this.updateDiagnostics(editor.document);
            }),

            vscode.workspace.onDidChangeTextDocument(event => {
                this.updateDiagnostics(event.document);
            }),

            vscode.workspace.onDidCloseTextDocument(document => {
                this.diagnostics.delete(document.uri);
            })
        );
    }

    /**
     * Updates the {@link diagnostics} for the given {@link vscode.TextDocument | text document}
     * 
     * If diagnostics for the given {@link vscode.TextDocument | text document} are {@link shouldAllowDiagnostics | allowed},
     * then {@link diagnostics | diagnostics collection} is updated with the {@link createProblems | problems}. Otherwise,
     * the {@link diagnostics | diagnostics collection} is cleared. 
     * 
     * @param document The {@link vscode.TextDocument | text document} to update diagnostics for. (see {@linkcode vscode.TextDocument})
     */
    private updateDiagnostics(document: vscode.TextDocument) {
        if (document && this.shouldAllowDiagnostics(document)) {
            const diagnostics: vscode.Diagnostic[] = this.createProblems(document);
            this.diagnostics.set(document.uri, diagnostics);
        } else {
            this.diagnostics.clear();
        }
    }

    /**
     * Determines whether {@link diagnostics} are allowed for the given {@link vscode.TextDocument | text document}
     * @param document The {@link vscode.TextDocument | text document} to check ({@linkcode vscode.TextDocument})
     * @returns `true` if {@link diagnostics} are allowed for the given {@link vscode.TextDocument | text document}, `false` otherwise
     * @private
     */
    protected abstract shouldAllowDiagnostics(document: vscode.TextDocument): boolean;


    /**
     * Creates the {@link vscode.Diagnostic | diagnostics} for the given {@link vscode.TextDocument | text document}
     * @param document The {@link vscode.TextDocument | text document} to create {@link vscode.Diagnostic | diagnostics} for. (see {@linkcode vscode.TextDocument})
     * @returns The collection of {@link vscode.Diagnostic | diagnostics} for the given {@link vscode.TextDocument | text document}
     * @see {@link vscode.TextDocument}
     * @see {@link vscode.Diagnostic}
     */
    protected abstract createProblems(document: vscode.TextDocument): vscode.Diagnostic[];

    /**
     * Determines the line number of the {@linkcode path} in the {@linkcode document}
     * @param document The {@link vscode.TextDocument | text document} (see {@linkcode vscode.TextDocument})
     * @param path The path to the property represented as an array (e.g. `["root", "property", 1, "value"]`)
     * @returns The line number corresponding to the {@linkcode path} in the {@linkcode document}
     */
    protected determineLineFromPath(document: vscode.TextDocument, path: (string | number)[]): number {

        /**
         * The line of the {@linkcode document} that the {@linkcode path} corresponds to
         * 
         * We start at `0` (the first line of the document)
         * and we adjust the line number as we iterate through the document lines and find the appropriate text
         */
        let line = 0;

        /**
         * The current {@link part} of the property {@linkcode path}
         * 
         * We start with the first part of the {@linkcode path} and iterate through the lines of the document
         * until we find the line that the {@linkcode part} corresponds to. Then we move on to the next part
         * of the {@linkcode path} and so on.
         * 
         * This can be a string (e.g. `"root"`) or a number (e.g. `1`) if the part is in an array.
         * If the part is `undefined`, it means we are done traversing the {@linkcode path}.
         */
        let part = path.shift();
        let parentPart: string | number | undefined;

        // Iterate through the lines of the document to find the line that the path corresponds to
        for (let i = 0; i < document.lineCount; i++) {

            // If the part is `undefined` or the `attributesGroupName`, then we break out of the loop and return the latest line
            if (part === undefined || part === xml.attributesGroupName) { break; }

            /** The text corresponding to the current line index in the {@linkcode document} */
            const text = document.lineAt(i).text;

            // If the part is an array...
            if (typeof part === "number") {
                if (part > 0 && text.includes("<" + parentPart)) {
                    // ...continue until we find the correct index
                    part--;
                    continue;
                } else {
                    // .. then we select the next occurrence of the part
                    line = i - 1;
                    parentPart = part;
                    part = path.shift();
                    continue;
                }
            }

            // If the text includes the part, then we set the line to the current line and move on to the next part
            if (text.includes("<" + part)) {
                line = i;
                parentPart = part;
                part = path.shift();
            }

        }

        // Return the line number corresponding to the given path
        return line;
    }

}
