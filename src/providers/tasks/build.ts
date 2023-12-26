// Library
import * as vscode from 'vscode';

export default {
    name: "Build",
    source: "myExtension",
    scope: vscode.TaskScope.Workspace,
    execution: new vscode.ShellExecution("echo \"Hello World!\"")
} as const;

