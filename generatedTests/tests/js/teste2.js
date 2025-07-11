const assert = require('assert');

describe('Greet Function Tests', () => {
    it('Should_ReturnGreetingWithName_WhenGivenValidName', () => {
        // Arrange
        const name = 'World';
        const expectedGreeting = 'Hello, World!';

        // Act
        const result = greet(name);

        // Assert
        assert.strictEqual(result, expectedGreeting, 'The greeting should match the expected format');
    });

    it('Should_ReturnGreetingWithEmptyName_WhenGivenEmptyString', () => {
        // Arrange
        const name = '';
        const expectedGreeting = 'Hello, !';

        // Act
        const result = greet(name);

        // Assert
        assert.strictEqual(result, expectedGreeting, 'The greeting should handle empty string input');
    });

    it('Should_ReturnGreetingWithNumberAsString_WhenGivenNumber', () => {
        // Arrange
        const name = 42;
        const expectedGreeting = 'Hello, 42!';

        // Act
        const result = greet(name);

        // Assert
        assert.strictEqual(result, expectedGreeting, 'The greeting should handle number input');
    });

    it('Should_ReturnGreetingWithUndefined_WhenNoArgumentProvided', () => {
        // Arrange
        const expectedGreeting = 'Hello, undefined!';

        // Act
        const result = greet();

        // Assert
        assert.strictEqual(result, expectedGreeting, 'The greeting should handle undefined input');
    });

    it('Should_ReturnGreetingWithNull_WhenGivenNull', () => {
        // Arrange
        const name = null;
        const expectedGreeting = 'Hello, null!';

        // Act
        const result = greet(name);

        // Assert
        assert.strictEqual(result, expectedGreeting, 'The greeting should handle null input');
    });

    it('Should_ReturnGreetingWithObjectAsString_WhenGivenObject', () => {
        // Arrange
        const name = { toString: () => 'CustomObject' };
        const expectedGreeting = 'Hello, CustomObject!';

        // Act
        const result = greet(name);

        // Assert
        assert.strictEqual(result, expectedGreeting, 'The greeting should handle object input with toString method');
    });
});
