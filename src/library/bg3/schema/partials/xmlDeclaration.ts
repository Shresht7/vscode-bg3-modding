// Helpers
import { attributesGroupName } from "../../../../helpers/xml";

// Type Definitions
import type { Schema } from "jsonschema";

// ---------------
// XML DECLARATION
// ---------------

/** 
 * The schema for the XML declaration line
 * ```xml
 * <?xml version="1.0" encoding="utf-8"?>
 * ```
*/
export const xmlDeclarationSchema: Schema = {
    type: "object",
    required: [attributesGroupName],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: ["version", "encoding"],
            additionalProperties: false,
            properties: {
                version: {
                    type: "number",
                    minimum: 1,
                },
                encoding: {
                    type: "string",
                    enum: ["utf-8", "UTF-8"],
                },
            }
        }
    }
};
