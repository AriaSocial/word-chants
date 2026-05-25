import React from 'react'
import { BookMarked, Award, BookOpen } from 'lucide-react'

interface DashboardStatsProps {
  totalCount: number
  quizHighScore: number
  learnedCount: number
}

// Extracted styles following Rule 6 (Class Organization)
const statsGridStyles = "grid grid-cols-1 gap-4 sm:grid-cols-3"
const cardBaseStyles = "glass-panel flex items-center justify-between p-4 rounded-xl shadow-sm transition-all duration-300 glass-panel-hover"

const iconWrapperOpenStyles = "flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600"
const iconWrapperBookStyles = "flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"
const iconWrapperAwardStyles = "flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600"

const numberDisplayStyles = "text-2xl font-bold font-display tracking-tight text-slate-850"
const labelDisplayStyles = "text-xs font-medium text-slate-500 mt-0.5"

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCount,
  quizHighScore,
  learnedCount,
}) => {
  return (
    <div className={statsGridStyles}>
      {/* Total Words */}
      <div className={cardBaseStyles}>
        <div>
          <span className={numberDisplayStyles}>{totalCount}</span>
          <p className={labelDisplayStyles}>総単語数</p>
        </div>
        <div className={iconWrapperOpenStyles}>
          <BookOpen className="h-5 w-5" />
        </div>
      </div>

      {/* Learned */}
      <div className={cardBaseStyles}>
        <div>
          <span className={numberDisplayStyles}>{learnedCount}</span>
          <p className={labelDisplayStyles}>暗記完了</p>
        </div>
        <div className={iconWrapperBookStyles}>
          <BookMarked className="h-5 w-5" />
        </div>
      </div>

      {/* Quiz Score */}
      <div className={cardBaseStyles}>
        <div>
          <span className={numberDisplayStyles}>{quizHighScore}点</span>
          <p className={labelDisplayStyles}>クイズハイスコア</p>
        </div>
        <div className={iconWrapperAwardStyles}>
          <Award className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
