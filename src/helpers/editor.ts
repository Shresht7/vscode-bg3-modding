// Library
import * as vscode from 'vscode';

// =======================
// EDITOR HELPER FUNCTIONS
// =======================

/**
 * Inserts the given text at the active cursor location
 * @param text The text to insert at the active cursor location
 */
export function insertAtCursorLocation(text: string) {
    const editor = vscode.window.activeTextEditor;
    editor?.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, text);
    });
}
