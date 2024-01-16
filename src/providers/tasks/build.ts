// Library
import * as vscode from 'vscode';
import { getRootFolderUri } from '../../library/bg3/fs';
import { divine } from '../../library/api/lslib';

// ----------
// BUILD TASK
// ----------

/**
 * Creates a build {@link vscode.Task | task}
 * @param context The extension context (see {@linkcode vscode.ExtensionContext})
 * @returns A promise that resolves to a build {@link vscode.Task | task}
 * @see {@link vscode.Task}
 */
export async function createBuildTask(context: vscode.ExtensionContext): Promise<vscode.Task> {

    /** The definition of the build task */
    const taskDefinition: vscode.TaskDefinition = {
        type: 'build',
        task: 'build'
    };

    /** The scope of the build task */
    const scope: vscode.TaskScope = vscode.TaskScope.Workspace;

    /** The name of the build task */
    const name: string = '📦 Build Package';

    /** The source of the build task */
    const source: string = 'BG3 Modding Extension';

    /** A short description about the build task */
    const detail = 'Builds the Mod Project using `divine.exe` (lslib)';

    /** The command line for the build task */
    const commandLine: string = await getCommandLine();
    /** The execution of the build task */
    const execution: vscode.ShellExecution = new vscode.ShellExecution(commandLine);

    // Instantiate and return the vscode.Task
    return {
        definition: taskDefinition,
        detail,
        name,
        source,
        scope,
        execution,
        isBackground: false,
        problemMatchers: [],
        presentationOptions: {},
        runOptions: {}
    };
}

// -------
// HELPERS
// -------

/**
 * Gets the command line for the build task
 * @returns A promise that resolves to the command line for the build task
 * @see {@link divine.createPackage}
 * @example
 * `divine.exe --game [game] --source [source] --destination [destination]`
 */
async function getCommandLine() {
    // Determine the paths required for the build task
    // ? This probably needs improvement
    const rootFolderUri = await getRootFolderUri();
    const rootFolderPath = rootFolderUri.fsPath;
    const parentFolderPath = rootFolderPath.split('\\').slice(0, -1).join('\\');
    const rootFolderName = rootFolderPath.split('\\').pop();
    // TODO: Make this configurable in the settings
    const outputPath = `${parentFolderPath}\\${rootFolderName}.pak`;

    // Construct the command line for the build task
    return divine.createPackage(rootFolderPath, outputPath);
}
