// Library
import * as vscode from 'vscode';

// =======================
// EDITOR HELPER FUNCTIONS
// =======================

/**
 * Inserts the given text at the active selection.
 * This will overwrite the selection. If no selection has been
 * made, then it will simply insert the text at the cursor location.
 * @param text The text to insert
 */
export function insertAtSelection(text: string) {
    const editor = vscode.window.activeTextEditor;
    editor?.edit(editBuilder => {
        if (editor.selection.isEmpty) {
            editBuilder.insert(editor.selection.active, text);
        } else {
            editBuilder.replace(editor.selection, text);
        }
    });
}
