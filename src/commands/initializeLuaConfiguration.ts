// Library
import * as vscode from 'vscode';
import * as path from 'node:path';
import { LUA_REFERENCES_FOLDER } from '../constants';

// Configuration
import { LuaConfiguration } from "../configs/Lua";

/** Initialize {@link LuaConfiguration} in the workspace settings */
export async function initializeLuaConfiguration(context: vscode.ExtensionContext) {

    // Get the path to the extension's lua references folder
    const luaReferenceLibrary = path.join(context.extensionPath, LUA_REFERENCES_FOLDER);

    // Initialize the Lua Configuration
    LuaConfiguration.setup({ luaReferenceLibrary });

}
