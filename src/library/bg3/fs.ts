// Library
import * as vscode from 'vscode';

// -----------
// FILE-SYSTEM
// -----------

/**
 * Finds the `meta.lsx` file in the workspace and returns its {@link vscode.Uri}
 * @returns The Uri of the `meta.lsx` file
 */
export async function findMetaLsx(): Promise<vscode.Uri> {
    const paths = await vscode.workspace.findFiles("**/meta.lsx");
    if (!paths?.length) { throw new Error("Failed to find the `meta.lsx` file"); }
    return paths[0];
}

/**
 * Retraces the path from the `meta.lsx` file up to the root folder. This is the folder that contains
 * the Mods and Public folders. This is achieved by going up 3 directories from the path of the `meta.lsx`
 * file (as this is the folder structure the game expects).
 * @returns Uri of the mod's root folder. This is the folder containing the Mods and Public folders
 */
export async function getRootFolderUri(): Promise<vscode.Uri> {
    // Get the path to the `meta.lsx` file
    const metaLsxPath = await findMetaLsx();
    // Traverse up 3 directories to get to the root folder. This should be okay to do as the game expects this folder structure
    const rootPath = vscode.Uri.joinPath(
        metaLsxPath,
        "..",   // [ModFolder]
        "..",   // Mods
        "..",   // [RootFolder]
    );
    return rootPath;
}

/** @returns Name of the mod's root folder */
export async function getRootFolderName(): Promise<string | undefined> {
    const rootPath = await getRootFolderUri();
    return rootPath?.fsPath.split("\\").at(-1);
}
