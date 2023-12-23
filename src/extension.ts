// Library
// The module `vscode` contains the VS Code extensibility API
import * as vscode from 'vscode';
// The `crypto` module contains the `webcrypto.randomUUID()` method to generate a v4 UUID 
import { webcrypto } from 'crypto';

// Helpers
import { editor } from './helpers';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('bg3-modding.generateUUID', () => {
		// The code you place here will be executed every time your command is executed
		const uuid = webcrypto.randomUUID();
		editor.insertAtCursorLocation(uuid);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
