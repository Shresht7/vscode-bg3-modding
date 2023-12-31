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
 * Reads all localization xml files in the workspace and adds the handles and
 * their corresponding text content to the references.
 */
export async function buildLocalizationReference() {
    // TODO: Should probably clear the map here to prevent duplicates, incase this function is called multiple times.
    const files = await vscode.workspace.findFiles("**/Localization/**/*.xml");
    for (const file of files) {
        const localizationXML = await xml.read<LocalizationXML>(file);
        localizationXML.contentList.content.forEach(item => {
            LocalizationHoverProvider.setContent(item["contentuid"], item["#text"]);
        });
    }
}
