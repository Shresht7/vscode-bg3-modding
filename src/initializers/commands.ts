// Library
import * as vscode from "vscode";
import { commands } from "../commands";
import { EXTENSION_ID } from "../constants";

// ========
// COMMANDS
// ========

/** Register all the commands */
export async function initializeCommands(context: vscode.ExtensionContext) {
    commands.forEach(command => {
        const id = `${EXTENSION_ID}.${command.name}`;
        context.subscriptions.push(
            vscode.commands.registerCommand(id, command)
        );
    });
}
