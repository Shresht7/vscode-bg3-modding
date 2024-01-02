// Library
import * as vscode from 'vscode';
import { bg3 } from '../library';
import { utils } from '../helpers';

// Type Definitions
import type { VersionKind } from '../types';

// ---------------------------
// BUMP VERSION NUMBER COMMAND
// ---------------------------

/** Convert Int64 version number to string format or vice-versa */
export async function bumpVersionNumber() {

    // Exit early if no folder or workspace is open
    if (!vscode.workspace.workspaceFolders?.length) {
        return vscode.window.showErrorMessage("No folder or workspace opened");
    }

    // Prompt the user for the kind of version bump
    const response = await promptForVersion();
    if (!response?.selection) { return; }; // Exit early if no response

    // Get the current version number
    const meta = await bg3.metaLsx.parse();
    const bigIntVersion = BigInt(meta.ModuleInfo.Version64);

    // Bump the version number
    const version = new bg3.Version(bigIntVersion).bump(response.selection);

    // Update the version number in the `meta.lsx` file
    meta.updateModuleInfo("Version64", version.toInt64().toString());
    await bg3.metaLsx.save();

    // Show an information message for the version bump
    vscode.window.showInformationMessage(`Version bumped to ${version.toString()}`);

}

/** Prompt the user for the kind of version bump */
async function promptForVersion() {
    // Prompt the user for the kind of version bump
    const options: VersionKind[] = ["major", "minor", "revision", "build"];
    const response = await vscode.window.showQuickPick(options.map(opt => ({
        label: utils.capitalize(opt),
        selection: opt
    })), {
        title: "Kind",
        placeHolder: "Select the kind of version bump"
    });
    return response;
}
