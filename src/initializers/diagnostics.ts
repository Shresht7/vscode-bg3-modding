// Library
import * as vscode from 'vscode';
import { LocalizationXMLDiagnostics, ModSettingsLSXDiagnostics } from '../diagnostics';

// -----------
// DIAGNOSTICS
// -----------

/** Initializes the diagnostics contributions provided by the extension */
export function initializeDiagnostics(context: vscode.ExtensionContext) {
    new LocalizationXMLDiagnostics().initialize(context);
    new ModSettingsLSXDiagnostics().initialize(context);
}
