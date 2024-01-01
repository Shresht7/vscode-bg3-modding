// Library
import * as vscode from 'vscode';
import { bg3 } from '../library';
import { utils, fs } from '../helpers';
import { VersionHoverProvider } from '../providers/hover';

// Type Definitions
import type { VersionKind } from '../types';

/** Convert Int64 version number to string format or vice-versa */
export async function bumpVersionNumber() {

    // Exit early if no folder or workspace is open
    if (!vscode.workspace.workspaceFolders?.length) {
        return vscode.window.showErrorMessage("No folder or workspace opened");
    }

    // Prompt the user for the kind of version bump
    const options: VersionKind[] = [
        "major",
        "minor",
        "revision",
        "build",
    ];
    const response = await vscode.window.showQuickPick(options.map(opt => ({
        label: utils.capitalize(opt),
        selection: opt
    })), {
        title: "Kind"
    });

    // Exit early if no selection was made
    if (!response?.selection) { return; };

    // ! Warning: Hacky code ahead. Several points of failure. Needs a second pass of improvement.

    const metaLsxPath = (await fs.findMetaLsxUris())[0];
    const fileContents = await fs.getMetaLsxContents();

    // Perform regex match for the version attribute line in the file contents
    const capture = VersionHoverProvider.execRegex(fileContents);
    if (!capture?.length) { return; }    // Return early if no match was found
    const bigIntVersion = BigInt(capture);

    // Determine the updated version
    const version = new bg3.Version(bigIntVersion).bump(response.selection);

    // Replace file contents with the new version
    const newFileContents = fileContents.replace(
        VersionHoverProvider.versionRegex,
        `<attribute id="Version64" type="int64" value="${version.toInt64().toString()}"/>`
    );
    const fileBuffer = Buffer.from(newFileContents, 'utf8');

    // Write the new file contents back to the `meta.lsx` file
    vscode.workspace.fs.writeFile(metaLsxPath, fileBuffer);

    // Show an information message for the version bump
    vscode.window.showInformationMessage(`Version bumped to ${version.toString()}`);

}
