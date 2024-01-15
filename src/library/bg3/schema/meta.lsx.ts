// Helpers
import { attributesGroupName } from "../../../helpers/xml";

// Partials 
import {
    attribute,
    id,
    xmlDeclarationSchema,
    versionSchema
} from "./partials";

// Type Definitions
import type { Schema } from "jsonschema";

// --------
// PARTIALS
// --------

//#region Dependencies

/**
 * Schema definitions for the Dependency attributes
 * ```xml
 * <attribute id="Folder" type="LSString" value="MyMod" />
 * <attribute id="MD5" type="LSString" value="..." />
 * <attribute id="Name" type="LSString" value="MyMod" />
 * <attribute id="UUID" type="FixedString" value="..." />
 * <attribute id="Version64" type="int64" value="..." />
 * ```
 */
const NodeDependenciesAttributes: Schema = {
    type: "array",
    items: [
        attribute({ id: "Folder", type: "LSString", value: { type: "string" } }),
        attribute({ id: "MD5", type: "LSString", value: { type: "string" } }),
        attribute({ id: "Name", type: "LSString", value: { type: "string" } }),
        attribute({ id: "UUID", type: "FixedString", value: { type: "string", pattern: "^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$" } }),
        attribute({ id: "Version64", type: "int64", value: { type: "string" } }),
    ]
};

/**
 * Schema definitions for the Dependencies node
 * ```xml
 * <node id="Dependencies">
 *   <children>
 *    <node id="ModuleShortDesc">
 *     <attribute id="Folder" type="LSString" value="MyMod" />  
 *     <attribute id="MD5" type="LSString" value="..." />
 *     <attribute id="Name" type="LSString" value="MyMod" />
 *     <attribute id="UUID" type="FixedString" value="..." />
 *     <attribute id="Version64" type="int64" value="..." />
 *   </node>
 *   ...
 *  </children>
 * </node>
 * ```
 */
const NodeDependencies: Schema = {
    type: "object",
    required: [attributesGroupName],
    properties: {
        [attributesGroupName]: id("Dependencies"),
        children: {
            type: "object",
            required: ["node"],
            additionalProperties: false,
            properties: {
                node: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [attributesGroupName, "attribute"],
                        additionalProperties: false,
                        properties: {
                            [attributesGroupName]: id("ModuleShortDesc"),
                            attribute: NodeDependenciesAttributes
                        }
                    }
                }
            }
        }
    }
};

//#endregion Dependencies
//#region ModuleInfo

/**
 * Schema definitions for the `ModuleInfo` attribute children
 * ```xml
 * ```
 */
const NodeModuleInfoAttributes: Schema = {
    type: "array",
    uniqueItems: true,
    items: {
        anyOf: [
            attribute({ id: "Author", type: "LSWString", value: { type: "string" } }),
            attribute({ id: "CharacterCreationLevelName", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "Description", type: "LSWString", value: { type: "string" } }),
            attribute({ id: "Folder", type: "LSWString", value: { type: "string" } }),
            attribute({ id: "GMTemplate", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "LobbyLevelName", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "MD5", type: "LSString", value: { type: "string" } }),
            attribute({ id: "MainMenuBackgroundVideo", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "MenuLevelName", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "Name", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "NumPlayers", type: "uint8", value: { type: "number" } }),
            attribute({ id: "PhotoBooth", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "StartupLevelName", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "Tags", type: "LSWString", value: { type: "string" } }),
            attribute({ id: "Type", type: "FixedString", value: { type: "string" } }),
            attribute({ id: "UUID", type: "FixedString", value: { type: "string", pattern: "^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$" } }),
            attribute({ id: "Version64", type: "int64", value: { type: "string" } }),
        ]
    }
};

/**
 * Schema definitions for the `ModuleInfo` child: `PublishVersion`
 * ```xml
 * <node id="PublishVersion">
 *  <attribute id="Version64" type="int64" value="..." />
 * </node>
 * ```
 */
const NodeModuleInfoPublishVersion: Schema = {
    type: "object",
    required: [attributesGroupName, "attribute"],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: id("PublishVersion"),
        attribute: attribute({ id: "Version64", type: "int64", value: { type: "string" } }),
    }
};

/**
 * Schema definitions for the `ModuleInfo` child: `Scripts`
 * ```xml
 * <node id="Scripts" />
 * ```
 */
const NodeModuleInfoScripts: Schema = {
    type: "object",
    required: [attributesGroupName],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: id("Scripts")
    }
};

/**
 * Schema definitions for the `ModuleInfo` child: `TargetModes`
 * ```xml
 * <node id="TargetModes">
 *  <children> 
 *   <node id="Target">
 *    <attribute id="Object" type="FixedString" value="Story" />
 *   </node>
 *  </children>
 * </node>
 * ```
 */
const NodeModuleInfoTargetModes: Schema = {
    type: "object",
    required: [attributesGroupName, "children"],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: id("TargetModes"),
        children: {
            type: "object",
            required: ["node"],
            additionalProperties: false,
            properties: {
                node: {
                    type: "object",
                    required: [attributesGroupName, "attribute"],
                    additionalProperties: false,
                    properties: {
                        [attributesGroupName]: id("Target"),
                        attribute: attribute({ id: "Object", type: "FixedString", value: "Story" }),
                    }
                }
            }
        }
    }
};

/**
 * Schema definitions for the `ModuleInfo` node `children`
 * ```xml
 * <node id="PublishVersion">
 *  <attribute id="Version64" type="int64" value="..." />
 * </node>
 * <node id="Scripts" />
 * <node id="TargetModes">
 *  <children>
 *   <node id="Target">
 *    <attribute id="Object" type="FixedString" value="Story" />
 *   </node>
 *  </children>
 * </node>
 * ```
 * @see {@link NodeModuleInfoPublishVersion}
 * @see {@link NodeModuleInfoScripts}
 * @see {@link NodeModuleInfoTargetModes}
 */
const NodeModuleInfoChildren: Schema = {
    type: "object",
    required: ["node"],
    additionalProperties: false,
    properties: {
        node: {
            type: "array",
            items: [
                NodeModuleInfoPublishVersion,
                NodeModuleInfoScripts,
                NodeModuleInfoTargetModes,
            ]
        }
    }
};

/**
 * Schema definitions for the `ModuleInfo` node
 * ```xml
 * <node id="ModuleInfo">
 *   ...[NodeModuleInfoAttributes]
 *   ...[NodeModuleInfoChildren]
 * </node>
 * ```
 * @see {@link NodeModuleInfoAttributes}
 * @see {@link NodeModuleInfoChildren}
 */
const NodeModuleInfo: Schema = {
    type: "object",
    required: [attributesGroupName, "attribute", "children"],
    additionalProperties: false,
    properties: {
        [attributesGroupName]: id("ModuleInfo"),
        attribute: NodeModuleInfoAttributes,
        children: NodeModuleInfoChildren
    }
};

//#endregion ModuleInfo

// ---------------
// META LSX SCHEMA
// ---------------

/**
 * The schema for `meta.lsx` file
 * @see {@link NodeDependencies}
 * @see {@link NodeModuleInfo}
 */
export const metaLSXSchema: Schema = {
    type: "object",
    required: ["?xml", "save"],
    additionalProperties: false,
    properties: {
        "?xml": xmlDeclarationSchema,
        save: {
            type: "object",
            required: ["version", "region"],
            additionalProperties: false,
            properties: {
                version: versionSchema,
                region: {
                    type: "object",
                    required: [attributesGroupName, "node"],
                    additionalProperties: false,
                    properties: {
                        [attributesGroupName]: id("Config"),
                        node: {
                            type: "object",
                            required: [attributesGroupName, "children"],
                            additionalProperties: false,
                            properties: {
                                [attributesGroupName]: id("root"),
                                children: {
                                    type: "object",
                                    required: ["node"],
                                    additionalProperties: false,
                                    properties: {
                                        node: {
                                            type: "array",
                                            items: [
                                                NodeDependencies,
                                                NodeModuleInfo,
                                            ]
                                        }
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
