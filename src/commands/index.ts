// Library
import * as vscode from 'vscode';

// ========
// COMMANDS
// ========

import { generateUUID } from "./generateUUID";
import { generateHandle } from './generateHandle';

/** Enumeration of the command IDs */
enum Command {
    GenerateUUID = "bg3-modding.generateUUID",
    GenerateHandle = "bg3-modding.generateHandle",
}

/** An array of disposables for the registered commands */
export const commands: vscode.Disposable[] = [
    vscode.commands.registerCommand(Command.GenerateUUID, generateUUID),
    vscode.commands.registerCommand(Command.GenerateHandle, generateHandle)
];
