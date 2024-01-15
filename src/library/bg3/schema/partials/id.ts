// Type Definitions
import { Schema } from "jsonschema";

// ------------
// ID ATTRIBUTE
// ------------

/**
 * Creates a schema that defines an ID attribute.
 * @param name The name of the ID attribute.
 * @param additionalProps Additional properties to add to the schema.
 * @returns The schema that defines an ID attribute.
 */
export const id = (name: string, additionalProps?: Partial<Schema>): Schema => ({
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
        id: {
            type: "string",
            const: name
        }
    },
    ...additionalProps
});
