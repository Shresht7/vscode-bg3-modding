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
 * The schema for the content element
 * ```xml
 * <content contentuid="_uuid_" version="1">_Localized-text_</content>
 * ```
 */
const contentSchema: Schema = {
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
};

// -----------------------
// LOCALIZATION XML SCHEMA
// -----------------------

/** The schema for localization XML files */
export const localizationXMLSchema: Schema = {
    type: "object",
    required: ["?xml", "contentList"],
    additionalProperties: false,
    properties: {
        "?xml": xmlDeclarationSchema,
        contentList: {
            type: "object",
            required: ["content"],
            additionalProperties: false,
            properties: {
                content: contentSchema,
            }
        }
    }
};
