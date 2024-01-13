// Library
import * as vscode from 'vscode';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { Validator, Schema } from 'jsonschema';

// Classes
import { Diagnostics } from './Diagnostics';

// Helpers
import { xml } from '../../helpers';

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
    constructor(
        protected name: string,
        context: vscode.ExtensionContext,
        private schema: Schema,
    ) {
        super(name, context);
    }


    /**
     * Creates diagnostic problems for the given document.
     * 
     * @param document The text document to create diagnostic problems for. (see {@linkcode vscode.TextDocument})
     * @returns An array of diagnostic problems. (see {@linkcode vscode.Diagnostic})
     */
    protected override createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        // Validate the document using the XML Validator from `fast-xml-parser`
        const xmlProblems = this.validateXML(document);
        // Validate the document using the JSON Schema
        const jsonSchemaProblems = this.validateJSONSchema(document);
        // Return the problems
        return [...xmlProblems, ...jsonSchemaProblems];
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
     * Validates the XML document against the JSON Schema and returns an array of diagnostics for any errors found.
     * @param document The TextDocument to validate.
     * @returns An array of vscode.Diagnostic objects representing the errors found in the document.
     */
    private validateJSONSchema(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];

        // Parse the XML document
        const text = document.getText();
        const parsedXML = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            attributesGroupName: xml.attributesGroupName,
            parseAttributeValue: true,
        }).parse(text);

        // Validate the document using the JSON Schema
        const results = new Validator().validate(parsedXML, this.schema);


        // If the document is not valid, then we create a diagnostic for the error
        if (!results.valid) {
            results.errors.forEach(error => {

                // Determine the line of the error from the path
                const line = this.determineLineFromPath(document, error.path);

                // Create a range for the error
                const range = new vscode.Range(
                    line,
                    document.lineAt(line).firstNonWhitespaceCharacterIndex,
                    line,
                    Number.MAX_VALUE
                );

                // Create the diagnostic object and add it to the collection
                const problem: vscode.Diagnostic = {
                    range,
                    message: error.message,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: this.name,
                };
                diagnostics.push(problem);

            });
        }

        return diagnostics;
    }

}
