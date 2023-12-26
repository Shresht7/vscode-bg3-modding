// Library
import * as vscode from 'vscode';
import { bg3 } from '../library';
import { utils } from '../helpers';

/** Convert Int64 version number to string format or vice-versa */
export async function bumpVersionNumber() {

    // Exit early if no folder or workspace is open
    if (!vscode.workspace.workspaceFolders?.length) {
        return vscode.window.showErrorMessage("No folder or workspace opened");
    }

    // Prompt the user for the kind of version bump
    const options: bg3.VersionKind[] = [
        bg3.VersionKind.MAJOR,
        bg3.VersionKind.MINOR,
        bg3.VersionKind.REVISION,
        bg3.VersionKind.BUILD,
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

    // Find the `meta.lsx` file in the workspace
    // TODO: Handle case where multiple meta.lsx files are found
    const metaLsxPaths = await vscode.workspace.findFiles("**/meta.lsx", null, 1);

    // Return if no `meta.lsx` was found
    if (!metaLsxPaths?.length) {
        return vscode.window.showErrorMessage("Could not find any `meta.lsx` files in this workspace");
    }

    // Get the first `meta.lsx` path
    // ? Not sure if this is the best way to deal with the problem
    const metaLsxPath = metaLsxPaths[0];

    // Read the fist `meta.lsx` file
    let fileBuffer = await vscode.workspace.fs.readFile(metaLsxPath);
    let fileContents = Buffer.from(fileBuffer).toString('utf8');

    // Perform regex match for the version attribute line in the file contents
    const regexExecArray = bg3.Version.lsxRegex.exec(fileContents);
    if (!regexExecArray?.length) { return; }    // Return early if no match was found

    // Parse the bigint version from the regex capture
    // TODO: Handle case where BigInt() fails to parse the regex capture
    const bigIntVersion = BigInt(regexExecArray[1]);

    // Determine the updated version
    const version = new bg3.Version(bigIntVersion).bump(response.selection);

    // Replace file contents with the new version
    fileContents = fileContents.replace(bg3.Version.lsxRegex, `<attribute id="Version64" type="int64" value="${version.toInt64().toString()}"/>`);
    fileBuffer = Buffer.from(fileContents, 'utf8');

    // Write the new file contents back to the `meta.lsx` file
    vscode.workspace.fs.writeFile(metaLsxPath, fileBuffer);

    // Show an information message for the version bump
    vscode.window.showInformationMessage(`Version bumped to ${version.toString()}`);

}
