// Library
import * as vscode from 'vscode';
import { bg3 } from '../library';

// ------------
// LOCALIZATION
// ------------

/** Initializes the localization contributions provided by the extension */
export function initializeLocalization() {

    // Build localization references from xml files in the workspace on extension activation
    bg3.buildLocalizationReference();

    // Initialize the localization file-system watcher
    initializeLocalizationFSWatcher();

}

// LOCALIZATION FS-WATCHER
// -----------------------

/**
 * Initialize the localization file-system watcher
 * 
 * This watches for file-system changes for localization xml files in the workspace
 * and rebuilds the localization references for the {@link LocalizationHoverProvider}.
 */
function initializeLocalizationFSWatcher() {

    // Create a file-watcher for the xml localization files
    const localizationXMLFileWatcher = vscode.workspace.createFileSystemWatcher("**/Localization/**/*.xml");

    // Build localization references when a new xml is created
    localizationXMLFileWatcher.onDidCreate(e => {
        bg3.buildLocalizationReference([e]);
    });

    // Rebuild localization references when a xml is changed
    // ? Performance concerns?
    localizationXMLFileWatcher.onDidChange(e => {
        bg3.buildLocalizationReference([e]);
    });

    // Remove localization references when a xml is deleted
    localizationXMLFileWatcher.onDidDelete(e => {
        // Since this clears the references anyway, rebuilding the entire thing will effectively remove
        // the localization handles from the deleted file. A little excessive, but very straightforward
        // considering deletion of localization xml files shouldn't be a common occurrence.
        bg3.buildLocalizationReference();
    });

}
