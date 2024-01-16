// Library
import * as vscode from 'vscode';
import * as path from 'node:path';
import { LUA_REFERENCES_FOLDER } from '../constants';
import { fs } from '../helpers';

// Configuration
import { LuaConfiguration } from "../configs/Lua";

/** Initialize {@link LuaConfiguration} Settings */
export async function initializeLuaConfiguration() {

    // Get the path to the extension's directory
    const extensionPath = await fs.getExtensionPath();

    // Prompt the user to select the scope of the configuration
    const configurationTarget = await promptForConfigurationScope();

    // Get the path to the extension's lua references folder
    const luaReferenceLibrary = path.join(extensionPath, LUA_REFERENCES_FOLDER);

    // Initialize the Lua Configuration
    LuaConfiguration.setup({ luaReferenceLibrary, configurationTarget });

}

// ----------------
// HELPER FUNCTIONS
// ----------------

/** Prompt the user to select the scope of the configuration */
async function promptForConfigurationScope(): Promise<vscode.ConfigurationTarget | undefined> {
    // Prompt the user to select the scope of the configuration
    const response = await vscode.window.showQuickPick([
        { label: "Workspace", description: "Workspace settings --- `.vscode/settings.json`" },
        // { label: "Workspace Folder", description: "Workspace folder settings" },
        { label: "User", description: "User settings --- Global `settings.json`" },
    ], {
        title: "Lua Configuration",
        placeHolder: "Select the scope of the configuration",
    });

    // Return if the user canceled the prompt
    if (!response) { return; }

    // Return the configuration target
    switch (response.label) {
        case "Workspace": return vscode.ConfigurationTarget.Workspace;
        case "User": return vscode.ConfigurationTarget.Global;
        // case "Workspace Folder": return vscode.ConfigurationTarget.WorkspaceFolder;
    }
}
