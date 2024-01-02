// Library
import * as vscode from 'vscode';
import { bg3 } from '../library';

// Helpers
import { utils } from '../helpers';

// Type Definitions
import type { VersionKind } from '../types';

// ---------------------------
// BUMP VERSION NUMBER COMMAND
// ---------------------------

/** Bump the version number of the current project */
export async function bumpVersionNumber() {

    // Exit early if no folder or workspace is open
    if (!vscode.workspace.workspaceFolders?.length) {
        return vscode.window.showErrorMessage("No folder or workspace opened");
    }

    // Prompt the user for the kind of version bump
    const response = await promptForVersion();
    if (!response?.selection) { return; }; // Exit early if no response

    // Parse the `meta.lsx` file so we can get the current version number
    let meta: bg3.MetaLsx;
    try {
        meta = await bg3.metaLsx.parse();
    } catch (e) {
        vscode.window.showErrorMessage("No `meta.lsx` file found in the workspace");
        return;
    }

    // Get the current version number
    let bigIntVersion: bigint;
    try {
        bigIntVersion = BigInt(meta.ModuleInfo.Version64);
    } catch (e) {
        vscode.window.showErrorMessage(`The \`meta.lsx\` file does not contain a valid version number (${meta.ModuleInfo.Version64})`);
        return;
    }

    // Bump the version number
    const version = new bg3.Version(bigIntVersion).bump(response.selection);
    meta.updateModuleInfo("Version64", version.toInt64().toString());

    // Update the version number in the `meta.lsx` file
    try {
        await bg3.metaLsx.save();
    } catch (e) {
        vscode.window.showErrorMessage(`Failed to save the updated version number (${version}) to the \`meta.lsx\` file`);
        return;
    }

    // Show an information message for the version bump
    vscode.window.showInformationMessage(`Version bumped to ${version}`);

}

// HELPER FUNCTIONS
// ----------------

/** Prompt the user for the kind of version bump */
async function promptForVersion() {
    /** The set of version options */
    const options: VersionKind[] = ["major", "minor", "revision", "build"];
    /** The options to show to the user in the quick pick menu */
    const quickPickOptions = options.map(opt => ({ label: utils.capitalize(opt), selection: opt }));
    // Prompt the user to select the kind of version bump
    return vscode.window.showQuickPick(quickPickOptions, {
        title: "Kind",
        placeHolder: "Select the kind of version bump"
    });
}
