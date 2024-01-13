// Constants
import { attributeGroupName } from "./_constants";

// Type Definitions
import type { Schema } from "jsonschema";

const xmlDeclarationSchema: Schema = {
    type: "object",
    properties: {
        [attributeGroupName]: {
            type: "object",
            required: ["version", "encoding"],
            properties: {
                version: { type: "number" },
                encoding: { type: "string" },
            }
        }
    }
};

const versionSchema: Schema = {
    type: "object",
    required: [attributeGroupName],
    properties: {
        [attributeGroupName]: {
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

const ModOrderSchema: Schema = {
    type: "object",
    required: [attributeGroupName, "children"],
    properties: {
        [attributeGroupName]: {
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
                        required: [attributeGroupName, "attribute"],
                        properties: {
                            [attributeGroupName]: {
                                type: "object",
                                required: ["id"],
                                properties: {
                                    id: { type: "string", const: "Module" },
                                }
                            },
                            attribute: {
                                type: "object",
                                required: [attributeGroupName],
                                properties: {
                                    [attributeGroupName]: {
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

const ModsSchema: Schema = {
    type: "object",
    required: [attributeGroupName, "children"],
    properties: {
        [attributeGroupName]: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string", const: "Mods" },
            }
        },
        children: {}
    }
};

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
                    required: [attributeGroupName, "node"],
                    properties: {
                        [attributeGroupName]: {
                            type: "object",
                            required: ["id"],
                            properties: {
                                id: { type: "string", const: "ModuleSettings" },
                            }
                        },
                        node: {
                            type: "object",
                            required: [attributeGroupName, "children"],
                            properties: {
                                [attributeGroupName]: {
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
