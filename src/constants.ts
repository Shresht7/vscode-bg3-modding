// =========
// CONSTANTS
// =========

/** ID of the extension. Must match the `package.json` */
export const EXTENSION_ID = "bg3-modding";

/** The folder name that contains the Lua workspace library references */
export const LUA_REFERENCES_FOLDER = "references";

/** Regular Expressions */
export const regex = {

    /**
     * Regular expression to match a UUID
     * @example `cb97ae42-18b7-4507-8f59-c1628de636a9`
     * @example `6aa62750-0219-4ba2-b18d-f7e946b44485`
     */
    UUID: /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/ig,

    /**
     * Regular expression to match a localization handle
     * @example `hcb97ae42g18b7g4507g8f59gc1628de636a9`
     * @example `h6aa62750g0219g4ba2gb18dgf7e946b44485`
     */
    handle: /^h[a-f\d]{8}g([a-f\d]{4}g){3}[a-f\d]{12}$/ig

};
