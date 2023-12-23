// Library
import { webcrypto } from "crypto";

// Helpers
import { bg3, editor } from "../helpers";

/**
 * Generate a random handle
 * and inserts it at the active editor selection
 */
export function generateHandle() {
    const uuid = webcrypto.randomUUID();
    const handle = bg3.convertToHandle(uuid);
    editor.insertAtSelection(handle);
}
