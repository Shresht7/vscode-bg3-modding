// Library
import assert from 'node:assert';
import { regex } from '../constants';

// -----
// TESTS
// -----

suite("Test Regular Expressions", () => {

    suite("UUID", () => {

        test("should match a valid UUID", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            assert.ok(regex.UUID.test(uuid));
        });

        test("should match regardless of case", () => {
            const uuid = "123E4567-E89B-12D3-A456-426614174000";
            assert.ok(regex.UUID.test(uuid));
        });

        test("should not match an invalid UUID", () => {
            const uuid = "123e4567-e89b-12d3-a456-42661417400";
            assert.ok(!regex.UUID.test(uuid));
        });

        test("should not match a random string", () => {
            const uuid = "hello world";
            assert.ok(!regex.UUID.test(uuid));
        });

        test("should not match a localization handle", () => {
            const uuid = "h123e4567ge89bg12d3ga456g426614174000";
            assert.ok(!regex.UUID.test(uuid));
        });

        test("should not match an empty string", () => {
            const uuid = "";
            assert.ok(!regex.UUID.test(uuid));
        });

        test("should not match a UUID with misplaced hyphens", () => {
            const uuid = "123e4567e89b-12d3-a456-426614174000";
            assert.ok(!regex.UUID.test(uuid));
        });

    });

    suite("Handle", () => {

        test("should match a valid handle", () => {
            const handle = "h123e4567ge89bg12d3ga456g426614174000";
            assert.ok(regex.handle.test(handle));
        });

        test("should not match an invalid handle", () => {
            const handle = "h123e4567ge89bg12d3ga456g42661417400";
            assert.ok(!regex.handle.test(handle));
        });

        test("should not match a random string", () => {
            const handle = "hello world";
            assert.ok(!regex.handle.test(handle));
        });

        test("should not match a UUID", () => {
            const handle = "123e4567-e89b-12d3-a456-426614174000";
            assert.ok(!regex.handle.test(handle));
        });

        test("should not match an empty string", () => {
            const handle = "";
            assert.ok(!regex.handle.test(handle));
        });

        test("should not match a handle with misplaced gs", () => {
            const handle = "h123e4567ge89bg12d3ga456g42661417400";
            assert.ok(!regex.handle.test(handle));
        });

    });

});
