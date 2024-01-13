// Library
import * as vscode from "vscode";
import { XMLDiagnostics } from "./_base";
import { XMLParser } from 'fast-xml-parser';
import { Validator } from "jsonschema";

// Helpers
import { xml } from "../helpers";

// Schemas
import { localizationXMLSchema } from '../library/bg3/schema';

// ----------------------------
// LOCALIZATION XML DIAGNOSTICS
// ----------------------------

export class LocalizationXMLDiagnostics extends XMLDiagnostics {

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
        const parsedXML = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            attributesGroupName: xml.attributesGroupName,
            parseAttributeValue: true,
            isArray: (tagName) => tagName === "content",
        }).parse(text);

        const results = new Validator().validate(parsedXML, localizationXMLSchema);

        if (!results.valid) {
            results.errors.forEach(error => {
                const line = this.determineLineFromPath(document, error.path);

                const range = new vscode.Range(
                    line,
                    document.lineAt(line).firstNonWhitespaceCharacterIndex,
                    line,
                    Number.MAX_VALUE
                );

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
