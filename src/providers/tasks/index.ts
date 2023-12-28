// Library
import * as vscode from 'vscode';

// ==============
// TASKS PROVIDER
// ==============

import { createBuildTask } from './build';

// ------------------
const type = "build";
// ------------------

export function registerTaskProvider(context: vscode.ExtensionContext): vscode.Disposable {

    const build = createBuildTask(context);

    return vscode.tasks.registerTaskProvider(type, {
        provideTasks(token) {
            return [
                build
            ];
        },
        resolveTask(task, token) {
            return task;
        }
    });
}
