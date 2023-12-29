// Library
import * as vscode from 'vscode';
import { bg3 } from "../library";

/** Copies the mod's UUID to the clipboard */
export async function copyModUUID() {
    // Get mod's metadata from the `meta.lsx` file
    const meta = await bg3.getMetadata();

    // Copy the UUID to the clipboard
    const uuid = meta.ModuleInfo.UUID;
    vscode.env.clipboard.writeText(uuid);

    // Show an information message notifying the user about the action
    const modName = meta.ModuleInfo.Name;
    vscode.window.showInformationMessage(`📋 ${modName}'s UUID copied to clipboard! -- ${uuid}`);
}
