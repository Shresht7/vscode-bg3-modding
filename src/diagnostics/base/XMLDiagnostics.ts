// Library
import * as vscode from 'vscode';
import { XMLValidator } from 'fast-xml-parser';

// Classes
import { Diagnostics } from './Diagnostics';

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
