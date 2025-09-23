// tests/basic.test.js - CommonJS version
const { add, multiply, divide, isEven } = require('../utils/math');

describe('Math Utility Functions', () => {
  test('add function should return correct sum', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 5)).toBe(4);
    expect(add(0, 0)).toBe(0);
  });

  test('multiply function should return correct product', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(5, 0)).toBe(0);
    expect(multiply(-2, 4)).toBe(-8);
  });

  test('divide function should return correct quotient', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(9, 3)).toBe(3);
  });

  test('divide function should throw error for division by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });

  test('isEven function should correctly identify even numbers', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(3)).toBe(false);
    expect(isEven(0)).toBe(true);
    expect(isEven(-4)).toBe(true);
  });
});