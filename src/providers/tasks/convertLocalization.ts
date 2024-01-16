// Library
import * as vscode from 'vscode';
import { divine } from '../../library/api/lslib';

// -------------------------
// CONVERT LOCALIZATION TASK
// -------------------------

/**
 * Creates a new convert localization {@link vscode.Task | task}
 * @param context The extension context (see {@linkcode vscode.ExtensionContext})
 * @returns A new convert localization {@link vscode.Task | task}
 * @see {@link vscode.Task}
 */
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

    /** The command line to be executed by the convert localization task */
    const commandLine: string = divine.convertLoca("${file}", "${fileDirname}${pathSeparator}${fileBasenameNoExtension}.loca");
    /** The execution of the convert localization task */
    const execution: vscode.ShellExecution = new vscode.ShellExecution(commandLine);

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
