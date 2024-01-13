// Library
import * as vscode from "vscode";
import { Diagnostics } from "./_base";
import { XMLParser } from 'fast-xml-parser';

// Schemas
import { localizationXMLSchema } from '../library/bg3/schema';

// ----------------------------
// LOCALIZATION XML DIAGNOSTICS
// ----------------------------

export class LocalizationXMLDiagnostics extends Diagnostics {

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

        const results = this.jsonValidator.validate(xml, localizationXMLSchema);

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

}
