// Type Definitions
import { Schema } from "jsonschema";

// ------------
// ID ATTRIBUTE
// ------------

/**
 * Creates a schema that defines the `id` attribute
 * @param name The value of the `id` attribute to use
 * @param additionalProps any additional properties to add to the schema
 * @returns The schema that defines the `id` attribute
 * @example
 * ```xml
 * <element id="Folder" />
 * ```
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
