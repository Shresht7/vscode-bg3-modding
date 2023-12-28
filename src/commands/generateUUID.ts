// Library
import * as vscode from 'vscode';
import { webcrypto } from "crypto";

// Helpers
import { editor } from "../helpers";

// ---------------------
// GENERATE UUID COMMAND
// ---------------------

/**
 * Generate a random v4 UUID
 * and inserts it at the active editor selection
 */
export function generateUUID(context?: vscode.ExtensionContext) {
    const uuid = webcrypto.randomUUID();
    editor.insertAtSelection(uuid);
}
