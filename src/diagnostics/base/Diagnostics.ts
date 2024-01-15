// Library
import * as vscode from 'vscode';

// -----------
// DIAGNOSTICS
// -----------

/**
 * An abstract class to manage diagnostics in vscode
 * @member {@linkcode diagnostics}: {@linkcode vscode.DiagnosticCollection}
 * @abstract
 */
export abstract class Diagnostics {

    /**
     * This collection of diagnostics, once registered with vscode, will be displayed in the Problems panel
     * @see {@link vscode.DiagnosticCollection}
     */
    protected diagnostics: vscode.DiagnosticCollection;

    /**
     * @param name - The name of the {@linkcode diagnostics} collection
     * @returns A new instance of the {@linkcode Diagnostics} class
     */
    constructor(protected name: string) {
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
            // Update diagnostics when the active editor changes
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (!editor) { return; }
                this.updateDiagnostics(editor.document);
            }),

            // Update diagnostics when the document is changed
            vscode.workspace.onDidChangeTextDocument(event => {
                this.updateDiagnostics(event.document);
            }),

            // ~~ // Clear diagnostics when a document is closed
            // ~~ vscode.workspace.onDidCloseTextDocument(document => {
            // ~~     this.diagnostics.delete(document.uri);
            // ~~ })
        );
    }

    /**
     * Updates the {@link diagnostics} for the given {@link vscode.TextDocument | text document}
     * 
     * If diagnostics for the given {@link vscode.TextDocument | text document} are {@link shouldAllowDiagnostics | allowed},
     * then {@link diagnostics | diagnostics collection} is updated with the {@link createProblems | problems}.
     * 
     * @param document The {@link vscode.TextDocument | text document} to update diagnostics for. (see {@linkcode vscode.TextDocument})
     */
    private updateDiagnostics(document: vscode.TextDocument) {
        if (document && this.shouldAllowDiagnostics(document)) {
            const diagnostics: vscode.Diagnostic[] = this.createProblems(document);
            this.diagnostics.set(document.uri, diagnostics);
        }
    }

    /**
     * Determines whether {@link diagnostics} are allowed for the given {@link vscode.TextDocument | text document}
     * @param document The {@link vscode.TextDocument | text document} to check ({@linkcode vscode.TextDocument})
     * @returns `true` if {@link diagnostics} are allowed for the given {@link vscode.TextDocument | text document}, `false` otherwise
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

}
