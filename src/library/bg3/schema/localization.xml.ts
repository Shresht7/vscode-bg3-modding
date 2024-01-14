// Helpers
import { attributesGroupName } from "../../../helpers/xml";

// Schemas
import { xmlDeclarationSchema } from "./partials";

// Type Definitions
import type { Schema } from "jsonschema";

/** The schema for localization XML files */
export const localizationXMLSchema: Schema = {
    type: "object",
    required: ["?xml", "contentList"],
    properties: {
        "?xml": xmlDeclarationSchema,
        contentList: {
            type: "object",
            required: ["content"],
            additionalProperties: false,
            properties: {
                content: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            [attributesGroupName]: {
                                type: "object",
                                required: ["contentuid", "version"],
                                properties: {
                                    contentuid: {
                                        type: "string",
                                        pattern: "^h[a-f\\d]{8}(g[a-f\\d]{4}){3}g[a-f\\d]{12}$",
                                    },
                                    version: {
                                        type: "number",
                                        minimum: 0,
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
