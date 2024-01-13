// Library
import * as vscode from 'vscode';
import { XMLValidator } from 'fast-xml-parser';

// Helpers
import { xml } from '../helpers';

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
     * @param context - The extension context ({@linkcode vscode.ExtensionContext})
     * @returns A new instance of the {@linkcode Diagnostics} class
     */
    constructor(protected name: string, context: vscode.ExtensionContext) {
        // Create the diagnostics collection
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
     * Updates the {@link diagnostics} for the given {@link vscode.TextDocument | text document}
     * 
     * If diagnostics for the given {@link vscode.TextDocument | text document} are {@link allowDiagnostics | allowed},
     * then {@link diagnostics | diagnostics collection} is updated with the {@link createProblems | problems}. Otherwise,
     * the {@link diagnostics | diagnostics collection} is cleared. 
     * 
     * @param document The {@link vscode.TextDocument | text document} to update diagnostics for. (see {@linkcode vscode.TextDocument})
     */
    protected updateDiagnostics(document: vscode.TextDocument) {
        if (document && this.allowDiagnostics(document)) {
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
     */
    protected abstract allowDiagnostics(document: vscode.TextDocument): boolean;


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
        /** The line of the {@linkcode document} that the {@linkcode path} corresponds to */
        let line = 0;

        // Iterate through the lines of the document to find the line that the path corresponds to
        /** The current {@link part} of the property {@linkcode path} */
        let part = path.shift();
        for (let i = 0; i < document.lineCount; i++) {
            // If the part is `undefined` or the `attributesGroupName`, then we break out of the loop and return the latest line
            if (part === undefined || part === xml.attributesGroupName) { break; }

            /** The text corresponding to the current line in the {@linkcode document} */
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

/**
 * An abstract class to manage diagnostics for xml files
 * @extends Diagnostics The base {@link Diagnostics} class
 * @abstract
 */
export abstract class XMLDiagnostics extends Diagnostics {

    /**
     * @param name - The name of the {@linkcode diagnostics} collection
     * @param context - The extension context ({@linkcode vscode.ExtensionContext})
     * @returns A new instance of the {@linkcode XMLDiagnostics} class
     */
    constructor(protected name: string, context: vscode.ExtensionContext) {
        super(name, context);
    }

    /**
     * Creates the {@link vscode.Diagnostic | diagnostics} for the given `document` using the {@link XMLValidator | XML Validator}
     * @param document The document to create diagnostics for. (see {@linkcode vscode.TextDocument})
     * @returns The {@link vscode.Diagnostic | diagnostics} for the given `document`
     */
    private validateXML(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];

        // Validate the document using the XML Validator from `fast-xml-parser`
        const response = XMLValidator.validate(document.getText());

        // If the response is not `true`, then we create a diagnostic for the error
        if (response !== true) {
            const { code, col, line, msg } = response.err; // Destructure the error response
            // Create the diagnostic object and add it to the collection
            const diagnostic: vscode.Diagnostic = {
                code,
                message: msg,
                range: new vscode.Range(line - 1, col, line - 1, Number.MAX_VALUE),
                severity: vscode.DiagnosticSeverity.Error,
                source: this.name,
            };
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }

    /**
     * Updates the {@link diagnostics| diagnostics collection} for the given document
     * 
     * If diagnostics for the given document are {@link allowDiagnostics | allowed},
     * then the diagnostics collection is updated with the {@link createProblems | problems}. Otherwise,
     * the diagnostics collection is cleared. 
     * 
     * @param document The document to update diagnostics for. (see {@linkcode vscode.TextDocument})
     */
    protected override updateDiagnostics(document: vscode.TextDocument) {
        if (document && this.allowDiagnostics(document)) { // If diagnostics are allowed for this document...
            const diagnostics: vscode.Diagnostic[] = [];

            // Validate the document using the XML Validator from `fast-xml-parser`
            const xmlValidationProblem = this.validateXML(document);
            diagnostics.push(...xmlValidationProblem);

            // Create the diagnostics for the document using the `createProblems` method
            const problems = this.createProblems(document);
            diagnostics.push(...problems);

            // Set the diagnostics collection
            this.diagnostics.set(document.uri, diagnostics);
        }
        else { // ... otherwise, we clear the diagnostics collection
            this.diagnostics.clear();
        }
    }

}
