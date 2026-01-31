
import { SINHALA_MAPPINGS, VOWEL_SIGNS_MAP } from '../constants.tsx';

const vowels: Record<string, string> = {};
const consonants: Record<string, string> = {};
SINHALA_MAPPINGS.forEach(m => {
  if (m.category === 'Vowels') vowels[m.english] = m.sinhala;
  if (m.category === 'Consonants' || m.category === 'Special') consonants[m.english] = m.sinhala;
});

export function transliterate(text: string): string {
  if (!text) return "";
  
  let result = "";
  let i = 0;
  
  while (i < text.length) {
    let char = text[i];
    let nextChar = text[i+1];
    let nextNextChar = text[i+2];

    // Handle Space and non-alphabetic
    if (!/[a-zA-Z]/.test(char)) {
      result += char;
      i++;
      continue;
    }

    let matched = false;

    // 1. Try to find a consonant
    let base = "";
    let baseLen = 0;

    // Check 3-char consonants (nG, nD etc are 2, but some might be 3)
    if (consonants[text.substring(i, i+3)]) { base = consonants[text.substring(i, i+3)]; baseLen = 3; }
    else if (consonants[text.substring(i, i+2)]) { base = consonants[text.substring(i, i+2)]; baseLen = 2; }
    else if (consonants[char]) { base = consonants[char]; baseLen = 1; }

    if (base) {
      let currentPos = i + baseLen;
      let clusterSuffix = "";

      // Check for Rakaransaya (e.g., tr, kr, pr)
      if (text[currentPos] === 'r' && !vowels[text[currentPos+1]]) {
         clusterSuffix = "්‍ර"; // Rakaransaya
         currentPos++;
      }
      
      // Check for Yansaya (e.g., ty, ky, py)
      else if (text[currentPos] === 'y' && !vowels[text[currentPos+1]]) {
         clusterSuffix = "්‍ය"; // Yansaya
         currentPos++;
      }

      // Check for Vowel Sign
      let vSign = "";
      let vLen = 0;
      if (VOWEL_SIGNS_MAP[text.substring(currentPos, currentPos+2)] !== undefined) {
        vSign = VOWEL_SIGNS_MAP[text.substring(currentPos, currentPos+2)];
        vLen = 2;
      } else if (VOWEL_SIGNS_MAP[text[currentPos]] !== undefined) {
        vSign = VOWEL_SIGNS_MAP[text[currentPos]];
        vLen = 1;
      }

      if (vSign !== "" || (text[currentPos] && vowels[text[currentPos]])) {
         result += base + clusterSuffix + vSign;
         i = currentPos + vLen;
      } else {
         // Hal kirima
         result += base + clusterSuffix + '්';
         i = currentPos;
      }
      matched = true;
    } else {
      // 2. Try to find a standalone vowel
      if (vowels[text.substring(i, i+2)]) {
        result += vowels[text.substring(i, i+2)];
        i += 2;
        matched = true;
      } else if (vowels[char]) {
        result += vowels[char];
        i += 1;
        matched = true;
      }
    }

    if (!matched) {
      result += text[i];
      i++;
    }
  }

  return result;
}
