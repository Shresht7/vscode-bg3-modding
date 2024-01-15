// Helpers
import { attributesGroupName } from '../../../../helpers/xml';

// Type Definitions
import type { Schema } from 'jsonschema';

// -----------------
// ATTRIBUTE ELEMENT
// -----------------

/**
 * Create a schema for an attribute element
 * @param obj The object to use as the schema for the attribute
 * @returns The schema for an attribute element
 * @example
 * ```xml
 * <attribute id="Folder" type="LSString" value="MyMod" />
 * ```
 */
export const attribute = (obj: Record<string, string | Schema>): Schema => ({
    type: "object",
    required: [attributesGroupName],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: Object.keys(obj),
            additionalProperties: false,
            properties: Object.entries(obj).reduce((acc, [key, value]) => {
                acc[key] = typeof value === "string"
                    ? { type: "string", const: value }
                    : value;
                return acc;
            }, {} as Record<string, Schema>)
        }
    }
});
