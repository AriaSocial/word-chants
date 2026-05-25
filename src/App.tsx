import { useState, useEffect, useMemo } from 'react'
import { Search, HelpCircle, X, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import wordsData from '../words.json'
import { Word, ViewMode } from './types'
import { HeaderSection } from './components/HeaderSection'
import { DashboardStats } from './components/DashboardStats'
import { WordCard } from './components/WordCard'
import { FlashcardView } from './components/FlashcardView'
import { QuizView } from './components/QuizView'

// Extracted styles following Rule 6 (Class Organization)
const mainLayoutWrapperStyles = "mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 flex flex-col gap-8 min-h-screen"
const searchInputWrapperStyles = "relative flex-grow flex items-center bg-white border border-slate-200 rounded-xl group focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/5 transition-all duration-300 shadow-sm"
const searchInputStyles = "w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-3 pl-11 pr-10 rounded-xl"
const gridWordListStyles = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
const emptyStateContainerStyles = "glass-panel flex flex-col items-center justify-center py-16 px-4 rounded-3xl text-center border border-slate-200"
const emptyStateIconStyles = "flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 border border-slate-200 mb-4"

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [learnedFilter, setLearnedFilter] = useState<'all' | 'learning' | 'learned'>('all')
  
  // States loaded from localStorage
  const [learned, setLearned] = useState<string[]>(() => {
    const saved = localStorage.getItem('word_learned')
    return saved ? JSON.parse(saved) : []
  })
  const [quizHighScore, setQuizHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('word_quiz_high_score')
    return saved ? parseInt(saved, 10) : 0
  })

  // Cast JSON data into typed array
  const words: Word[] = wordsData as Word[]

  // Sync learned with localStorage
  useEffect(() => {
    localStorage.setItem('word_learned', JSON.stringify(learned))
  }, [learned])

  // Sync highscore with localStorage
  const updateHighScore = (score: number) => {
    setQuizHighScore(score)
    localStorage.setItem('word_quiz_high_score', score.toString())
  }

  // Toggle learned
  const toggleLearned = (id: string) => {
    setLearned((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Filtered words calculations (Highly optimized via useMemo)
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      // 1. Search Query filter (checks word, Japanese meanings, phrases, sentences)
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesWord = w.word.toLowerCase().includes(q)
        const matchesChants = w.chants.some((c) => c.includes(q))
        const matchesPhrases = (w.phrase_en?.some(p => p.toLowerCase().includes(q)) || false) ||
                               (w.phrase_ja?.some(p => p.includes(q)) || false)
        const matchesSentences = (w.sentense_en?.some(s => s.toLowerCase().includes(q)) || false) ||
                                 (w.sentense_ja?.some(s => s.includes(q)) || false)
        
        if (!matchesWord && !matchesChants && !matchesPhrases && !matchesSentences) {
          return false
        }
      }

      // 2. Learned filter
      if (learnedFilter === 'learning' && learned.includes(w.id)) return false
      if (learnedFilter === 'learned' && !learned.includes(w.id)) return false

      return true
    })
  }, [words, searchQuery, learned, learnedFilter])

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <div className={mainLayoutWrapperStyles}>
        {/* Navigation & Title */}
        <HeaderSection
          currentMode={viewMode}
          setMode={setViewMode}
          totalCount={words.length}
        />

        {/* --- 1. SEARCH & BROWSE MODE --- */}
        {viewMode === 'search' && (
          <main className="flex flex-col gap-6">
            {/* Summary Metrics */}
            <DashboardStats
              totalCount={words.length}
              quizHighScore={quizHighScore}
              learnedCount={learned.length}
            />

            {/* Dynamic Filters panel */}
            <div className="mt-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Custom Search Box */}
                <div className={searchInputWrapperStyles}>
                  <Search className="absolute left-4 h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="単語、意味、用例から検索..."
                    className={searchInputStyles}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Memorization Progress Filters */}
                <div className="flex rounded-lg bg-slate-200/50 p-0.5 border border-slate-200 select-none relative self-start md:self-auto">
                  {(['all', 'learning', 'learned'] as const).map((filter) => {
                    const isActive = learnedFilter === filter
                    const label = filter === 'all' ? 'すべて' : filter === 'learning' ? '暗記中' : '暗記完了'
                    return (
                      <button
                        key={filter}
                        onClick={() => setLearnedFilter(filter)}
                        className="relative rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors duration-300 cursor-pointer z-10 focus:outline-none"
                        style={{ outline: 'none' }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeFilterProgressPill"
                            className="absolute inset-0 bg-white rounded-md border border-slate-200/30 shadow-sm -z-10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className={isActive ? "text-slate-800" : "text-slate-500 hover:text-slate-700"}>
                          {label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Grid display list of words */}
            {filteredWords.length > 0 ? (
              <div className={gridWordListStyles}>
                <AnimatePresence mode="popLayout">
                  {filteredWords.map((word) => (
                    <WordCard
                      key={word.id}
                      word={word}
                      isLearned={learned.includes(word.id)}
                      toggleLearned={toggleLearned}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className={emptyStateContainerStyles}>
                <div className={emptyStateIconStyles}>
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">一致する単語が見つかりません</h4>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  検索ワードを変更するか、選択しているフィルター条件を外してみてください。
                </p>
              </div>
            )}
          </main>
        )}

        {/* --- 2. FLASHCARD MODE --- */}
        {viewMode === 'flashcard' && (
          <main className="py-6 md:py-12">
            <FlashcardView
              words={filteredWords}
              learned={learned}
              toggleLearned={toggleLearned}
            />
          </main>
        )}

        {/* --- 3. QUIZ MODE --- */}
        {viewMode === 'quiz' && (
          <main className="py-6 md:py-12">
            <QuizView
              words={words}
              highScore={quizHighScore}
              setHighScore={updateHighScore}
            />
          </main>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/60 pt-8 text-center select-none flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>WordChants English Vocabulary Learning System</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Powered by React, Tailwind CSS v4, Base UI, and Framer Motion. 192 Words Verified.
          </p>
        </footer>
      </div>
    </div>
  )
}
