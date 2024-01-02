// Library
import * as vscode from 'vscode';
import { EXTENSION_ID } from '../constants';

// ========
// COMMANDS
// ========

import { copyModUUID } from './copyModUUID';
import { generateUUID } from "./generateUUID";
import { generateHandle } from './generateHandle';
import { convertVersionNumber } from './convertVersionNumber';
import { bumpVersionNumber } from './bumpVersionNumber';
import { initializeLuaConfiguration } from './luaConfiguration';

/** Registers the command to VS Code */
function registerCommand(command: (...args: any[]) => any): vscode.Disposable {
    return vscode.commands.registerCommand(`${EXTENSION_ID}.${command.name}`, command);
}

/** An array of disposables for the registered commands */
export const commands: vscode.Disposable[] = [
    registerCommand(copyModUUID),
    registerCommand(generateUUID),
    registerCommand(generateHandle),
    registerCommand(convertVersionNumber),
    registerCommand(bumpVersionNumber),
    registerCommand(initializeLuaConfiguration)
];
