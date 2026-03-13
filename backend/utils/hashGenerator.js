// Prime numbers for hash generation
const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229
];

// Large prime for modulo operation
const LARGE_PRIME = 1000000007;

// Base62 characters (0-9, a-z, A-Z)
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Convert a number to base62 string
 * @param {number} num - Number to convert
 * @returns {string} Base62 encoded string
 */
function toBase62(num) {
  if (num === 0) return BASE62_CHARS[0];

  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

/**
 * Generate hash using prime number algorithm
 * @param {number} counter - Unique counter value
 * @param {number} offset - Random offset for additional randomness
 * @returns {string} Short code
 */
function generateHash(counter, offset = 12345) {
  // Select prime based on counter
  const primeIndex = counter % PRIMES.length;
  const selectedPrime = PRIMES[primeIndex];

  // Generate hash using prime multiplication and modulo
  const hash = (counter * selectedPrime + offset) % LARGE_PRIME;

  // Convert to base62
  const shortCode = toBase62(hash);

  // Ensure minimum length of 6 characters by padding with additional hash
  if (shortCode.length < 6) {
    const padding = toBase62((hash * selectedPrime) % LARGE_PRIME);
    return (shortCode + padding).substring(0, 6);
  }

  // Limit to 8 characters for consistency
  return shortCode.substring(0, 8);
}

/**
 * Generate unique short code with collision detection
 * @param {Function} checkExistence - Async function to check if code exists in DB
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<string>} Unique short code
 */
async function generateUniqueShortCode(checkExistence, maxRetries = 10) {
  let attempts = 0;

  while (attempts < maxRetries) {
    // Use timestamp and random number for counter to ensure uniqueness
    const counter = Date.now() + Math.floor(Math.random() * 100000);
    const offset = Math.floor(Math.random() * 1000000);

    const shortCode = generateHash(counter, offset);

    // Check if code already exists
    const exists = await checkExistence(shortCode);

    if (!exists) {
      return shortCode;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique short code after maximum retries');
}

/**
 * Validate short code format
 * @param {string} code - Short code to validate
 * @returns {boolean} True if valid
 */
function validateShortCode(code) {
  const regex = /^[0-9a-zA-Z]{6,8}$/;
  return regex.test(code);
}

export {
  generateUniqueShortCode,
  generateHash,
  validateShortCode,
  toBase62
};
