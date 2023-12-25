// Library
import * as vscode from 'vscode';

// =========
// PROVIDERS
// =========

// Shows the string representation of the version number
// when hovering over the int64 version number in the `meta.lsx` file 
import versionNumberHoverProvider from './versionNumberHover';

/** An array of disposables for the registered providers */
export const providers: vscode.Disposable[] = [
    versionNumberHoverProvider
];
