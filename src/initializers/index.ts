// Library
import { initializeDiagnostics } from './diagnostics';
import { initializeCommands } from './commands';
import { initializeLocalization } from './localization';
import { initializeProviders } from './providers';

// ============
// INITIALIZERS
// ============

export const initialize = {
    diagnostics: initializeDiagnostics,
    localization: initializeLocalization,
    providers: initializeProviders,
    commands: initializeCommands,
};
