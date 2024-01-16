// ========
// COMMANDS
// ========

import { copyModUUID } from './copyModUUID';
import { generateUUID } from "./generateUUID";
import { generateHandle } from './generateHandle';
import { convertVersionNumber } from './convertVersionNumber';
import { bumpVersionNumber } from './bumpVersionNumber';
import { initializeLuaConfiguration } from './initializeLuaConfiguration';


/** An array of disposables for the registered commands */
export const commands = [
    copyModUUID,
    generateUUID,
    generateHandle,
    convertVersionNumber,
    bumpVersionNumber,
    initializeLuaConfiguration,
];
