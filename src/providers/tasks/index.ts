// Library
import * as vscode from 'vscode';

// --------------
// TASKS PROVIDER
// --------------

export const taskProvider = vscode.tasks.registerTaskProvider('test', {
    provideTasks(token) {
        const task = new vscode.Task(
            { type: 'test', task: 'test' },
            vscode.TaskScope.Workspace,
            'test',
            'test',
            new vscode.ShellExecution('echo "test"')
        );
        return [task];
    },

    resolveTask(task, token) {
        return task;
    }
});
