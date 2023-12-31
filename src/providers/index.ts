// Library
import * as vscode from 'vscode';

// =========
// PROVIDERS
// =========

import { VersionHoverProvider } from './hover';

/** An array of disposables for the registered providers */
export const providers: vscode.Disposable[] = [
    vscode.languages.registerHoverProvider(['xml'], VersionHoverProvider)
];
