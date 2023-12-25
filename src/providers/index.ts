// Library
import * as vscode from 'vscode';

// =========
// PROVIDERS
// =========

import versionNumberHoverProvider from './versionNumberHover';

export const providers: vscode.Disposable[] = [
    versionNumberHoverProvider
];
