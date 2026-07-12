// Dynamic route segments like `1,3,4` select multiple sets for a combined
// test. Returns sorted, de-duplicated set numbers, or null if malformed.
export function parseSetNumbers(param: string): number[] | null {
  const numbers = decodeURIComponent(param)
    .split(",")
    .map((part) => Number(part.trim()));
  if (numbers.length === 0 || numbers.some((n) => !Number.isInteger(n))) return null;
  return Array.from(new Set(numbers)).sort((a, b) => a - b);
}
