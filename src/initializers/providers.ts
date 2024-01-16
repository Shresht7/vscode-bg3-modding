// Library
import * as vscode from 'vscode';

// Tasks
import { initializeTaskProvider } from '../providers/tasks';

// ---------
// PROVIDERS
// ---------

/** Initializes the providers contributions provided by the extension */
export async function initializeProviders(context: vscode.ExtensionContext) {
    // Register the task provider
    initializeTaskProvider(context);
}
