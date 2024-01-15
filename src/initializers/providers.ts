// Library
import * as vscode from 'vscode';

// Tasks
import { taskProvider } from '../providers/tasks';

// ---------
// PROVIDERS
// ---------

/** Initializes the providers contributions provided by the extension */
export function initializeProviders(context: vscode.ExtensionContext) {
    // Register the task provider
    context.subscriptions.push(
        taskProvider
    );
}
