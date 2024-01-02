// Library
import * as vscode from 'vscode';
import * as path from 'node:path';
import * as assert from 'node:assert';
import { MetaLSX, MetaLsx, ModuleInfo } from '../library/bg3';

// Fixture - File contents of a `meta.lsx` file
// import contents from './fixtures/meta.lsx';

/** The ModuleInfo we expect the {@link MetaLSX} parser to extract from the `meta.lsx` file */
const expectedModuleInfo = {
    Author: "Shresht7",
    Description: "An awesome mod",
    Folder: "AwesomeMod_6c81bed5-b007-464c-b89e-97f8bd5f0023",
    Name: "AwesomeMod",
    NumPlayers: 4,
    Tags: "ideas;dev;testing;experiments",
    UUID: "6c81bed5-b007-464c-b89e-97f8bd5f0023",
    Version64: "36028797018963968",
};

/** The Dependencies we expect the {@link MetaLSX} parser to extract from the `meta.lsx` file */
const expectedDependencies = [
    {
        Name: "SharedDev",
        Folder: "SharedDev",
        MD5: "",
        UUID: "3d0c5ff8-c95d-c907-ff3e-34b204f1c630",
        Version64: "36028797022722506"
    },
    {
        Name: "CoolMod",
        Folder: "CoolMod_05f70cdb-8254-48e0-8572-b0221b6e973f",
        MD5: "",
        UUID: "05f70cdb-8254-48e0-8572-b0221b6e973f",
        Version64: "36028797022722506"
    },
];

/** The order of dependencies we expect */
const expectedDependenciesOrder = ['3d0c5ff8-c95d-c907-ff3e-34b204f1c630', '05f70cdb-8254-48e0-8572-b0221b6e973f'];

// =====================
// META.LSX PARSER TESTS
// =====================

suite("Parse `meta.lsx` metadata file", () => {

    const relPath = path.join(__dirname, "..", "..", "src", "test", "fixtures", "meta.lsx");
    const metaLsxPath = vscode.Uri.from({ scheme: "file", path: relPath });
    /** The parsed metadata from the `meta.lsx` file */
    let meta = new MetaLsx(metaLsxPath);

    setup(async () => {
        await meta.load();
    });

    // MODULE INFO

    suite("Successfully parses the ModuleInfo", () => {

        Object.entries(expectedModuleInfo).forEach(([key, value]) => {
            test(key, () => {
                assert.strictEqual(meta.ModuleInfo[key as keyof ModuleInfo], value);
            });
        });

    });

    // DEPENDENCIES

    suite("Successfully parses the Dependencies", () => {

        test(`The length of the dependencies array should be ${expectedDependencies.length}`, () => {
            assert.strictEqual(meta.Dependencies.length, expectedDependencies.length);
        });

        test("The dependencies should appear in the same order", () => {
            expectedDependenciesOrder.forEach((uuid, idx) => {
                assert.strictEqual(meta.Dependencies[idx].UUID, uuid);
            });
        });

        expectedDependencies.forEach((x, idx) => {
            test(x.Name, () => {
                assert.deepStrictEqual(meta.Dependencies[idx], x);
            });
        });

    });

});
