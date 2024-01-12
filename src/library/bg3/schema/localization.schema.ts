// Constants
import { attributeGroupName } from "./_constants";

// Type Definitions
import type { Schema } from "jsonschema";

/** The schema for localization XML files */
export const localizationXMLSchema: Schema = {
    type: "object",
    required: ["?xml", "contentList"],
    properties: {
        "?xml": {
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
        },
        contentList: {
            type: "object",
            required: ["content"],
            properties: {
                content: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            [attributeGroupName]: {
                                type: "object",
                                required: ["contentuid", "version"],
                                properties: {
                                    contentuid: {
                                        type: "string",
                                        pattern: "^h[a-f\\d]{8}(g[a-f\\d]{4}){3}g[a-f\\d]{12}$",
                                    },
                                    version: {
                                        type: "number",
                                    },
                                    "#text": {
                                        type: "string",
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
