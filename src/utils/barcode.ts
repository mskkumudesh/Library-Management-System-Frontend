/**
 * Generates a random, valid EAN-13 style barcode number.
 * Uses prefix 200 (reserved for in-store / internal use, never assigned
 * to real published ISBNs) so generated codes can't collide with real books.
 */
export function generateEan13(): string {
  const prefix = "200";
  let digits = prefix;
  for (let i = 0; i < 9; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }

  // EAN-13 check digit: sum odd-position digits *1, even-position *3 (1-indexed from left, excluding check digit)
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return digits + checkDigit.toString();
}
