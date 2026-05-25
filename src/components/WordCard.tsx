import React from 'react'
import { Volume2, CheckCircle2 } from 'lucide-react'
import { Word } from '../types'

interface WordCardProps {
  word: Word
  isLearned: boolean
  toggleLearned: (id: string) => void
}

// Extracted styles following Rule 6 (Class Organization)
const cardWrapperStyles = "glass-panel flex flex-col justify-start overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 glass-panel-hover group h-full"
const headerRowStyles = "flex items-start justify-between gap-4"
const idBadgeStyles = "rounded-lg bg-indigo-50/80 px-2 py-0.5 text-xs font-semibold text-indigo-650 font-display border border-indigo-100/50"
const actionsWrapperStyles = "flex items-center gap-1.5"
const actionBtnBaseStyles = "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300"
const textWordStyles = "text-2xl font-bold font-display tracking-tight text-slate-850 transition-all duration-300 group-hover:text-gradient"
const volumeBtnStyles = "flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all duration-300"
const chantsWrapperStyles = "mt-3 flex flex-wrap gap-1.5"
const chantBadgeStyles = "rounded-md bg-slate-100/60 px-2.5 py-1 text-sm text-slate-700 border border-slate-200/60"
const detailsBlockStyles = "mt-4 space-y-4 border-t border-slate-100 pt-3 text-sm"

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isLearned,
  toggleLearned,
}) => {
  // Text-To-Speech Pronunciation function
  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation()
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  // Learned button styles
  const learnedBtnStyles = `${actionBtnBaseStyles} ${
    isLearned
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/15"
      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
  }`

  // Safe checks for arrays
  const hasPhrases = word.phrase_en && word.phrase_en.length > 0
  const hasSentences = word.sentense_en && word.sentense_en.length > 0

  return (
    <div className={cardWrapperStyles}>
      {/* Top Section - Fixed height wrapper (h-36 = 144px) to perfectly align Details starting offsets */}
      <div className="h-36 flex flex-col justify-between">
        {/* Header Row */}
        <div className={headerRowStyles}>
          <span className={idBadgeStyles}>No. {word.id}</span>
          
          <div className={actionsWrapperStyles}>
            {/* Learned Button */}
            <button
              onClick={() => toggleLearned(word.id)}
              className={learnedBtnStyles}
              title={isLearned ? "暗記中リストから外す" : "暗記済みにする"}
            >
              <CheckCircle2 className={`h-4.5 w-4.5 ${isLearned ? "fill-emerald-600/10" : ""}`} />
            </button>
          </div>
        </div>

        {/* Word Display Row */}
        <div className="mt-2.5 flex items-center justify-between gap-4">
          <h3 className={textWordStyles}>{word.word}</h3>
          
          <button
            onClick={handlePronounce}
            className={volumeBtnStyles}
            title="発音を再生"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        {/* Meaning List (Chants) */}
        <div className={chantsWrapperStyles}>
          {word.chants.map((chant, i) => (
            <span key={i} className={chantBadgeStyles}>
              {chant}
            </span>
          ))}
        </div>
      </div>

      {/* Details Section (Phrases & Sentences) - Always Visible */}
      {(hasPhrases || hasSentences) && (
        <div className={detailsBlockStyles}>
          {/* Phrases Section */}
          {hasPhrases && (
            <div className="space-y-1.5">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-display">
                Phrases
              </span>
              <div className="space-y-2">
                {word.phrase_en.map((en, index) => (
                  <div key={index} className="rounded-lg bg-slate-50 p-2.5 border border-slate-100/80">
                    <p className="font-semibold text-slate-800">{en}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{word.phrase_ja?.[index] || ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentences Section */}
          {hasSentences && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-display">
                Examples
              </span>
              <div className="space-y-2">
                {word.sentense_en.map((en, index) => (
                  <div key={index} className="rounded-lg bg-slate-50 p-2.5 border border-slate-100/80">
                    <p className="font-semibold text-slate-800 leading-relaxed">{en}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{word.sentense_ja?.[index] || ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
