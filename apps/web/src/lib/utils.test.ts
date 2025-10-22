import { generateSubdomain } from './utils';

describe('generateSubdomain', () => {
  it('converts business name to lowercase slug', () => {
    expect(generateSubdomain("Adib's Kicks")).toBe('adibs-kicks');
    expect(generateSubdomain('My Coffee Shop')).toBe('my-coffee-shop');
  });

  it('removes special characters', () => {
    expect(generateSubdomain("Joe's Coffee & Tea!")).toBe('joes-coffee-tea');
    expect(generateSubdomain('Best Shop!!!')).toBe('best-shop');
    expect(generateSubdomain('Store #1 @ Main St.')).toBe('store-1-main-st');
  });

  it('handles multiple spaces', () => {
    expect(generateSubdomain('Best   Shop')).toBe('best-shop');
    expect(generateSubdomain('My    Coffee    Shop')).toBe('my-coffee-shop');
  });

  it('removes leading and trailing hyphens', () => {
    expect(generateSubdomain('--Shop--')).toBe('shop');
    expect(generateSubdomain('---Test---')).toBe('test');
  });

  it('handles unicode characters', () => {
    expect(generateSubdomain('Café Olé')).toBe('caf-ol');
    expect(generateSubdomain('Tést Shöp')).toBe('tst-shp');
  });

  it('handles empty or whitespace-only strings', () => {
    expect(generateSubdomain('')).toBe('');
    expect(generateSubdomain('   ')).toBe('');
  });

  it('handles strings with only special characters', () => {
    expect(generateSubdomain('!!!')).toBe('');
    expect(generateSubdomain('###')).toBe('');
    expect(generateSubdomain('&&&')).toBe('');
  });

  it('handles very long strings', () => {
    const longName = 'A'.repeat(100);
    const result = generateSubdomain(longName);
    expect(result).toBe('a'.repeat(100));
  });

  it('handles mixed case with numbers', () => {
    expect(generateSubdomain('Shop123')).toBe('shop123');
    expect(generateSubdomain('Test-Shop-456')).toBe('test-shop-456');
  });

  it('replaces multiple consecutive hyphens with single hyphen', () => {
    expect(generateSubdomain('My---Shop')).toBe('my-shop');
    expect(generateSubdomain('Best----Store')).toBe('best-store');
  });

  it('trims whitespace before processing', () => {
    expect(generateSubdomain('  My Shop  ')).toBe('my-shop');
    expect(generateSubdomain('\tTest Store\n')).toBe('test-store');
  });
});
