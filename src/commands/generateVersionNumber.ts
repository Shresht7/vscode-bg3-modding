// Library
import * as vscode from 'vscode';

// Helpers
import { bg3, editor } from '../helpers';

export async function generateVersionNumber() {

    const v = await vscode.window.showInputBox({
        title: "Version",
        prompt: "The version number string",
        placeHolder: '1.0.0.0',
        validateInput: (value) => {
            if (!(/\d\.\d\.\d\.\d/.test(value))) {
                return "Invalid Version Number! Format: {Major}.{Minor}.{Revision}.{Build}";
            }
        }
    });

    if (!v) { return; };

    const version = new bg3.Version(v);
    const result = version.toInt64().toString();

    editor.insertAtSelection(result);
}
