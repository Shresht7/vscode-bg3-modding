// Library
import * as vscode from 'vscode';

// ========
// COMMANDS
// ========

import { generateUUID } from "./generateUUID";

/** Enumeration of the command IDs */
enum Command {
    GenerateUUID = "bg3-modding.generateUUID"
}

/** An array of disposables for the registered commands */
export const commands: vscode.Disposable[] = [
    vscode.commands.registerCommand(Command.GenerateUUID, generateUUID)
];
