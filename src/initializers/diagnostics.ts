// Library
import * as vscode from 'vscode';
import {
    LocalizationXMLDiagnostics,
    MetaLSXDiagnostics,
    ModSettingsLSXDiagnostics
} from '../diagnostics';

// -----------
// DIAGNOSTICS
// -----------

/** Initializes the diagnostics contributions provided by the extension */
export function initializeDiagnostics(context: vscode.ExtensionContext) {
    new LocalizationXMLDiagnostics().initialize(context);
    new ModSettingsLSXDiagnostics().initialize(context);
    new MetaLSXDiagnostics().initialize(context);
}
