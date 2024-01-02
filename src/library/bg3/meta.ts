// Library
import * as vscode from 'vscode';
import * as fs from './fs';
import { xml } from '../../helpers';

// Type Definitions
import type {
    Meta as MetaDefinition,
    ModuleInfoAttribute,
    NodeDependencies,
    NodeDependencyAttribute,
    NodeModuleInfo
} from "../../types";

// ----------------------
// META.LSX CONFIGURATION
// ----------------------

export class MetaLsx {

    /** The dependencies as specified in the `meta.lsx` file */
    Dependencies: Dependency[] = [];

    /** The module information as specified in the `meta.lsx` file */
    ModuleInfo: ModuleInfo = {} as ModuleInfo;

    /** Regular expressions to match the version line in `meta.lsx` */
    readonly versionRegex: RegExp = /\s*<attribute\s+id="Version64"\s+type="int64"\s+value="(\d+)"\s*\/>/;

    constructor(
        /** Uri of the `meta.lsx` file */
        private path?: vscode.Uri
    ) { }

    /**
     * Finds the `meta.lsx` file in the workspace and returns its {@link vscode.Uri}
     * @returns The Uri of the `meta.lsx` file
     */
    public async find(): Promise<vscode.Uri> {
        const paths = await vscode.workspace.findFiles("**/meta.lsx");
        if (!paths?.length) { throw new Error("Failed to find the `meta.lsx` file"); }
        this.path = paths[0];
        return this.path;
    }

    /** @returns The file contents of the `meta.lsx` file */
    public async getContents(): Promise<string> {
        if (!this.path) { this.path = await this.find(); }
        const buf = await vscode.workspace.fs.readFile(this.path);
        const contents = Buffer.from(buf).toString("utf8");
        return contents;
    }

    /**
     * Writes the provided contents to the `meta.lsx` file
     * @param contents The contents to write to the `meta.lsx` file
     */
    public async setContents(contents: string): Promise<void> {
        if (!this.path) { this.path = await this.find(); }
        const buf = Buffer.from(contents, "utf8");
        await vscode.workspace.fs.writeFile(this.path, buf);
    }

    /** Parse the metadata from the given contents of the `meta.lsx` file */
    public async parse(): Promise<this> {
        if (!this.path) { this.path = await this.find(); }
        const _meta = await xml.read<MetaDefinition>(this.path, {
            ignoreDeclaration: true,    // ignore the ?xml declaration at the top
            ignoreAttributes: false,    // do not ignore attributes as they hold valuable information
            attributeNamePrefix: "",    // do not prefix attributes with any special characters
            parseAttributeValue: true,  // parse attribute values as strings, number and booleans
            isArray(tagName, jPath, isLeafNode, isAttribute) {
                // single elements under `children.node` and `node.attribute` are part of an array
                return jPath.endsWith('children.node') || jPath.endsWith('node.attribute');
            }
        });
        this.Dependencies = this.parseDependencies(_meta);
        this.ModuleInfo = this.parseModuleInfo(_meta);
        return this;
    }

    /** The dependencies as specified in the `meta.lsx` file */
    private parseDependencies(meta: MetaDefinition) {
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
    }

    /** The module information as specified in the `meta.lsx` file */
    private parseModuleInfo(meta: MetaDefinition): ModuleInfo {
        const moduleInfo = meta.save.region.node.children.node.find(n => n.id === 'ModuleInfo') as NodeModuleInfo;
        const entries = moduleInfo.attribute.map(a => [a.id, a.value]);
        return Object.fromEntries(entries);
    }

}

// ----------------------------------
export const metaLsx = new MetaLsx();
// ----------------------------------

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
