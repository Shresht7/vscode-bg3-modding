// Library
import { webcrypto } from "crypto";

// Helpers
import { editor } from "../helpers";

/**
 * Generate a random v4 UUID
 * and inserts it at the active editor selection
 */
export function generateUUID() {
    const uuid = webcrypto.randomUUID();
    editor.insertAtSelection(uuid);
}
