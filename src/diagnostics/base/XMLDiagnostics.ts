// Library
import * as vscode from 'vscode';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { Validator, Schema, ValidationError } from 'jsonschema';

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

                // Determine the range for the error
                const path = this.determinePath(error);
                const { line, colStart, colEnd } = xml.determinePositionFromPath(text.split(/\r?\n/), path);
                const range = new vscode.Range(
                    line,
                    colStart ?? document.lineAt(line).firstNonWhitespaceCharacterIndex,
                    line,
                    colEnd ?? Number.MAX_VALUE
                );

                // Determine friendly diagnostics message
                const message = this.getFriendlyMessage(error);

                // Create the diagnostic object and add it to the collection
                const problem: vscode.Diagnostic = {
                    range,
                    message,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: this.name,
                };
                diagnostics.push(problem);

            });
        }

        return diagnostics;
    }

    /**
     * Determines the path for the given error
     * @param error The error to determine the path for
     * @returns The path for the given error
     * @see {@link ValidationError | jsonschema.ValidationError}
     */
    private determinePath(error: ValidationError): (string | number)[] {
        if (error.path.length > 0) {
            return error.path;
        } else {
            return error.property
                .replaceAll(/\[(\d+)\]/g, ".$1") // Replace all `[n]` with `.n`
                .split(".")
                .slice(1)
                .map(part => isNaN(Number(part)) ? part : Number(part)); // Parse numbers as actual numbers
        }
    }

    /**
     * Determines the friendly message for the given error
     * @param error The error to determine the friendly message for
     * @returns The friendly message for the given error
     * @see {@link ValidationError | jsonschema.ValidationError}
     */
    private getFriendlyMessage(error: ValidationError): string {

        // Determine the property name
        let propertyName = error.property.split(".").pop();
        if (propertyName === "_@_") {
            propertyName = "attributes";
        }
        const entity = propertyName === "attributes" ? "attribute" : "element";

        // Generate the friendly message for the error
        switch (error.name) {

            case "required":
                return `Missing required ${entity}: \`${error.argument}\``;

            case "additionalProperties":
                return `Unknown ${entity}: \`${error.argument}\``;

            case "type":
                return `\`${propertyName}\` value is not of valid type: ${error.argument}`;

            case "minimum":
                return `\`${propertyName}\` value ${error.message}`;

            case "pattern":
                return `\`${propertyName}\` value ${error.message}`;

            default:
                return `${propertyName} ${error.message}`;

        }

    }

}
