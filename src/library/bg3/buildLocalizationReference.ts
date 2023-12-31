// Library
import * as vscode from 'vscode';
import { LocalizationHoverProvider } from '../../providers/hover';

// Helpers
import { xml } from '../../helpers';

// Type Definitions
import type { LocalizationXML } from '../../types';

// ----------------------------
// BUILD LOCALIZATION REFERENCE
// ----------------------------

/**
 * Reads localization xml files and adds the handles and
 * their corresponding text content to the references.
 * @param files (Optional) An array of {@link vscode.Uri}s of the localization xml files.
 * If `undefined`, all localization files from the workspace will be used. 
 */
export async function buildLocalizationReference(files?: vscode.Uri[]) {

    // Clear existing localization references
    LocalizationHoverProvider.clearContent();

    // If no argument was passed, get all localization files from the workspace
    // otherwise, use the provided array of file uris
    files = files || await vscode.workspace.findFiles("**/Localization/**/*.xml");

    // Iterate over the files and build the localization references
    for (const file of files) {

        // Parse localization xml
        const localizationXML = await xml.read<LocalizationXML>(file, {
            ignoreDeclaration: true,
            ignoreAttributes: false,
            attributeNamePrefix: "",
            isArray: (tagName, jPath, isLeafNode, isAttribute) => tagName === 'content',
        });

        // Set localization references
        localizationXML.contentList.content.forEach(item => {
            LocalizationHoverProvider.setContent(item["contentuid"], item["#text"]);
        });

    }

}
