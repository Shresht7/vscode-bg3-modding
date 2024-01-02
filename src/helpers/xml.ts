// Library
import * as vscode from 'vscode';
import { XMLBuilder, XMLParser, X2jOptions, XmlBuilderOptions } from "fast-xml-parser";

// --------------------
// XML HELPER FUNCTIONS
// --------------------

// DEFAULT OPTIONS
// ---------------

/** Default options for the XML parser */
const defaultParserOptions: Partial<X2jOptions> = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
};

/** Default options for the XML builder */
const defaultBuilderOptions: Partial<XmlBuilderOptions> = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
};

/**
 * Reads the xml file at the given path and parses it as an object
 * @param path The path (vscode.Uri) of the xml file to read
 * @param options {@link X2jOptions} - (Default: {@link defaultParserOptions})
 * @returns The parsed XML object
 */
export async function read<T extends Record<string, any>>(
    path: vscode.Uri,
    options: Partial<X2jOptions> = defaultParserOptions
): Promise<T> {
    const buf = await vscode.workspace.fs.readFile(path);
    const contents = Buffer.from(buf).toString('utf8');
    return new XMLParser(options).parse(contents) as T;
}

/**
 * Builds and writes the object as xml to the given path
 * @param path The path (vscode.Uri) of the xml file to write to
 * @param obj The object to convert to xml
 * @param options {@link XmlBuilderOptions} - (Default: {@link defaultBuilderOptions})
 */
export async function write<T extends Record<string, any>>(
    path: vscode.Uri,
    obj: T,
    options: Partial<XmlBuilderOptions> = defaultBuilderOptions
) {
    const contents = new XMLBuilder(options).build(obj);
    const buf = Buffer.from(contents, 'utf8');
    return vscode.workspace.fs.writeFile(path, buf);
}
