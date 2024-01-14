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

    protected abstract schema: Schema;

    /**
     * @param name - The name of the {@linkcode diagnostics} collection
     * @param schema - The {@link Schema| JSON Schema} to validate the XML document against
     * @returns A new instance of the {@linkcode XMLDiagnostics} class
     */
    constructor(protected name: string) {
        super(name);
    }


    /**
     * Creates diagnostic problems for the given document
     * 
     * @param document The text document to create diagnostic problems for. (see {@linkcode vscode.TextDocument})
     * @returns An array of diagnostic problems (see {@linkcode vscode.Diagnostic})
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
     * Validates the XML document against the JSON Schema and returns an array of diagnostics for any errors found
     * @param document The TextDocument to validate. (see {@linkcode vscode.TextDocument})
     * @returns An array of {@link vscode.Diagnostic} objects representing the errors found in the document.
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
                const { line, colStart, colEnd } = this.determinePositionFromPath(document, error.path);

                // Create a range for the error
                const range = new vscode.Range(
                    line,
                    colStart ?? document.lineAt(line).firstNonWhitespaceCharacterIndex,
                    line,
                    colEnd ?? Number.MAX_VALUE
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

    // HELPER METHODS
    // --------------

    /**
     * Determines the line number, column-start and column-end numbers of the {@linkcode path} in the {@linkcode document}
     * @param document The {@link vscode.TextDocument | text document} (see {@linkcode vscode.TextDocument})
     * @param path The path to the property represented as an array (e.g. `["root", "property", 1, "value"]`)
     * @returns The line number, column start and column end numbers (if possible) corresponding to the {@linkcode path}
     */
    protected determinePositionFromPath(document: vscode.TextDocument, path: (string | number)[]): {
        line: number,
        colStart?: number,
        colEnd?: number,
    } {

        /**
         * The line of the {@linkcode document} that the {@linkcode path} corresponds to
         * 
         * We start at `0` (the first line of the document)
         * and we adjust the line number as we iterate through the document lines and find the appropriate text
         */
        let line = 0;

        /** The column-start number at the given line */
        let colStart: number | undefined;
        /** The column-end number at the given line */
        let colEnd: number | undefined;

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

            // If the part is `undefined`, then we break out of the loop and return the latest line
            if (part === undefined) { break; }

            /** The text corresponding to the current line index in the {@linkcode document} */
            const text = document.lineAt(i).text;

            // If the text includes the part, then we set the line to the current line and move on to the next part
            if (text.includes("<" + part)) {
                line = i;
                parentPart = part;
                part = path.shift();
            }

            // If the part is an array...
            if (typeof part === "number") {
                if (part > 0 && text.includes("<" + parentPart)) {
                    // ...continue until we find the correct index
                    part--;
                    continue;
                } else {
                    // .. then we select the next occurrence of the part
                    line = i;
                    parentPart = part;
                    part = path.shift();
                }
            }

            // If we have found a particular attribute, then we set the colStart and colEnd values
            if (part === xml.attributesGroupName) {
                const attributeName = path.shift();
                // If the attribute name is incorrect, we break out of the loop as usual
                if (!attributeName || !text.includes(attributeName.toString())) {
                    break;
                }
                // Otherwise, we try to find the colStart and colEnd values
                const matches = text.match(new RegExp(`${attributeName}=".*?"`));
                if (matches?.length) {
                    colStart = text.indexOf(matches[0]);
                    colEnd = colStart + matches[0].length;
                }
                // We break out of the loop as usual
                break;
            }

        }

        // Return the line number corresponding to the given path
        return { line, colStart, colEnd };
    }

}
