// Helpers
import { attributesGroupName } from "../../../../helpers/xml";

// Type Definitions
import type { Schema } from "jsonschema";

// ---------------
// XML DECLARATION
// ---------------

export const xmlDeclarationSchema: Schema = {
    type: "object",
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: ["version", "encoding"],
            properties: {
                version: { type: "number" },
                encoding: { type: "string" },
            }
        }
    }
};
