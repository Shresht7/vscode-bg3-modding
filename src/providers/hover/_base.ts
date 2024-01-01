// Library
import * as vscode from 'vscode';

// --------------
// HOVER PROVIDER
// --------------

export abstract class HoverProvider implements vscode.HoverProvider, vscode.Disposable {

    /** The vscode hover provider registration */
    private _registration: vscode.Disposable | undefined;

    constructor(
        /** A selector that defines the documents this provider is applicable to */
        private readonly documentSelector: vscode.DocumentSelector
    ) { }

    /**
     * Register this hover provider to vscode. If it was already registered, it will dispose off
     * the original and re-register the hover provider to vscode.
     * @returns A vscode.Disposable that calls a `dispose()` function to release resources when disposed
    */
    protected register(): vscode.Disposable {
        if (this._registration) { this.dispose(); }
        this._registration = vscode.languages.registerHoverProvider(this.documentSelector, this);
        return this._registration;
    }

    /** Dispose off the registered hover provider */
    dispose() {
        return this._registration?.dispose();
    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        return;
    }

}
