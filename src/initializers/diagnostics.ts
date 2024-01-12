// Library
import * as vscode from 'vscode';
import { XMLParser } from 'fast-xml-parser';
import { Validator } from 'jsonschema';

// Schemas
import { localizationXMLSchema } from '../library/bg3/schema';

const jsonValidator = new Validator();

// -----------
// DIAGNOSTICS
// -----------

/** Initializes the diagnostics contributions provided by the extension */
export function initializeDiagnostics(context: vscode.ExtensionContext) {
    return new LocalizationXMLDiagnostics(context);
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

class LocalizationXMLDiagnostics extends Diagnostics {

    constructor(context: vscode.ExtensionContext) {
        super("BG3XML", context);
    }

    override allowDiagnostics(document: vscode.TextDocument): boolean {
        return document
            && document.languageId === "xml"
            && document.fileName.includes("Localization");
    }

    override createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        const problems: vscode.Diagnostic[] = [];

        const text = document.getText();
        const xml = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            attributesGroupName: "_@_",
            parseAttributeValue: true,
            isArray: (tagName) => tagName === "content",
        }).parse(text);

        const results = jsonValidator.validate(xml, localizationXMLSchema);

        if (!results.valid) {
            results.errors.forEach(error => {
                const line = this.determineLineFromProperty(document, error.property);

                const range = new vscode.Range(
                    line,
                    document.lineAt(line).firstNonWhitespaceCharacterIndex,
                    line,
                    Number.MAX_VALUE
                );

                const message = error.message;

                const problem = new vscode.Diagnostic(
                    range,
                    message,
                    vscode.DiagnosticSeverity.Error
                );
                problems.push(problem);
            });
        }

        return problems;
    }

    private determineLineFromProperty(document: vscode.TextDocument, property: string): number {
        return 0; // TODO: Implement this method to determine the line from the property path
    }

}
