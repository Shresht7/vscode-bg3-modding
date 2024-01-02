// Library
import * as vscode from 'vscode';

// --------
// META LSX
// --------

class MetaLsx {

    /** Uri of the `meta.lsx` file */
    private path: vscode.Uri | undefined;

    /** Regular expressions to match the version line in `meta.lsx` */
    readonly versionRegex: RegExp = /<attribute\s+id="Version64"\s+type="int64"\s+value="(\d+)"\/>/;

    constructor() { }

    /**
     * Finds the `meta.lsx` file in the workspace and returns its {@link vscode.Uri}
     * @returns The Uri of the `meta.lsx` file
     */
    public async find(): Promise<vscode.Uri> {
        const paths = await vscode.workspace.findFiles("**/meta.lsx");
        if (!paths?.length) { throw new Error("Failed to find the `meta.lsx` file"); }
        return paths[0];
    }

    /** @returns The file contents of the `meta.lsx` file */
    public async getContents(): Promise<string> {
        if (!this.path) { this.path = await this.find(); }
        const buf = await vscode.workspace.fs.readFile(this.path);
        const contents = Buffer.from(buf).toString("utf8");
        return contents;
    }

    /**
     * Writes the provided contents to the `meta.lsx` file
     * @param contents The contents to write to the `meta.lsx` file
     */
    public async setContents(contents: string): Promise<void> {
        if (!this.path) { this.path = await this.find(); }
        const buf = Buffer.from(contents, "utf8");
        await vscode.workspace.fs.writeFile(this.path, buf);
    }

    /**
     * Retraces the path from the `meta.lsx` file up to the root folder. This is the folder that contains
     * the Mods and Public folders. This is achieved by going up 3 directories from the path of the `meta.lsx`
     * file (as this is the folder structure the game expects).
     * @returns Uri of the mod's root folder. This is the folder containing the Mods and Public folders
     */
    public async getRootFolderUri(): Promise<vscode.Uri> {
        // Get the path to the `meta.lsx` file
        const metaLsxPath = await this.find();
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
    public async getRootFolderName(): Promise<string | undefined> {
        const rootPath = await this.getRootFolderUri();
        return rootPath?.fsPath.split("\\").at(-1);
    }

}

export const metaLsx = new MetaLsx();
