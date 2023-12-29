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
export async function findMetaLsxUris(maxResults: number = 1): Promise<vscode.Uri[]> {
    return vscode.workspace.findFiles("**/meta.lsx", null, maxResults);
}

/** @returns The file contents of the `meta.lsx` file */
export async function getMetaLsxContents(): Promise<string> {
    // Get the path to the `meta.lsx` file
    const metaLsxPaths = await findMetaLsxUris();
    if (!metaLsxPaths?.length) { throw new Error("Failed to find the `meta.lsx` file"); }
    const metaLsxPath = metaLsxPaths[0];

    // Read the file contents
    const buf = await vscode.workspace.fs.readFile(metaLsxPath);
    const contents = Buffer.from(buf).toString("utf8");
    return contents;
}

/**
 * Retraces the path from the `meta.lsx` file up to the root folder. This is the folder that contains
 * the Mods and Public folders.
 * @returns Uri of the mod's root folder. This is the folder containing the Mods and Public folders
 */
export async function getModRootFolderUri(): Promise<vscode.Uri> {
    const metaLsxPaths = await findMetaLsxUris();
    if (!metaLsxPaths?.length) { throw new Error("Failed to find the `meta.lsx` file"); }
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
export async function getModRootFolderName(): Promise<string | undefined> {
    const rootPath = await getModRootFolderUri();
    return rootPath?.fsPath.split("\\").at(-1);
}
