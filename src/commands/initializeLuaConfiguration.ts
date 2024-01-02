// Library
import * as path from 'node:path';
import { LUA_REFERENCES_FOLDER } from '../constants';
import { fs } from '../helpers';

// Configuration
import { LuaConfiguration } from "../configs/Lua";

/** Initialize {@link LuaConfiguration} in the workspace settings */
export async function initializeLuaConfiguration() {

    // Get the path to the extension's directory
    const extensionPath = await fs.getExtensionPath();

    // Get the path to the extension's lua references folder
    const luaReferenceLibrary = path.join(context.extensionPath, LUA_REFERENCES_FOLDER);

    // Initialize the Lua Configuration
    LuaConfiguration.setup({ luaReferenceLibrary });

}
