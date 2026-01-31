
import { MappingItem } from './types.ts';

export const SINHALA_MAPPINGS: MappingItem[] = [
  // ස්වර (Vowels)
  { english: 'a', sinhala: 'අ', category: 'Vowels' },
  { english: 'aa', sinhala: 'ආ', category: 'Vowels' },
  { english: 'ae', sinhala: 'ඇ', category: 'Vowels' },
  { english: 'aee', sinhala: 'ඈ', category: 'Vowels' },
  { english: 'i', sinhala: 'ඉ', category: 'Vowels' },
  { english: 'ii', sinhala: 'ඊ', category: 'Vowels' },
  { english: 'u', sinhala: 'උ', category: 'Vowels' },
  { english: 'uu', sinhala: 'ඌ', category: 'Vowels' },
  { english: 'e', sinhala: 'එ', category: 'Vowels' },
  { english: 'ee', sinhala: 'ඒ', category: 'Vowels' },
  { english: 'ai', sinhala: 'ඓ', category: 'Vowels' },
  { english: 'o', sinhala: 'ඔ', category: 'Vowels' },
  { english: 'oo', sinhala: 'ඕ', category: 'Vowels' },
  { english: 'au', sinhala: 'ඖ', category: 'Vowels' },

  // ව්‍යඤ්ජන (Consonants)
  { english: 'k', sinhala: 'ක', category: 'Consonants' },
  { english: 'K', sinhala: 'ඛ', category: 'Consonants' },
  { english: 'g', sinhala: 'ග', category: 'Consonants' },
  { english: 'G', sinhala: 'ඝ', category: 'Consonants' },
  { english: 'ch', sinhala: 'ච', category: 'Consonants' },
  { english: 'CH', sinhala: 'ඡ', category: 'Consonants' },
  { english: 'j', sinhala: 'ජ', category: 'Consonants' },
  { english: 'J', sinhala: 'ඣ', category: 'Consonants' },
  { english: 't', sinhala: 'ට', category: 'Consonants' },
  { english: 'T', sinhala: 'ඨ', category: 'Consonants' },
  { english: 'd', sinhala: 'ඩ', category: 'Consonants' },
  { english: 'D', sinhala: 'ඪ', category: 'Consonants' },
  { english: 'th', sinhala: 'ත', category: 'Consonants' },
  { english: 'TH', sinhala: 'ථ', category: 'Consonants' },
  { english: 'dh', sinhala: 'ද', category: 'Consonants' },
  { english: 'DH', sinhala: 'ධ', category: 'Consonants' },
  { english: 'n', sinhala: 'න', category: 'Consonants' },
  { english: 'N', sinhala: 'ණ', category: 'Consonants' },
  { english: 'p', sinhala: 'ප', category: 'Consonants' },
  { english: 'P', sinhala: 'ඵ', category: 'Consonants' },
  { english: 'b', sinhala: 'බ', category: 'Consonants' },
  { english: 'B', sinhala: 'භ', category: 'Consonants' },
  { english: 'm', sinhala: 'ම', category: 'Consonants' },
  { english: 'y', sinhala: 'ය', category: 'Consonants' },
  { english: 'r', sinhala: 'ර', category: 'Consonants' },
  { english: 'l', sinhala: 'ල', category: 'Consonants' },
  { english: 'L', sinhala: 'ළ', category: 'Consonants' },
  { english: 'v', sinhala: 'ව', category: 'Consonants' },
  { english: 'w', sinhala: 'ව', category: 'Consonants' },
  { english: 's', sinhala: 'ස', category: 'Consonants' },
  { english: 'sh', sinhala: 'ශ', category: 'Consonants' },
  { english: 'S', sinhala: 'ෂ', category: 'Consonants' },
  { english: 'h', sinhala: 'හ', category: 'Consonants' },
  { english: 'f', sinhala: 'ෆ', category: 'Consonants' },

  // සඤ්ඤක (Special/Prenasalized)
  { english: 'nG', sinhala: 'ඟ', category: 'Special' },
  { english: 'nD', sinhala: 'ඳ', category: 'Special' },
  { english: 'nDh', sinhala: 'ඬ', category: 'Special' },
  { english: 'nB', sinhala: 'ඹ', category: 'Special' },
  { english: 'ny', sinhala: 'ඤ', category: 'Special' },
  { english: 'kn', sinhala: 'ඥ', category: 'Special' },
];

export const VOWEL_SIGNS_MAP: Record<string, string> = {
  'a': '', 'aa': 'ා', 'ae': 'ැ', 'aee': 'ෑ', 'i': 'ි', 'ii': 'ී',
  'u': 'ු', 'uu': 'ූ', 'e': 'ෙ', 'ee': 'ේ', 'ai': 'ෛ', 'o': 'ො', 'oo': 'ෝ', 'au': 'ෞ'
};
