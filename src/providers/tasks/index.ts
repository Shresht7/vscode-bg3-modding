// Library
import * as vscode from 'vscode';

// ==============
// TASKS PROVIDER
// ==============

import build from './build';

// ------------------
const type = "build";
// ------------------

/** The list of tasks for this provider */
const tasks = [
    build
];

export default vscode.tasks.registerTaskProvider(type, {

    provideTasks(token) {
        return tasks.map(task => new vscode.Task(
            { type },
            task.scope,
            task.name,
            task.source,
            task.execution
        ));
    },

    resolveTask(task, token) {
        return task;
    }

});
