// Library
import * as vscode from 'vscode';

// =========
// PROVIDERS
// =========

import { VersionHoverProvider, LocalizationHoverProvider } from './hover';
import { taskProvider } from './tasks';

/** An array of disposables for the registered providers */
export const providers: vscode.Disposable[] = [
    new VersionHoverProvider(),
    new LocalizationHoverProvider(),
    taskProvider
];
