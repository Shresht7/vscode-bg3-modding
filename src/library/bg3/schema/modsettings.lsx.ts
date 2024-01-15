// Helpers
import { attributesGroupName } from "../../../helpers/xml";
import { regex } from "../../../constants";

// Schemas
import { xmlDeclarationSchema, versionSchema, id, attribute } from "./partials";

// Type Definitions
import type { Schema } from "jsonschema";

// --------
// PARTIALS
// --------

/**
 * The schema for the ModOrder node
 * ```xml
 * <node id="ModOrder">
 *   <children>
 *    <node id="Module">
 *      <attribute id="UUID1" type="FixedString" />
 *    </node>
 *    <node id="Module">
 *      <attribute id="UUID2" type="FixedString" />
 *    </node>
 *    ...
 *  </children>
 * </node>
 * ```
 */
const ModOrderSchema: Schema = {
    type: "object",
    required: [attributesGroupName, "children"],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: id("ModOrder"),
        children: {
            type: "object",
            required: ["node"],
            additionalProperties: false,
            properties: {
                node: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [attributesGroupName, "attribute"],
                        additionalProperties: false,
                        properties: {
                            [attributesGroupName]: id("Module"),
                            attribute: attribute({
                                id: "UUID",
                                type: "FixedString",
                                value: { type: "string", pattern: regex.UUID.source }
                            })
                        }
                    }
                }
            }
        }
    }
};

/**
 * The schema for the Mods node
 * ```xml
 * <node id="Mods">
 *   <children>
 *     <node id="ModuleShortDesc">
 *       <attribute id="Folder" value="string" type="LSString" />
 *       <attribute id="MD5" value="string" type="LSString" />
 *       <attribute id="Name" value="string" type="LSString" />
 *       <attribute id="UUID" value="UUID" type="FixedString" />
 *       <attribute id="Version" value="string" type="Version64" />
 *     </node>
 *     ...
 *   </children>
 * </node>
 * ```
 */
const ModsSchema: Schema = {
    type: "object",
    required: [attributesGroupName, "children"],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: id("Mods"),
        children: {
            type: "object",
            required: ["node"],
            additionalProperties: false,
            properties: {
                node: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [attributesGroupName, "attribute"],
                        additionalProperties: false,
                        properties: {
                            [attributesGroupName]: id("ModuleShortDesc"),
                            attribute: {
                                type: "array",
                                items: {
                                    anyOf: [
                                        attribute({ id: "Folder", type: "LSString", value: { type: "string" } }),
                                        attribute({ id: "MD5", type: "LSString", value: { type: "string" } }),
                                        attribute({ id: "Name", type: "LSString", value: { type: "string" } }),
                                        attribute({ id: "UUID", type: "FixedString", value: { type: "string", pattern: regex.UUID.source } }),
                                        attribute({ id: "Version64", type: "int64", value: { type: "string" } })
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

// -----------------------
// MOD SETTINGS LSX SCHEMA
// -----------------------

/** The schema for `modsettings.lsx` file */
export const modsettingsLSXSchema: Schema = {
    type: "object",
    required: ["?xml", "save"],
    additionalProperties: false,
    properties: {
        "?xml": xmlDeclarationSchema,
        save: {
            type: "object",
            required: ["version", "region"],
            additionalProperties: false,
            properties: {
                version: versionSchema,
                region: {
                    type: "object",
                    required: [attributesGroupName, "node"],
                    additionalProperties: false,
                    properties: {
                        [attributesGroupName]: id("ModuleSettings"),
                        node: {
                            type: "object",
                            required: [attributesGroupName, "children"],
                            additionalProperties: false,
                            properties: {
                                [attributesGroupName]: id("root"),
                                children: {
                                    type: "object",
                                    required: ["node"],
                                    additionalProperties: false,
                                    properties: {
                                        node: {
                                            type: "array",
                                            items: [
                                                ModOrderSchema,
                                                ModsSchema
                                            ],
                                            uniqueItems: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
