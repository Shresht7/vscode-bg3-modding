// Library
import * as vscode from 'vscode';

// -------------------------
// CONVERT LOCALIZATION TASK
// -------------------------

export async function convertLocalizationTask(context: vscode.ExtensionContext): Promise<vscode.Task> {

    /** The definition of the convert localization task */
    const definition: vscode.TaskDefinition = {
        type: 'build',
        task: 'convert-localization'
    };

    /** The scope of the convert localization task */
    const scope: vscode.TaskScope = vscode.TaskScope.Workspace;

    /** The group of the convert localization task */
    const group: vscode.TaskGroup = vscode.TaskGroup.Build;

    /** The name of the convert localization task */
    const name: string = '🅰️ Convert Localization';

    /** The source of the convert localization task */
    const source: string = 'BG3 Modding Extension';

    /** A short description about the convert localization task */
    const detail = 'Converts localization `.xml` files to the `.loca` format';

    /** The execution of the convert localization task */
    const execution: vscode.ShellExecution = new vscode.ShellExecution([
        "divine.exe",
        "--game",
        "bg3",
        "--action",
        "convert-loca",
        "--source",
        "${file}",
        "--destination",
        "${fileDirname}\\${fileBasenameNoExtension}.loca",
    ].join(" "));

    // Instantiate and return the vscode.Task
    return {
        definition,
        scope,
        group,
        name,
        source,
        detail,
        execution,
        isBackground: false,
        problemMatchers: [],
        presentationOptions: {},
        runOptions: {},
    };
}
