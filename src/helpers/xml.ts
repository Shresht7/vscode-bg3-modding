// Library
import * as vscode from 'vscode';
import { XMLBuilder, XMLParser, X2jOptions, XmlBuilderOptions } from "fast-xml-parser";

// --------------------
// XML HELPER FUNCTIONS
// --------------------

// DEFAULT OPTIONS
// ---------------

/** The key name of the attributes group to be used with the XML parser */
export const attributesGroupName = "_@_";

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

// FILE-SYSTEM OPERATIONS
// ----------------------

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

// DETERMINE POSITION FROM PATH
// ----------------------------

/**
 * Determines the line number, column-start and column-end numbers of the {@linkcode path} in the {@linkcode document}
 * @param document The document to search through (as an array of strings)
 * @param path The path to the property represented as an array (e.g. `["root", "property", 1, "value"]`)
 * @returns The line number, column start and column end numbers (if possible) corresponding to the {@linkcode path}
 */
export function determinePositionFromPath(document: string[], path: (string | number)[]): {
    line: number,
    colStart?: number,
    colEnd?: number,
} {

    /**
     * The line of the {@linkcode document} that the {@linkcode path} corresponds to
     * 
     * We start at `0` (the first line of the document)
     * and we adjust the line number as we iterate through the document lines and find the appropriate text
     */
    let line = 0;

    /** The column-start number at the given line */
    let colStart: number | undefined;
    /** The column-end number at the given line */
    let colEnd: number | undefined;

    /**
     * The current {@link part} of the property {@linkcode path}
     * 
     * We start with the first part of the {@linkcode path} and iterate through the lines of the document
     * until we find the line that the {@linkcode part} corresponds to. Then we move on to the next part
     * of the {@linkcode path} and so on.
     * 
     * This can be a string (e.g. `"root"`) or a number (e.g. `1`) if the part is in an array.
     * If the part is `undefined`, it means we are done traversing the {@linkcode path}.
     */
    let part = path.shift();
    let parentPart: string | number | undefined;

    // Iterate through the lines of the document to find the line that the path corresponds to
    for (let i = 0; i < document.length; i++) {

        // If the part is `undefined`, then we break out of the loop and return the latest line
        if (part === undefined) { break; }

        /** The text corresponding to the current line index in the {@linkcode document} */
        const text = document.at(i);
        if (text === undefined) { break; }

        // If the text includes the part, then we set the line to the current line and move on to the next part
        if (text.includes("<" + part)) {
            line = i;
            parentPart = part;
            part = path.shift();
        }

        // If the part is an array...
        if (typeof part === "number") {
            if (part > 0 && text.includes("<" + parentPart)) {
                // ...continue until we find the correct index
                part--;
                continue;
            } else {
                // .. then we select the next occurrence of the part
                line = i;
                parentPart = part;
                part = path.shift();
            }
        }

        // If we have found a particular attribute, then we set the colStart and colEnd values
        if (part === attributesGroupName) {
            const attributeName = path.shift();
            // If the attribute name is incorrect, we break out of the loop as usual
            if (!attributeName || !text.includes(attributeName.toString())) {
                break;
            }
            // Otherwise, we try to find the colStart and colEnd values
            const matches = text.match(new RegExp(`${attributeName}=".*?"`));
            if (matches?.length) {
                colStart = text.indexOf(matches[0]);
                colEnd = colStart + matches[0].length;
            }
            // We break out of the loop as usual
            break;
        }

    }

    // Return the line number corresponding to the given path
    return { line, colStart, colEnd };
}
