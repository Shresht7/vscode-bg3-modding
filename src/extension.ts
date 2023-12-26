// Library
// The module `vscode` contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as path from 'node:path';

// Initializers
import { initialize } from './initializers';

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

	// Initialize Localization Contributions
	initialize.localization();

	// Initialize Diagnostics
	initialize.diagnostics(context);

	// Initialize Providers
	initialize.providers(context);

	// Register all the commands and providers, and subscribe to their disposables
	context.subscriptions.push(
		...commands,
		...providers
	);

	// Perform Lua Configuration Setup
	setupLuaConfiguration(context);
}

/**
 * Performs default configurations for the Lua extension (sumneko.lua)
 * @param context Context for this extension
 */
function setupLuaConfiguration(context: vscode.ExtensionContext) {
	// Get VS Code configuration object
	const config = vscode.workspace.getConfiguration();

	// Enumeration to hold the settings
	enum SETTINGS {
		WORKSPACE_LIBRARY = "Lua.workspace.library",
	};

	// Add the references to the `Lua.workspace.library` configuration to enable IDEHelpers
	const workspaceLibrarySetting = config.get<string[]>(SETTINGS.WORKSPACE_LIBRARY);
	workspaceLibrarySetting?.push(path.join(context.extensionPath, "references"));
	config.update(SETTINGS.WORKSPACE_LIBRARY, workspaceLibrarySetting, vscode.ConfigurationTarget.Workspace);
}

// This method is called when your extension is deactivated
export function deactivate() { }
