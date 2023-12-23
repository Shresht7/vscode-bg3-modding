// ====================
// BG3 HELPER FUNCTIONS
// ====================

/**
 * Converts a UUID to a BG3 handle
 * @param uuid The UUID to convert to a handle
 * @returns A BG3 handle (e.g. h853caddag9fb3g4690ga2cfg56bb76f8543d)
 */
export function convertToHandle(uuid: string) {
    return "h" + uuid.replaceAll('-', 'g');
}
