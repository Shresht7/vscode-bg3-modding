// Library
// The module `vscode` contains the VS Code extensibility API
import * as vscode from 'vscode';
import { XMLParser } from 'fast-xml-parser';

// Commands
import { commands } from './commands';

// Providers
import { providers } from './providers';

// Helpers
import { fs } from './helpers';

// Type Definitions
import type { Meta } from './types/meta';

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

	const meta = new XMLParser({
		ignoreDeclaration: true,
		ignoreAttributes: false,
		attributeNamePrefix: "",
		parseAttributeValue: true,
		numberParseOptions: {
			leadingZeros: true,
			hex: true,
		},
		isArray(tagName, jPath, isLeafNode, isAttribute) {
			return jPath.endsWith('children.node') || jPath.endsWith('node.attribute');
		},
	}).parse(fileContents);

	// Register all the commands and providers, and subscribe to their disposables
	context.subscriptions.push(
		...commands,
		...providers
	);

}

// This method is called when your extension is deactivated
export function deactivate() { }

