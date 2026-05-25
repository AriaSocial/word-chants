import React from 'react'
import { BookOpen, Search, Layers, BrainCircuit } from 'lucide-react'
import { ViewMode } from '../types'
import { motion } from 'framer-motion'

interface HeaderSectionProps {
  currentMode: ViewMode
  setMode: (mode: ViewMode) => void
  totalCount: number
}

// Extracted styles following Rule 6 (Class Organization)
const headerContainerStyles = "flex flex-col items-center justify-between gap-6 border-b border-slate-200/60 pb-8 md:flex-row"
const logoWrapperStyles = "flex items-center gap-3 font-display"
const logoIconBgStyles = "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-600/10"
const logoTextStyles = "text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
const logoSubtitleStyles = "text-[10px] tracking-wider text-slate-400 uppercase font-bold"
const navGroupStyles = "flex items-center rounded-xl bg-slate-200/50 p-1 border border-slate-200"

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  currentMode,
  setMode,
  totalCount,
}) => {
  // Navigation button styles generator
  const getNavBtnStyles = () => {
    return "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-300 cursor-pointer z-10 focus:outline-none"
  }

  return (
    <header className={headerContainerStyles}>
      <div className="flex flex-col gap-1">
        <div className={logoWrapperStyles}>
          <div className={logoIconBgStyles}>
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className={logoTextStyles}>WordChants</h1>
            <p className={logoSubtitleStyles}>
              Perfect Textbook Vocabulary Database
            </p>
          </div>
        </div>
      </div>

      <nav className={navGroupStyles}>
        {/* Search View Switch */}
        <button
          onClick={() => setMode('search')}
          className={getNavBtnStyles()}
          style={{ outline: 'none' }}
          title="単語一覧と検索"
        >
          {currentMode === 'search' && (
            <motion.div
              layoutId="activeNavTabPill"
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-600/10 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Search className="h-4 w-4" />
          <span className={currentMode === 'search' ? "text-white" : "text-slate-500 hover:text-slate-800"}>
            単語検索 ({totalCount})
          </span>
        </button>

        {/* Flashcard View Switch */}
        <button
          onClick={() => setMode('flashcard')}
          className={getNavBtnStyles()}
          style={{ outline: 'none' }}
          title="フラッシュカードでの学習"
        >
          {currentMode === 'flashcard' && (
            <motion.div
              layoutId="activeNavTabPill"
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-600/10 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Layers className="h-4 w-4" />
          <span className={currentMode === 'flashcard' ? "text-white" : "text-slate-500 hover:text-slate-800"}>
            暗記カード
          </span>
        </button>

        {/* Quiz View Switch */}
        <button
          onClick={() => setMode('quiz')}
          className={getNavBtnStyles()}
          style={{ outline: 'none' }}
          title="選択式クイズ"
        >
          {currentMode === 'quiz' && (
            <motion.div
              layoutId="activeNavTabPill"
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-600/10 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <BrainCircuit className="h-4 w-4" />
          <span className={currentMode === 'quiz' ? "text-white" : "text-slate-500 hover:text-slate-800"}>
            クイズ
          </span>
        </button>
      </nav>
    </header>
  )
}
