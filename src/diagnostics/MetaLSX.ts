// Library
import * as vscode from 'vscode';
import { XMLDiagnostics } from './base';

// Schema
import { metaLSXSchema } from '../library/bg3/schema';

// --------------------
// META LSX DIAGNOSTICS
// --------------------

/**
 * Represents a class that provides diagnostics for meta lsx files
 * @extends XMLDiagnostics {@link XMLDiagnostics}
 */
export class MetaLSXDiagnostics extends XMLDiagnostics {

    /** The name of the diagnostics collection (see {@link vscode.Diagnostics}) */
    protected static name = "BG3XML";

    /** The JSON Schema to validate the XML document against */
    protected schema = metaLSXSchema;

    /** @returns A new instance of the {@linkcode MetaLSXDiagnostics} class */
    constructor() {
        super(MetaLSXDiagnostics.name);
    }

    /**
     * Determines whether the given `document` is a meta lsx file or not and if diagnostics should be created for it
     * @param document The document to create diagnostics for. (see {@linkcode vscode.TextDocument})
     * @returns `true` if diagnostics should be created for this file, `false` otherwise
     * @override
     */
    override shouldAllowDiagnostics(document: vscode.TextDocument): boolean {
        return document
            && document.languageId === "xml"
            && document.fileName.endsWith("meta.lsx");
    }

}
