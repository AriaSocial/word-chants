import React, { useState, useEffect } from 'react'
import { BrainCircuit, RotateCcw, Check, X, Award, Play } from 'lucide-react'
import { Word } from '../types'

interface QuizViewProps {
  words: Word[]
  highScore: number
  setHighScore: (score: number) => void
}

// Extracted styles following Rule 6 (Class Organization)
const centerBoxStyles = "glass-panel max-w-md mx-auto p-8 rounded-3xl text-center shadow-xl border border-slate-200"
const textQuizTitleStyles = "text-3xl font-extrabold font-display tracking-tight text-slate-850 mb-2"
const startBtnStyles = "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-300"
const hudWrapperStyles = "flex items-center justify-between text-slate-500 font-display text-sm font-medium mb-3"
const qTextStyles = "text-xl font-bold text-slate-800 mb-6 leading-relaxed"
const choicesGridStyles = "grid grid-cols-1 gap-3"
const endTrophyWrapperStyles = "flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600 mx-auto mb-4 border border-pink-500/20 shadow-lg shadow-pink-500/5"

export const QuizView: React.FC<QuizViewProps> = ({
  words,
  highScore,
  setHighScore,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizPool, setQuizPool] = useState<Word[]>([])
  const [choices, setChoices] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const quizLength = Math.min(10, words.length)

  // Start new quiz session
  const startQuiz = () => {
    if (words.length < 4) return
    
    // Select 10 random words from pool
    const shuffledPool = [...words].sort(() => 0.5 - Math.random())
    const selectedPool = shuffledPool.slice(0, quizLength)
    
    setQuizPool(selectedPool)
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsFinished(false)
    setIsPlaying(true)
    generateQuestion(0, selectedPool)
  }

  // Generate dynamic choices for index
  const generateQuestion = (index: number, pool: Word[]) => {
    const questionWord = pool[index]
    const correct = questionWord.chants[0] // Primary meaning is the correct answer
    
    // Extract other random wrong answers
    const wrongPool = words
      .filter((w) => w.id !== questionWord.id)
      .map((w) => w.chants[0])
    
    const uniqueWrong = Array.from(new Set(wrongPool)).sort(() => 0.5 - Math.random())
    const wrongChoices = uniqueWrong.slice(0, 3)
    
    // Shuffle all choices
    const allChoices = [correct, ...wrongChoices].sort(() => 0.5 - Math.random())
    
    setCorrectAnswer(correct)
    setChoices(allChoices)
    setSelectedAnswer(null)
  }

  const handleChoiceClick = (choice: string) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(choice)
    
    const isCorrect = choice === correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    // Go to next question after short delay
    setTimeout(() => {
      if (currentQuestionIndex < quizLength - 1) {
        const nextIdx = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIdx)
        generateQuestion(nextIdx, quizPool)
      } else {
        setIsFinished(true)
      }
    }, 1200)
  }

  // Update high score
  useEffect(() => {
    if (isFinished && score > highScore) {
      setHighScore(score)
    }
  }, [isFinished, score, highScore, setHighScore])

  if (words.length < 4) {
    return (
      <div className={centerBoxStyles}>
        <p className="text-slate-500 font-semibold">クイズをプレイするには最低4単語が必要です。</p>
        <p className="text-sm text-slate-400 mt-2">単語を登録、または追加してください。</p>
      </div>
    )
  }

  // Lobby state
  if (!isPlaying) {
    return (
      <div className={centerBoxStyles}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 mx-auto mb-4 border border-indigo-500/20">
          <BrainCircuit className="h-8 w-8" />
        </div>
        <h2 className={textQuizTitleStyles}>単語力テスト</h2>
        <p className="text-sm text-slate-500 leading-relaxed px-2">
          ランダムに出題される 10 問の英単語テストに挑戦して、あなたの単語力を試しましょう！
        </p>

        <div className="mt-6 flex flex-col gap-2 rounded-xl bg-slate-100 p-4 border border-slate-200 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">出題数:</span>
            <span className="font-semibold text-slate-800">{quizLength} 問</span>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-slate-500">ハイスコア:</span>
            <span className="font-semibold text-amber-600">{highScore} / {quizLength}</span>
          </div>
        </div>

        <button onClick={startQuiz} className={startBtnStyles}>
          <Play className="h-4.5 w-4.5 fill-white" />
          <span>クイズを開始する</span>
        </button>
      </div>
    )
  }

  // Summary finished state
  if (isFinished) {
    const isPerfect = score === quizLength
    return (
      <div className={centerBoxStyles}>
        <div className={endTrophyWrapperStyles}>
          <Award className="h-10 w-10" />
        </div>
        <h2 className={textQuizTitleStyles}>結果発表</h2>
        <p className="text-slate-500 text-sm">テストが終了しました！スコアは以下の通りです：</p>

        <div className="my-6">
          <div className="text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            {score} <span className="text-xl text-slate-400 font-medium font-sans">/ {quizLength}</span>
          </div>
          {isPerfect && (
            <p className="text-sm font-semibold text-emerald-600 mt-2 animate-bounce">
              🎉 素晴らしい！満点です！
            </p>
          )}
        </div>

        <button onClick={startQuiz} className={startBtnStyles}>
          <RotateCcw className="h-4.5 w-4.5" />
          <span>もう一度挑戦する</span>
        </button>

        <button
          onClick={() => setIsPlaying(false)}
          className="mt-3 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all duration-300"
        >
          メニューに戻る
        </button>
      </div>
    )
  }

  // Active playing state
  const currentWord = quizPool[currentQuestionIndex]

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4">
      {/* Quiz HUD */}
      <div>
        <div className={hudWrapperStyles}>
          <span>QUESTION {currentQuestionIndex + 1} / {quizLength}</span>
          <span className="text-amber-600 font-display">SCORE {score}</span>
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-slate-200 border border-slate-200/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 shadow-lg">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-display mb-1.5 text-indigo-600">
          次の英単語の意味を選択してください
        </p>
        <h3 className={qTextStyles}>
          “ <span className="text-indigo-600 font-display font-extrabold text-2xl tracking-tight">{currentWord?.word}</span> ”
        </h3>

        {/* 4 Choices Grid */}
        <div className={choicesGridStyles}>
          {choices.map((choice, i) => {
            const isSelected = selectedAnswer === choice
            const isCorrect = choice === correctAnswer
            
            let btnClass = "w-full text-left rounded-xl p-4 text-sm font-semibold border transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer "
            
            if (selectedAnswer === null) {
              btnClass += "bg-white border-slate-205 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-350"
            } else if (isCorrect) {
              btnClass += "bg-emerald-50 border-emerald-350 text-emerald-700"
            } else if (isSelected) {
              btnClass += "bg-rose-50 border-rose-350 text-rose-700"
            } else {
              btnClass += "bg-slate-100/50 border-slate-100 text-slate-300 opacity-40 shadow-none pointer-events-none"
            }

            return (
              <button
                key={i}
                onClick={() => handleChoiceClick(choice)}
                disabled={selectedAnswer !== null}
                className={btnClass}
              >
                <span>{choice}</span>
                {selectedAnswer !== null && isCorrect && (
                  <Check className="h-4.5 w-4.5 text-emerald-600" />
                )}
                {selectedAnswer !== null && isSelected && !isCorrect && (
                  <X className="h-4.5 w-4.5 text-rose-600" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
