const assert = require('assert');

describe('greet function', () => {
    it('should return a greeting with the provided name', () => {
        const result = greet("World");
        assert.strictEqual(result, "Hello, World!", "Greeting should match the expected format");
    });

    it('should handle empty string input', () => {
        const result = greet("");
        assert.strictEqual(result, "Hello, !", "Greeting should handle empty string input");
    });

    it('should handle null input', () => {
        const result = greet(null);
        assert.strictEqual(result, "Hello, null!", "Greeting should handle null input");
    });

    it('should handle undefined input', () => {
        const result = greet(undefined);
        assert.strictEqual(result, "Hello, undefined!", "Greeting should handle undefined input");
    });

    it('should handle number input', () => {
        const result = greet(42);
        assert.strictEqual(result, "Hello, 42!", "Greeting should handle number input");
    });

    it('should handle object input', () => {
        const obj = { toString: () => "Object" };
        const result = greet(obj);
        assert.strictEqual(result, "Hello, Object!", "Greeting should handle object input");
    });

    it('should handle array input', () => {
        const result = greet([1, 2, 3]);
        assert.strictEqual(result, "Hello, 1,2,3!", "Greeting should handle array input");
    });
});

// Test for the console.log output
describe('console output', () => {
    let originalLog;
    let logOutput;

    beforeEach(() => {
        originalLog = console.log;
        logOutput = '';
        console.log = (message) => {
            logOutput += message;
        };
    });

    afterEach(() => {
        console.log = originalLog;
    });

    it('should log the correct greeting', () => {
        require('./greet'); // Assuming the original code is in a file named greet.js
        assert.strictEqual(logOutput, "Hello, World!", "Console output should match the expected greeting");
    });
});
