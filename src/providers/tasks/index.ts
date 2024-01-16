// Library
import * as vscode from 'vscode';

// Tasks
import { createTestTask } from './test';

// --------------
// TASKS PROVIDER
// --------------

/**
 * Initializes the {@link vscode.Task | tasks} provided by the extension
 * by passing in the {@link vscode.ExtensionContext | extension context}
 * @param context The extension context (see {@linkcode vscode.ExtensionContext})
 * @returns A promise that resolves to a collection of tasks to be registered by the task provider
 * @see {@link vscode.Task}
 */
async function initializeTasks(context: vscode.ExtensionContext): Promise<vscode.Task[]> {
    return [
        // Test Task
        await createTestTask(context)
    ];
}

/**
 * Initializes the tasks provider contribution provided by the extension
 * @param context The extension context (see {@linkcode vscode.ExtensionContext})
 * @see {@link vscode.TaskProvider}
 */
export async function initializeTaskProvider(context: vscode.ExtensionContext) {

    // Get the tasks
    const tasks = await initializeTasks(context);

    // Register the task provider
    context.subscriptions.push(
        vscode.tasks.registerTaskProvider('test', {
            provideTasks(token) {
                return tasks;
            },
            resolveTask(task, token) {
                return task;
            }
        })
    );

}
