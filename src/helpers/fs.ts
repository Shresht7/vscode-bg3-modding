// Library
import * as vscode from 'vscode';

// ----------------------------
// FILE-SYSTEM HELPER FUNCTIONS
// ----------------------------

/**
 * Finds the `meta.lsx` in the workspace and returns its uri
 * @param maxResults The max number of search results to return. Defaults to 1 to return just the first
 * @returns An array of vscode.Uris pointing to the meta.lsx file
 */
export async function findMetaLsxUris(maxResults: number = 1) {
    return vscode.workspace.findFiles("**/meta.lsx", null, maxResults);
}

/**
 * Retraces the path from the `meta.lsx` file up to the root folder. This is the folder that contains
 * the Mods and Public folders.
 * @returns Uri of the mod's root folder. This is the folder containing the Mods and Public folders
 */
export async function getModRootFolderUri() {
    const metaLsxPaths = await findMetaLsxUris();
    if (!metaLsxPaths?.length) { return; }
    const metaLsxPath = metaLsxPaths[0];
    const rootPath = vscode.Uri.joinPath(
        metaLsxPath,
        "..",   // [ModFolder]
        "..",   // Mods
        "..",   // [RootFolder]
    );
    return rootPath;
}

/**
 * Retrieve the mod's root folder's name
 * @returns Name of the mod's root folder
 */
export async function getModRootFolderName() {
    const rootPath = await getModRootFolderUri();
    return rootPath?.fsPath.split("\\").at(-1);
}
