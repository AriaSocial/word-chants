export interface Word {
  id: string
  word: string
  chants: string[]
  phrase_en: string[]
  phrase_ja: string[]
  sentense_en: string[]
  sentense_ja: string[]
}

export type ViewMode = 'search' | 'flashcard' | 'quiz'
