// Library
import { initializeDiagnostics } from './diagnostics';
import { initializeLocalization } from './localization';
import { initializeProviders } from './providers';

// ============
// INITIALIZERS
// ============

export const initialize = {
    diagnostics: initializeDiagnostics,
    localization: initializeLocalization,
    providers: initializeProviders
};
