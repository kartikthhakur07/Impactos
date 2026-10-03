import crypto from 'crypto';
import sharp from 'sharp';

/**
 * Compute SHA-256 hash of original untouched file bytes
 */
export function computeSha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Compute 64-bit Perceptual Hash (dHash) for an image buffer using Sharp
 */
export async function computePhash(buffer: Buffer): Promise<string> {
  try {
    // Resize image to 9x8 grayscale to compare adjacent pixels
    const rawPixels = await sharp(buffer)
      .resize(9, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    let hashBits = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const left = rawPixels[row * 9 + col];
        const right = rawPixels[row * 9 + col + 1];
        hashBits += left > right ? '1' : '0';
      }
    }

    // Convert 64 binary bits to 16 hex characters
    let hexHash = '';
    for (let i = 0; i < 64; i += 4) {
      const nibble = hashBits.substring(i, i + 4);
      hexHash += parseInt(nibble, 2).toString(16);
    }
    return hexHash;
  } catch (error) {
    // Fallback pseudo pHash based on md5 for unreadable/non-image media
    return crypto.createHash('md5').update(buffer).digest('hex').substring(0, 16);
  }
}

/**
 * Compute Hamming distance (bit count difference) between two hex hash strings
 */
export function computeHammingDistance(hex1: string, hex2: string): number {
  if (!hex1 || !hex2 || hex1.length !== hex2.length) {
    return 64; // Max distance if invalid
  }

  let distance = 0;
  for (let i = 0; i < hex1.length; i++) {
    const val1 = parseInt(hex1[i], 16);
    const val2 = parseInt(hex2[i], 16);
    let xor = val1 ^ val2;
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}
