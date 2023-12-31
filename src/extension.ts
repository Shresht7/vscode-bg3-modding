// Library
// The module `vscode` contains the VS Code extensibility API
import * as vscode from 'vscode';

// Commands
import { commands } from './commands';

// Providers
import { providers } from './providers';
import { buildLocalizationReference } from './library/bg3/buildLocalizationReference';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// or when `meta.lsx` file is detected in the workspace 
export async function activate(context: vscode.ExtensionContext) {

	// Show Information Message when the extension is activated
	vscode.window.showInformationMessage("BG3 Modding Extension Activated!");

	// Create a file-watcher for the xml localization files
	const localizationXMLFileWatcher = vscode.workspace.createFileSystemWatcher("**/Localization/**/*.xml");

	// Build localization references when a new xml is created
	localizationXMLFileWatcher.onDidCreate(e => {
		buildLocalizationReference([e]);
	});

	// Rebuild localization references when a xml is changed
	// ? Performance concerns?
	localizationXMLFileWatcher.onDidChange(e => {
		buildLocalizationReference([e]);
	});

	// Remove localization references when a xml is deleted
	localizationXMLFileWatcher.onDidDelete(e => {
		/**
		 * // TODO: Remove references. May also have to dispose off the registered hover provider
		 * ? (if I decide to register separate providers for each file)
		 */
		throw new Error("TODO: Implementation pending!");
	});

	// Register all the commands and providers, and subscribe to their disposables
	context.subscriptions.push(
		...commands,
		...providers
	);

}

// This method is called when your extension is deactivated
export function deactivate() { }
