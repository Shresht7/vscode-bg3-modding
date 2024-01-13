// Library
import * as vscode from "vscode";
import { XMLDiagnostics } from "./base";
import { XMLParser } from 'fast-xml-parser';
import { Validator } from "jsonschema";

// Helpers
import { xml } from "../helpers";

// Schemas
import { localizationXMLSchema } from '../library/bg3/schema';

// ----------------------------
// LOCALIZATION XML DIAGNOSTICS
// ----------------------------

/**
 * Represents a class that provides diagnostics for localization XML files.
 * @extends XMLDiagnostics {@link XMLDiagnostics}
 */
export class LocalizationXMLDiagnostics extends XMLDiagnostics {

    /**
     * @param context - The extension context ({@linkcode vscode.ExtensionContext})
     * @returns A new instance of the {@linkcode LocalizationXMLDiagnostics} class
     */
    constructor(context: vscode.ExtensionContext) {
        super("BG3XML", context);
    }

    /**
     * Determines whether the given `document` is a localization xml file or not and if diagnostics should be created for it
     * @param document The document to create diagnostics for. (see {@linkcode vscode.TextDocument})
     * @returns `true` if diagnostics should be created for this file, `false` otherwise
     * @override
     */
    override allowDiagnostics(document: vscode.TextDocument): boolean {
        return document
            && document.languageId === "xml"
            && document.fileName.includes("Localization");
    }

    /**
     * Creates diagnostic problems for the given `document`
     * @param document The text document to create problems for. (see {@linkcode vscode.TextDocument})
     * @returns An array of diagnostic problems. (see {@linkcode vscode.Diagnostic})
     * @override
     */
    override createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        const problems: vscode.Diagnostic[] = [];

        // Parse the XML document
        const text = document.getText();
        const parsedXML = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            attributesGroupName: xml.attributesGroupName,
            parseAttributeValue: true,
            isArray: (tagName) => tagName === "content",
        }).parse(text);

        // Validate the document using the JSON Schema
        const results = new Validator().validate(parsedXML, localizationXMLSchema);

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
                problems.push(problem);

            });
        }

        return problems;
    }

}
