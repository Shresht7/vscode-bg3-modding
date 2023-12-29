// Library
// The module `vscode` contains the VS Code extensibility API
import * as vscode from 'vscode';

// Commands
import { commands } from './commands';

// Providers
import { providers } from './providers';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// or when `meta.lsx` file is detected in the workspace 
export async function activate(context: vscode.ExtensionContext) {

	// Show Information Message when the extension is activated
	vscode.window.showInformationMessage("BG3 Modding Extension Activated!");

	// Register all the commands and providers, and subscribe to their disposables
	context.subscriptions.push(
		...commands,
		...providers
	);

}

// This method is called when your extension is deactivated
export function deactivate() { }
