// Library
import * as vscode from 'vscode';

// ---------
// TEST TASK
// ---------

/**
 * Creates a test {@link vscode.Task | task}
 * @param context The extension context (see {@linkcode vscode.ExtensionContext})
 * @returns A promise that resolves to a test {@link vscode.Task | task}
 * @see {@link vscode.Task}
 */
export async function createTestTask(context: vscode.ExtensionContext): Promise<vscode.Task> {

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

    // Instantiate and return the vscode.Task
    return new vscode.Task(
        taskDefinition,
        scope,
        name,
        source,
        execution
    );
}
