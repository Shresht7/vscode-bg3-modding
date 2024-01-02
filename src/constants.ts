// =========
// CONSTANTS
// =========

/** Constants used throughout the project */
const constants = {

    /** ID of the extension. Must match the `package.json` */
    EXTENSION_ID: "bg3-modding",

    /** Publisher */
    // TODO: This might need to change in the future based on availability of the publisher name on the VS Code Marketplace
    PUBLISHER: "Shresht7",

    /** The folder name that contains the Lua workspace library references */
    LUA_REFERENCES_FOLDER: "references",

} as const;

// ----------------------
export default constants;
// ----------------------
