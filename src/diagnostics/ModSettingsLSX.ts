// Library
import * as vscode from "vscode";
import { XMLDiagnostics } from "./_base";
import { XMLParser } from 'fast-xml-parser';
import { Validator } from "jsonschema";

// Schemas
import { modsettingsLSXSchema } from '../library/bg3/schema';

// ----------------------------
// MOD-SETTINGS LSX DIAGNOSTICS
// ----------------------------

export class ModSettingsLSXDiagnostics extends XMLDiagnostics {

    constructor(context: vscode.ExtensionContext) {
        super("BG3XML", context);
    }

    override allowDiagnostics(document: vscode.TextDocument): boolean {
        return document
            && document.languageId === "xml"
            && document.fileName.endsWith("modsettings.lsx");
    }

    override createProblems(document: vscode.TextDocument): vscode.Diagnostic[] {
        const problems: vscode.Diagnostic[] = [];

        const text = document.getText();
        const xml = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            attributesGroupName: "_@_",
            parseAttributeValue: true,
        }).parse(text);

        const results = new Validator().validate(xml, modsettingsLSXSchema);

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
