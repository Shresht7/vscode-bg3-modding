// Library
import { webcrypto } from "crypto";
import { bg3 } from "../library";

// Helpers
import { editor } from "../helpers";

// -----------------------
// GENERATE HANDLE COMMAND
// -----------------------

/**
 * Generate a random handle
 * and inserts it at the active editor selection
 */
export function generateHandle() {
    const uuid = webcrypto.randomUUID();
    const handle = bg3.convertToHandle(uuid);
    editor.insertAtSelection(handle);
}
