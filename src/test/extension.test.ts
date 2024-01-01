// Library
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as assert from 'assert';
import { bg3 } from '../library';

// Type Definitions
import type { VersionKind } from '../types';

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

		const testSuiteInt64 = [
			{
				int64Version: 36028797018963968n,
				expected: "1.0.0.0"
			},
			{
				int64Version: 36310278438125572n,
				expected: "1.2.3.4"
			},
			{
				int64Version: 36451024516415602n,
				expected: "1.3.7.114"
			}
		];

		for (const t of testSuiteInt64) {
			const version = new bg3.Version(t.int64Version);
			const actual = version.toString();
			assert.strictEqual(actual, t.expected);
		}

		const testSuiteStrings = [
			{
				stringVersion: "1.0.0.0",
				expected: 36028797018963968n
			},
			{
				stringVersion: "1.2.3.4",
				expected: 36310278438125572n
			},
			{
				stringVersion: "1.3.7.114",
				expected: 36451024516415602n
			}
		];

		for (const t of testSuiteStrings) {
			const version = new bg3.Version(t.stringVersion);
			const actual = version.toInt64();
			assert.strictEqual(actual, t.expected);
		}

	});

	test("Bump Version", () => {

		const testSuite: {
			v: string,
			kind: VersionKind,
			expected: string
		}[] = [
				{
					v: "1.0.0.0",
					kind: "major",
					expected: "2.0.0.0",
				},
				{
					v: "1.0.0.0",
					kind: "minor",
					expected: "1.1.0.0",
				},
				{
					v: "1.0.0.0",
					kind: "revision",
					expected: "1.0.1.0",
				},
				{
					v: "1.0.0.0",
					kind: "build",
					expected: "1.0.0.1",
				},
				{
					v: "1.2.3.4",
					kind: "build",
					expected: "1.2.3.5",
				},
				{
					v: "1.2.3.4",
					kind: "revision",
					expected: "1.2.4.0",
				},
				{
					v: "1.2.3.4",
					kind: "minor",
					expected: "1.3.0.0",
				},
				{
					v: "1.2.3.4",
					kind: "major",
					expected: "2.0.0.0",
				},
			];

		for (const t of testSuite) {
			const version = new bg3.Version(t.v).bump(t.kind);
			assert.strictEqual(version.toString(), t.expected);
		}

	});
});
