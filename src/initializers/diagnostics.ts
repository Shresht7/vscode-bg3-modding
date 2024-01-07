// Library
import * as vscode from 'vscode';

// -----------
// DIAGNOSTICS
// -----------

/** Initializes the diagnostics contributions provided by the extension */
export function initializeDiagnostics(context: vscode.ExtensionContext) {
    return new ModSettingsLsxDiagnostics(context);
}

// XML DIAGNOSTICS
// ---------------

abstract class Diagnostics {

    /** The diagnostics collection */
    private diagnostics: vscode.DiagnosticCollection;

    constructor(
        /** The name of the diagnostics collection */
        protected name: string,
        context: vscode.ExtensionContext,
    ) {
        this.diagnostics = vscode.languages.createDiagnosticCollection(this.name);

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
     * Update the diagnostics for the given document
     * @param document The document to update diagnostics for
     */
    private updateDiagnostics(document: vscode.TextDocument) {
        if (document && this.allowDiagnostics(document)) {
            const diagnostics: vscode.Diagnostic[] = [];

            const problems = this.createProblems(document);

            diagnostics.push(...problems);
            this.diagnostics.set(document.uri, diagnostics);
        } else {
            this.diagnostics.clear();
        }
    }

    /**
     * Whether or not diagnostics should be created for the given document
     * @param document The document to check
     * @returns Whether or not diagnostics should be created for the given document
     */
    protected allowDiagnostics(document: vscode.TextDocument): boolean {
        return true;
    }

    /**
     * Create the diagnostics for the given document
     * @param document The document to create diagnostics for
     * @returns The diagnostics for the given document
     */
    protected createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        return [];
    }

}

class ModSettingsLsxDiagnostics extends Diagnostics {

    constructor(context: vscode.ExtensionContext) {
        super("BG3XML", context);
    }

    override allowDiagnostics(document: vscode.TextDocument): boolean {
        return document.languageId === "xml" && document.fileName.endsWith("modsettings.lsx");
    }

    override createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        const problems: vscode.Diagnostic[] = [];
        return problems;
    }

}
