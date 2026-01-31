
export interface MappingItem {
  english: string;
  sinhala: string;
  category: 'Vowels' | 'Consonants' | 'Vowel Signs' | 'Special';
}

export enum TabType {
  EDITOR = 'editor',
  AI_TOOLS = 'ai_tools',
  HISTORY = 'history',
  HELP = 'help'
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
}
