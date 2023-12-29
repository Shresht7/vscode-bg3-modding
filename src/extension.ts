// Library
// The module `vscode` contains the VS Code extensibility API
import * as vscode from 'vscode';
import { MetaLSX } from './configs/metaLSX';

// Commands
import { commands } from './commands';

// Providers
import { providers } from './providers';

// Helpers
import { fs } from './helpers';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// or when `meta.lsx` file is detected in the workspace 
export async function activate(context: vscode.ExtensionContext) {

	// Show Information Message when the extension is activated
	vscode.window.showInformationMessage("BG3 Modding Extension Activated!");

	// Get the path to the `meta.lsx` file
	const metaLsxFile = (await fs.findMetaLsxUris(1))[0];
	const fileBuffer = await vscode.workspace.fs.readFile(metaLsxFile);
	const fileContents = Buffer.from(fileBuffer).toString("utf8");

	const meta = new MetaLSX(fileContents);

	vscode.window.showInformationMessage(meta.dependencies.map(d => d.Folder).join(','));

	// Register all the commands and providers, and subscribe to their disposables
	context.subscriptions.push(
		...commands,
		...providers
	);

}

// This method is called when your extension is deactivated
export function deactivate() { }

