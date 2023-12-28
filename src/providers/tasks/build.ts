// Library
import * as vscode from 'vscode';
import * as path from 'node:path';
import * as constants from '../../constants';

// ----------
// BUILD TASK
// ----------

export function createBuildTask(context: vscode.ExtensionContext): vscode.Task {

    /** Path to the build script */
    const buildScriptPath = path.join(context.extensionPath, "scripts", "build.ps1");

    const execution = new vscode.ShellExecution(`. ${buildScriptPath}`);

    return new vscode.Task(
        { type: "build" },
        vscode.TaskScope.Workspace,
        "Build",
        constants.EXTENSION_DISPLAY_NAME,
        execution
    );

}
