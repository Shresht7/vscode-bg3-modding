// Library
import * as vscode from 'vscode';

// Helpers
import { bg3, editor } from '../helpers';

/** Convert Int64 version number to string format or vice-versa */
export async function generateVersionNumber() {

    // Prompt the user for the version number
    const v = await vscode.window.showInputBox({
        title: "Version",
        prompt: "Version Number",
        placeHolder: 'Example: 1.0.0.0 or 36028797018963968',
        validateInput: (value) => {
            if (value.includes(".")) { // String version format (1.0.0.0)
                if (!(/\d+\.\d+\.\d+\.\d+/.test(value))) { // Try parsing major.minor.revision.build
                    return "Invalid Version Number! Format: {Major}.{Minor}.{Revision}.{Build}";
                }
            } else { // BigInt format (36028797018963968)
                try {
                    BigInt(value);  // Try parsing as BigInt ...
                } catch (e) { // ... if that fails, the input is invalid as it doesn't match either format
                    return "Invalid Version Number! Example: 1.0.0.0 or 36028797018963968";
                }
            }
        }
    });

    // Return early if the input is empty
    if (!v) { return; }

    // Convert the version from one format to the other
    const result = v.includes(".")
        ? new bg3.Version(v).toInt64().toString()
        : new bg3.Version(BigInt(v)).toString();

    // Insert the version at the cursor selection
    editor.insertAtSelection(result);
}
