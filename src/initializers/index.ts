// Library
import { initializeCommands } from './commands';
import { initializeLocalization } from './localization';

// ============
// INITIALIZERS
// ============

export const initialize = {
    localization: initializeLocalization,
    commands: initializeCommands,
};
