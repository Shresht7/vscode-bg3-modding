// Library
import * as vscode from 'vscode';
import { PUBLISHER, EXTENSION_ID } from '../constants';

// -----------
// FILE-SYSTEM
// -----------

/**
 * Get the path to the extension's directory
 * @returns {Promise<string>} The path to the extension's directory
 * @throws {Error} If the extension is not found
 * @example
 * const extensionPath = await getExtensionPath();
 * const pathToMyFile = path.join(extensionPath, 'myFile.txt');
 */
export async function getExtensionPath(): Promise<string> {
    const extension = vscode.extensions.getExtension(`${PUBLISHER}.${EXTENSION_ID}`);
    if (!extension) {
        throw new Error('Extension not found');
    }
    return extension.extensionPath;
}
