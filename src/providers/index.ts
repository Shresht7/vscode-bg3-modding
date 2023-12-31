// Library
import * as vscode from 'vscode';

// =========
// PROVIDERS
// =========

import { VersionHoverProvider, LocalizationHoverProvider } from './hover';

/** An array of disposables for the registered providers */
export const providers: vscode.Disposable[] = [
    VersionHoverProvider.register(),
    LocalizationHoverProvider.register(),
];
