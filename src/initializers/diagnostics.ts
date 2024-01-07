// Library
import * as vscode from 'vscode';

// -----------
// DIAGNOSTICS
// -----------

/** Initializes the diagnostics contributions provided by the extension */
export function initializeDiagnostics(context: vscode.ExtensionContext) {
    return new Diagnostics("BG3XML", context);
}

// XML DIAGNOSTICS
// ---------------

class Diagnostics {

    /** The diagnostics collection */
    private diagnostics: vscode.DiagnosticCollection;

    constructor(
        /** The name of the diagnostics collection */
        private name: string,
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
    updateDiagnostics(document: vscode.TextDocument) {
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
     * Determine whether diagnostics should be allowed for the given document
     * @param document The document to check
     * @returns Whether diagnostics should be allowed for the given document
     */
    private allowDiagnostics(document: vscode.TextDocument): boolean {
        return true;
    }

    /**
     * Create the diagnostics for the given document
     * @param document The document to create diagnostics for
     * @returns The diagnostics for the given document
     */
    private createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        return [{
            code: '',
            message: 'This is a test',
            range: new vscode.Range(0, 0, 0, 0),
            severity: vscode.DiagnosticSeverity.Error,
            source: this.name
        }];
    }

}
