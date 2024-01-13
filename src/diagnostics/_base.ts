// Library
import * as vscode from 'vscode';
import { XMLValidator } from 'fast-xml-parser';

// -----------
// DIAGNOSTICS
// -----------

export abstract class Diagnostics {

    /** The diagnostics collection */
    protected diagnostics: vscode.DiagnosticCollection;

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
    protected updateDiagnostics(document: vscode.TextDocument) {
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
    protected abstract allowDiagnostics(document: vscode.TextDocument): boolean;

    /**
     * Create the diagnostics for the given document
     * @param document The document to create diagnostics for
     * @returns The diagnostics for the given document
     */
    protected abstract createProblems(document: vscode.TextDocument): vscode.Diagnostic[];

    /**
 * Determine the line of the document that the property corresponds to
 * @param document The document to check
 * @param path The path of the property (e.g. ["root", "child", 0, "grandchild"])
 * @returns The line of the document that the property corresponds to
 */
    protected determineLineFromPath(document: vscode.TextDocument, path: (string | number)[]): number {
        /** The line of the document that the property corresponds to */
        let line = 0;

        // Iterate through the lines of the document to find the line that the property corresponds to
        /** The current part of the property path */
        let part = path.shift();
        for (let i = 0; i < document.lineCount; i++) {
            // If the part is undefined or "_@_", then we break out of the loop and return the latest line
            if (part === undefined || part === "_@_") { break; }

            /** The text corresponding to the current line */
            const text = document.lineAt(i).text;

            // If the part is an array...
            if (typeof part === "number") {
                part--;
                if (part > 0) {
                    // ...continue until we find the correct index
                    continue;
                }
                // .. then we select the next occurrence of the part
            }

            // If the text includes the part, then we set the line to the current line and move on to the next part
            if (text.includes("<" + part)) {
                line = i;
                part = path.shift();
            }
        }

        // Return the line
        return line;
    }

}

// ---------------
// XML DIAGNOSTICS
// ---------------

export abstract class XMLDiagnostics extends Diagnostics {

    constructor(
        /** The name of the diagnostics collection */
        protected name: string,
        context: vscode.ExtensionContext,
    ) {
        super(name, context);
    }

    /**
     * Create the diagnostics for the given document using the XML Validator
     * @param document The document to create diagnostics for
     * @returns The diagnostics for the given document
     */
    private validateXML(document: vscode.TextDocument): vscode.Diagnostic | undefined {
        const response = XMLValidator.validate(document.getText());
        if (response !== true) {
            const { code, col, line, msg } = response.err;
            const range = new vscode.Range(line - 1, col, line - 1, Number.MAX_VALUE);
            const diagnostic: vscode.Diagnostic = {
                code,
                message: msg,
                range,
                severity: vscode.DiagnosticSeverity.Error,
                source: this.name,
            };
            return diagnostic;
        }
    }

    protected override updateDiagnostics(document: vscode.TextDocument) {
        if (document && this.allowDiagnostics(document)) {
            const diagnostics: vscode.Diagnostic[] = [];

            const xmlValidationProblem = this.validateXML(document);
            if (xmlValidationProblem) {
                diagnostics.push(xmlValidationProblem);
            }

            const problems = this.createProblems(document);
            diagnostics.push(...problems);

            this.diagnostics.set(document.uri, diagnostics);
        } else {
            this.diagnostics.clear();
        }
    }

}
