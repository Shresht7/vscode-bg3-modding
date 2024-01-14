// Helpers
import { attributesGroupName } from "../../../helpers/xml";

// Schemas
import { xmlDeclarationSchema } from "./partials";

// Type Definitions
import type { Schema } from "jsonschema";

// --------
// PARTIALS
// --------

/**
 * The schema for the version element
 * ```xml
 * <version major="1" minor="0" revision="0" build="0" />
 * ```
 */
const versionSchema: Schema = {
    type: "object",
    required: [attributesGroupName],
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: ["major", "minor", "revision", "build"],
            properties: {
                major: { type: "number", minimum: 0 },
                minor: { type: "number", minimum: 0 },
                revision: { type: "number", minimum: 0 },
                build: { type: "number", minimum: 0 },
            }
        }
    }
};

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
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string", const: "ModOrder" },
            }
        },
        children: {
            type: "object",
            required: ["node"],
            properties: {
                node: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [attributesGroupName, "attribute"],
                        properties: {
                            [attributesGroupName]: {
                                type: "object",
                                required: ["id"],
                                properties: {
                                    id: { type: "string", const: "Module" },
                                }
                            },
                            attribute: {
                                type: "object",
                                required: [attributesGroupName],
                                properties: {
                                    [attributesGroupName]: {
                                        type: "object",
                                        required: ["id", "value", "type"],
                                        properties: {
                                            id: { type: "string", const: "UUID" },
                                            value: { type: "string", pattern: "^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$" },
                                            type: { type: "string", const: "FixedString" },
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
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string", const: "Mods" },
            }
        },
        children: {
            type: "object",
            required: ["node"],
            properties: {
                node: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [attributesGroupName, "attribute"],
                        properties: {
                            [attributesGroupName]: {
                                type: "object",
                                required: ["id"],
                                properties: {
                                    id: { type: "string", const: "ModuleShortDesc" },
                                }
                            },
                            attribute: {
                                type: "array",
                                items: {
                                    anyOf: [
                                        {
                                            type: "object",
                                            required: [attributesGroupName],
                                            properties: {
                                                [attributesGroupName]: {
                                                    type: "object",
                                                    required: ["id", "value", "type"],
                                                    properties: {
                                                        id: { type: "string", enum: ["Folder", "MD5", "Name"] },
                                                        value: { type: "string" },
                                                        type: { type: "string", const: "LSString" },
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: [attributesGroupName],
                                            properties: {
                                                [attributesGroupName]: {
                                                    type: "object",
                                                    required: ["id", "value", "type"],
                                                    properties: {
                                                        id: { type: "string", const: "UUID" },
                                                        value: { type: "string", pattern: "^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$" },
                                                        type: { type: "string", const: "FixedString" },
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: [attributesGroupName],
                                            properties: {
                                                [attributesGroupName]: {
                                                    type: "object",
                                                    required: ["id", "value", "type"],
                                                    properties: {
                                                        id: { type: "string", const: "Version64" },
                                                        value: { type: "string" },
                                                        type: { type: "string", const: "int64" },
                                                    }
                                                }
                                            }
                                        },
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
    properties: {
        "?xml": xmlDeclarationSchema,
        save: {
            type: "object",
            required: ["version"],
            properties: {
                version: versionSchema,
                region: {
                    type: "object",
                    required: [attributesGroupName, "node"],
                    properties: {
                        [attributesGroupName]: {
                            type: "object",
                            required: ["id"],
                            properties: {
                                id: { type: "string", const: "ModuleSettings" },
                            }
                        },
                        node: {
                            type: "object",
                            required: [attributesGroupName, "children"],
                            properties: {
                                [attributesGroupName]: {
                                    type: "object",
                                    required: ["id"],
                                    properties: {
                                        id: { type: "string", const: "root" },
                                    }
                                },
                                children: {
                                    type: "object",
                                    required: ["node"],
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
