// Helpers
import { attributesGroupName } from "../../../../helpers/xml";

// Type Definitions
import type { Schema } from "jsonschema";

// ---------------
// VERSION ELEMENT
// ---------------

/** 
 * The schema for the version element
 * ```xml
 * <version major="1" minor="0" revision="0" build="0" />
 * ```
*/
export const versionSchema: Schema = {
    type: "object",
    required: [attributesGroupName],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: {
            type: "object",
            required: ["major", "minor", "revision", "build"],
            additionalProperties: false,
            properties: {
                major: {
                    type: "number",
                    minimum: 0,
                },
                minor: {
                    type: "number",
                    minimum: 0,
                },
                revision: {
                    type: "number",
                    minimum: 0,
                },
                build: {
                    type: "number",
                    minimum: 0,
                }
            }
        }
    }
};
