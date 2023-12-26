// Library
import * as vscode from 'vscode';
import * as constants from '../../constants';

// ----------
// BUILD TASK
// ----------

export default {
    name: "Build",
    source: constants.EXTENSION_DISPLAY_NAME,
    scope: vscode.TaskScope.Workspace,
    execution: new vscode.ShellExecution("echo \"Hello World!\"")
} as const;

