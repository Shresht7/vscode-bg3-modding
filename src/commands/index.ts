// Library
import * as vscode from 'vscode';
import * as constants from '../constants';

// ========
// COMMANDS
// ========

import { copyModUUID } from './copyModUUID';
import { generateUUID } from "./generateUUID";
import { generateHandle } from './generateHandle';
import { convertVersionNumber } from './convertVersionNumber';
import { bumpVersionNumber } from './bumpVersionNumber';

/** Registers the command to VS Code */
function registerCommand(command: (...args: any[]) => any): vscode.Disposable {
    return vscode.commands.registerCommand(`${constants.EXTENSION_ID}.${command.name}`, command);
}

/** An array of disposables for the registered commands */
export const commands: vscode.Disposable[] = [
    registerCommand(copyModUUID),
    registerCommand(generateUUID),
    registerCommand(generateHandle),
    registerCommand(convertVersionNumber),
    registerCommand(bumpVersionNumber),
];
