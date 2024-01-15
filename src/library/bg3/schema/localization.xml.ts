// Helpers
import { attributesGroupName } from "../../../helpers/xml";
import { regex } from "../../../constants";

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
 * <content contentuid="UUID" version="1">_Localized-text_</content>
 * ```
 */
const contentSchema: Schema = {
    type: "array",
    items: {
        type: "object",
        required: [attributesGroupName, "#text"],
        additionalProperties: false,
        properties: {
            [attributesGroupName]: {
                type: "object",
                required: ["contentuid", "version"],
                additionalProperties: false,
                properties: {
                    contentuid: {
                        type: "string",
                        pattern: regex.handle.source,
                    },
                    version: {
                        type: "number",
                        minimum: 0,
                    }
                }
            },
            "#text": {
                type: "string",
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
