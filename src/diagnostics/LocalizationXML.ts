// Library
import * as vscode from "vscode";
import { XMLDiagnostics } from "./base";

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
        super("BG3XML", context, localizationXMLSchema);
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

}
