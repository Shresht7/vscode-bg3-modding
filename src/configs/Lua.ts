// Library
import * as vscode from 'vscode';

// -----------------
// LUA CONFIGURATION
// -----------------

export class LuaConfiguration {

    protected constructor(
        /** VS Code Workspace Configuration */
        private config = vscode.workspace.getConfiguration("Lua"),
        /** VS Code Configuration Target */
        private configurationTarget = vscode.ConfigurationTarget.Workspace,
    ) { }

    /**
     * Set the given value for the configuration
     * @param section Configuration name
     * @param value The value to set
     */
    set<T>(section: string, value: T) {
        this.config.update(section, value, this.configurationTarget);
    }

    /**
     * Pushes the given items to the given configuration array
     * @param section Configuration name
     * @param items Items to push to the configuration array
     */
    push<T>(section: string, ...items: T[]) {
        const settings = new Set(this.config.get<T[]>(section) || []);
        items.forEach(item => settings.add(item));
        this.config.update(section, Array.from(settings), this.configurationTarget);
    }

    /**
     * Performs default configurations for the Lua extension (sumneko.lua)
     * @param options Setup configuration options
     */
    static setup(options: {
        /** Path to the Lua workspace library */
        luaReferenceLibrary: string
    }) {
        // Instantiate the VS Code configuration settings
        const settings = new LuaConfiguration();

        // Add the references to the `Lua.workspace.library` configuration to enable IDEHelpers
        settings.push("workspace.library", options.luaReferenceLibrary);

        // Set workspace `preloadFileSize`
        settings.set("workspace.preloadFileSize", 10000);

        // Disable `libraryFiles` diagnostics
        settings.set("diagnostics.libraryFiles", "Disable");

        // Set `workspaceRate` and `workspaceDelay`
        settings.set("diagnostics.workspaceRate", 25);
        settings.set("diagnostics.workspaceDelay", 5000);

        // Add Osi and Ext to globals
        settings.push("diagnostics.globals", "Osi", "Ext");
    }

}
