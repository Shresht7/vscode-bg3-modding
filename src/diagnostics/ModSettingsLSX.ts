// Library
import * as vscode from "vscode";
import { XMLDiagnostics } from "./base";

// Schemas
import { modsettingsLSXSchema } from '../library/bg3/schema';

// ----------------------------
// MOD-SETTINGS LSX DIAGNOSTICS
// ----------------------------

/**
 * Represents a class that provides diagnostics for `modsettings.lsx` file
 * @extends XMLDiagnostics {@link XMLDiagnostics}
 */
export class ModSettingsLSXDiagnostics extends XMLDiagnostics {

    /**
     * @param context - The extension context ({@linkcode vscode.ExtensionContext})
     * @returns A new instance of the {@linkcode ModSettingsLSXDiagnostics} class
     */
    constructor(context: vscode.ExtensionContext) {
        super("BG3XML", context, modsettingsLSXSchema);
    }

    /**
     * Determines whether the given `document` is a `modsettings.lsx` file or not and if diagnostics should be created for it
     * @param document The document to create diagnostics for. (see {@linkcode vscode.TextDocument})
     * @returns `true` if diagnostics should be created for this file, `false` otherwise
     * @override
     */
    override shouldAllowDiagnostics(document: vscode.TextDocument): boolean {
        return document
            && document.languageId === "xml"
            && document.fileName.endsWith("modsettings.lsx");
    }

}
