// Library
import * as vscode from 'vscode';
import { LocalizationXMLDiagnostics } from '../diagnostics';

// -----------
// DIAGNOSTICS
// -----------

/** Initializes the diagnostics contributions provided by the extension */
export function initializeDiagnostics(context: vscode.ExtensionContext) {
    return new LocalizationXMLDiagnostics(context);
}
