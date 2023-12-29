// Library
import { XMLParser } from "fast-xml-parser";

// Type Definitions
import type {
    Meta as MetaDefinition,
    ModuleInfoAttribute,
    ModuleInfoAttributeID,
    NodeDependencies,
    NodeModuleInfo
} from "../types";

// ----------------------
// META.LSX CONFIGURATION
// ----------------------

/** A representation of the `meta.lsx` metadata file */
export class MetaLSX {

    /** The xml data parsed from the `meta.lsx` file */
    private readonly _meta: MetaDefinition;

    /** Parses the `meta.lsx` contents */
    constructor(contents: string) {
        // Parse the xml data with the provided options ...
        this._meta = new XMLParser({
            ignoreDeclaration: true,    // ignore the ?xml declaration at the top
            ignoreAttributes: false,    // do not ignore attributes as they hold valuable information
            attributeNamePrefix: "",    // do not prefix attributes with any special characters
            parseAttributeValue: true,  // parse attribute values as strings, number and booleans
            isArray(tagName, jPath, isLeafNode, isAttribute) {
                // single elements under `children.node` and `node.attribute` are part of an array
                return jPath.endsWith('children.node') || jPath.endsWith('node.attribute');
            }
        }).parse(contents);
    }

    /** The dependencies as specified in the `meta.lsx` file */
    get dependencies(): NodeDependencies {
        return this._meta.save.region.node.children.node.find(n => n.id === 'Dependencies') as NodeDependencies;
    }

    /** The module information as specified in the `meta.lsx` file */
    get moduleInfo() {
        // Retrieve the ModuleInfo from the parsed xml data
        const moduleInfo = this._meta.save.region.node.children.node.find(n => n.id === 'ModuleInfo') as NodeModuleInfo;
        // Create a proxy object so that the attributes can be accessed directly using dot notation
        return new Proxy(moduleInfo, {
            get(target, property: ModuleInfoAttributeID, receiver) {
                return target.attribute.find(a => a.id === property);
            },
        }) as unknown as ModuleInfo;
    }

}

/** Direct mappings from ModuleInfoAttributeID to their corresponding ModuleInfoAttribute */
type ModuleInfo = {
    [k in ModuleInfoAttributeID]: ModuleInfoAttribute<k>
};
