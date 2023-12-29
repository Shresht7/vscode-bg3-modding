// Library
import { XMLParser } from "fast-xml-parser";

// Helpers
import { fs } from '../helpers';

// Type Definitions
import type {
    Meta as MetaDefinition,
    ModuleInfoAttribute,
    NodeDependencies,
    NodeDependencyAttribute,
    NodeModuleInfo
} from "../types";

// ----------------------
// META.LSX CONFIGURATION
// ----------------------

/** Get metadata from the `meta.lsx` file */
export async function getMetadata(): Promise<MetaLSX> {

    // Get `meta.lsx` contents
    const contents = await fs.getMetaLsxContents();

    // Parse the XML data
    // Parse the xml data with the provided options ...
    const meta = new XMLParser({
        ignoreDeclaration: true,    // ignore the ?xml declaration at the top
        ignoreAttributes: false,    // do not ignore attributes as they hold valuable information
        attributeNamePrefix: "",    // do not prefix attributes with any special characters
        parseAttributeValue: true,  // parse attribute values as strings, number and booleans
        isArray(tagName, jPath, isLeafNode, isAttribute) {
            // single elements under `children.node` and `node.attribute` are part of an array
            return jPath.endsWith('children.node') || jPath.endsWith('node.attribute');
        }
    }).parse(contents) as MetaDefinition;

    return {
        /** The dependencies as specified in the `meta.lsx` file */
        get Dependencies(): Dependency[] {
            /** An array to contain the dependencies */
            const dependencies: Dependency[] = [];

            // Iterate over the dependencies specified in the `meta.lsx` and push them to the dependencies array
            const deps = meta.save.region.node.children.node.find(n => n.id === 'Dependencies') as NodeDependencies;
            if (deps?.children?.node?.length) {
                for (const node of deps.children.node) {
                    // Convert the dependency attributes array to an object directly mapping the id to the value
                    const entries = node.attribute.map(a => [a.id, a.value]);
                    dependencies.push(Object.fromEntries(entries));
                }
            }

            return dependencies;
        },

        /** The module information as specified in the `meta.lsx` file */
        get ModuleInfo(): ModuleInfo {
            // Retrieve the ModuleInfo from the parsed xml data
            const moduleInfo = meta.save.region.node.children.node.find(n => n.id === 'ModuleInfo') as NodeModuleInfo;
            // Create a proxy object so that the attributes can be accessed directly using dot notation
            return new Proxy(moduleInfo, {
                get(target, property: ModuleInfoAttribute["id"], receiver) {
                    return target.attribute.find(a => a.id === property)?.value;
                },
            }) as unknown as ModuleInfo;
        }
    };
}

// ----------------
// TYPE DEFINITIONS
// ----------------

export type MetaLSX = {
    Dependencies: Dependency[],
    ModuleInfo: ModuleInfo,
};

export type ModuleInfo = {
    [k in ModuleInfoAttribute["id"]]: Extract<ModuleInfoAttribute, { id: k }>["value"]
};

export type Dependency = {
    [k in NodeDependencyAttribute["id"]]: Extract<NodeDependencyAttribute, { id: k }>["value"]
};
