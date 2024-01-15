// Library
import * as vscode from 'vscode';

// ---------
// TEST TASK
// ---------

/** The definition of the test task */
const taskDefinition: vscode.TaskDefinition = {
    type: 'test',
    task: 'test'
};

/** The scope of the test task */
const scope: vscode.TaskScope = vscode.TaskScope.Workspace;

/** The name of the test task */
const name: string = 'test';

/** The source of the test task */
const source: string = 'test';

/** The execution of the test task */
const execution: vscode.ShellExecution = new vscode.ShellExecution('echo "test"');

/** A task that can be run to test the extension */
export const test: vscode.Task = new vscode.Task(
    taskDefinition,
    scope,
    name,
    source,
    execution
);
