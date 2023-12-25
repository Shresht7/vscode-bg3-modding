// Library
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as assert from 'assert';

// Helpers
import { bg3 } from '../helpers';

// =====
// TESTS
// =====

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Conversion of UUIDs to Handles', () => {

		const testSuite = [
			{
				testUUID: "853cadda-9fb3-4690-a2cf-56bb76f8543d",
				expectedHandle: "h853caddag9fb3g4690ga2cfg56bb76f8543d"
			},
			{
				testUUID: "877761b1-432d-40a2-9676-05871b097d97",
				expectedHandle: "h877761b1g432dg40a2g9676g05871b097d97"
			},
			{
				testUUID: "024c4724-3087-438a-83cc-6e43770a66f3",
				expectedHandle: "h024c4724g3087g438ag83ccg6e43770a66f3"
			},
			{
				testUUID: "d387b242-e752-4256-9a30-05adcfd2baa5",
				expectedHandle: "hd387b242ge752g4256g9a30g05adcfd2baa5"
			},
			{
				testUUID: "5a47567d-f52a-4126-934d-51fb0f45897d",
				expectedHandle: "h5a47567dgf52ag4126g934dg51fb0f45897d"
			},
		];

		for (const t of testSuite) {
			const actualHandle = bg3.convertToHandle(t.testUUID);
			assert.strictEqual(actualHandle, t.expectedHandle);
		}
	});


	test('Conversion of Version Numbers', () => {

		const testSuite = [
			{
				int64Version: 36028797018963968n,
				expected: "1.0.0.0"
			}
			// TODO: Add more tests here ...
		];

		for (const t of testSuite) {
			const version = new bg3.Version(t.int64Version);
			const actual = version.toString();
			assert.strictEqual(actual, t.expected);
		}

	});
});
