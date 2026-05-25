import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, Volume2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Word } from '../types'

interface FlashcardViewProps {
  words: Word[]
  learned: string[]
  toggleLearned: (id: string) => void
}

// Extracted styles following Rule 6 (Class Organization)
const mainContainerStyles = "max-w-xl mx-auto flex flex-col gap-6"
const topBarStyles = "flex items-center justify-between text-slate-500"
const textProgressStyles = "text-sm font-semibold font-display tracking-wider"
const btnShuffleStyles = "flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-850 shadow-sm transition-all duration-300"
const flipCardContainerStyles = "perspective-1000 relative h-96 w-full cursor-pointer"
const cardFaceBaseStyles = "absolute inset-0 flex flex-col justify-between rounded-3xl p-8 shadow-xl border select-none backface-hidden"
const cardFrontStyles = "glass-panel bg-white/80 border-slate-200 flex flex-col items-center justify-center gap-6"
const cardBackStyles = "glass-panel bg-white/95 border-indigo-100 justify-between overflow-y-auto"
const cardWordStyles = "text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-850 select-text cursor-default"
const speechBtnStyles = "flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all duration-300"
const flipHintStyles = "flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100/50"
const btnRowStyles = "flex items-center justify-between gap-4 mt-2"
const navBtnStyles = "flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-850 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
const actionGroupStyles = "flex items-center gap-3"
const floatingActionBtnStyles = "flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 active:scale-95"

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  words,
  learned,
  toggleLearned,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shuffledList, setShuffledList] = useState<Word[]>(words)
  const [isShuffled, setIsShuffled] = useState(false)

  const activeWords = isShuffled ? shuffledList : words
  const currentWord = activeWords[currentIndex]

  // Reset indices and shuffle
  const handleShuffle = () => {
    const list = [...words]
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setShuffledList(list)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsShuffled(true)
  }

  const handleResetShuffle = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsShuffled(false)
  }

  const handleNext = () => {
    if (currentIndex < activeWords.length - 1) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 100)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1)
      }, 100)
    }
  }

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentWord) return
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  if (words.length === 0) {
    return (
      <div className="glass-panel text-center p-8 rounded-2xl max-w-md mx-auto my-12 border border-slate-200">
        <p className="text-slate-500 font-semibold">表示できる単語がありません。</p>
        <p className="text-sm text-slate-400 mt-2">暗記フィルターなどの条件を調整してください。</p>
      </div>
    )
  }

  const isLearned = learned.includes(currentWord?.id)

  // Floating Learned button styles
  const floatLrnBtnStyles = `${floatingActionBtnStyles} ${
    isLearned
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/15"
      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
  }`

  return (
    <div className={mainContainerStyles}>
      {/* Top bar indicators */}
      <div className={topBarStyles}>
        <span className={textProgressStyles}>
          CARD {currentIndex + 1} / {activeWords.length}
        </span>

        {isShuffled ? (
          <button onClick={handleResetShuffle} className={btnShuffleStyles}>
            <Shuffle className="h-3.5 w-3.5" />
            <span>順序をリセット</span>
          </button>
        ) : (
          <button onClick={handleShuffle} className={btnShuffleStyles}>
            <Shuffle className="h-3.5 w-3.5" />
            <span>シャッフル</span>
          </button>
        )}
      </div>

      {/* 3D Flashcard */}
      <div onClick={() => setIsFlipped(!isFlipped)} className={flipCardContainerStyles}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="relative h-full w-full transform-style-3d"
        >
          {/* FRONT FACE (Word) */}
          <div className={`${cardFaceBaseStyles} ${cardFrontStyles}`}>
            <span className="absolute top-6 left-6 text-xs font-semibold text-indigo-600 font-display">
              No. {currentWord.id}
            </span>

            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className={cardWordStyles}>{currentWord.word}</h2>
              <button
                onClick={handlePronounce}
                className={speechBtnStyles}
                title="発音を再生"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className={flipHintStyles}>
              <RotateCw className="h-3.5 w-3.5" />
              <span>カードをめくって意味を確認</span>
            </div>
          </div>

          {/* BACK FACE (Meanings) */}
          <div
            className={`${cardFaceBaseStyles} ${cardBackStyles}`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Upper Content */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-400 font-display">
                  No. {currentWord.id} • {currentWord.word}
                </span>
                <span className="text-xs font-bold text-indigo-600">解説</span>
              </div>

              {/* Japanese chants */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-display">
                  Meaning
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentWord.chants.map((chant, i) => (
                    <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 border border-slate-200/60">
                      {chant}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phrases */}
              {currentWord.phrase_en && currentWord.phrase_en.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-display">
                    Phrases
                  </span>
                  <div className="space-y-2">
                    {currentWord.phrase_en.map((en, index) => (
                      <div key={index} className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{en}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{currentWord.phrase_ja?.[index]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 border-t border-slate-100 pt-4">
              <RotateCw className="h-3 w-3" />
              <span>タップして裏返す</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons Row */}
      <div className={btnRowStyles}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={navBtnStyles}
          title="前の単語へ"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Toggle Actions */}
        <div className={actionGroupStyles}>
          <button
            onClick={() => toggleLearned(currentWord.id)}
            className={floatLrnBtnStyles}
            title={isLearned ? "暗記中リストから外す" : "暗記済みにする"}
          >
            <CheckCircle2 className={`h-5 w-5 ${isLearned ? "fill-emerald-600/10" : ""}`} />
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === activeWords.length - 1}
          className={navBtnStyles}
          title="次の単語へ"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
