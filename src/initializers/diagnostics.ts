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

    /**
     * Determine the line of the document that the property corresponds to
     * @param document The document to check
     * @param property The property to check. (e.g. `instance.contentList.content[2]`)
     * @returns The line of the document that the property corresponds to
     */
    private determineLineFromProperty(document: vscode.TextDocument, property: string): number {
        /** The line of the document that the property corresponds to */
        let line = 0;

        /** string[] of the parts of the property path */
        const parts = property.split(".").slice(1);

        // Iterate through the lines of the document to find the line that the property corresponds to
        /** The current part of the property path */
        let part = parts.shift();
        for (let i = 0; i < document.lineCount; i++) {
            // If the part is undefined or "_@_", then we break out of the loop and return the latest line
            if (part === undefined || part === "_@_") { break; }

            /** The text corresponding to the current line */
            const text = document.lineAt(i).text;

            // If the part is an array...
            if (/\[(\d+)\]/.test(part)) {
                const match = /\[(\d+)\]/.exec(part);
                const index = parseInt(match![1]);
                // ...continue until we find the correct index
                if (index > 0) {
                    const newIndex = index - 1;
                    part = part.replace(match![0], "[" + newIndex + "]");
                    continue;
                } else if (index === 0) {
                    // If the index is 0, then we select the next occurrence of the part
                    part = part.replace(match![0], "");
                }
            }

            // If the text includes the part, then we set the line to the current line and move on to the next part
            if (text.includes("<" + part)) {
                line = i;
                part = parts.shift();
            }
        }

        // Return the line
        return line;
    }

}
