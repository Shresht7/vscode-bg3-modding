// Library
import * as vscode from 'vscode';

// Tasks
import { test } from './test';

// --------------
// TASKS PROVIDER
// --------------

/** An array of tasks that can be run */
const tasks: vscode.Task[] = [
    test
];

/** A provider that allows tasks to be run */
export const taskProvider = vscode.tasks.registerTaskProvider('test', {
    provideTasks(token) {
        return tasks;
    },
    resolveTask(task, token) {
        return task;
    }
});
