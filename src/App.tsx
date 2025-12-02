// src/App.tsx
import { useState, useEffect } from 'react'
import factsData from './data/facts.json' with { type: 'json' }
import GlobeMenu from './GlobeMenu'
import FactCard from './FactCard'
import QuizInput from './QuizInput'
import QuizPrompt from './QuizPrompt'
import SwipeHint from './SwipeHint'
import { useSwipeable } from 'react-swipeable'
import styles from './styles/App.module.css'
import QuizResults from './QuizResults'
import { getFlagFromCategory } from './utils/flags'

interface Fact {
  id: string
  full: string
  category: string
  scenario?: string
  keys?: Array<{ text: string; type: string }>
  tags?: string[]
  weight?: number
  language?: string
}

const facts: Fact[] = factsData as Fact[]

export default function App() {
  const [index, setIndex] = useState(0)                    // ← Global progress (never resets)
  const [viewedFacts, setViewedFacts] = useState<Fact[]>([]) // ← Current quiz batch
  const [quizMode, setQuizMode] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)             // ← Position inside quiz batch
  const [input, setInput] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [quizAfterAmount] = useState(5)                    // ← Could be setting later
  const [correctCount, setCorrectCount] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // DOPAMINE
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Current fact logic
  const currentFact = quizMode
    ? viewedFacts[quizIndex]                                   // ← Quiz: from batch
    : facts[index]                                             // ← Learn: from global index

  const flagEmoji = currentFact ? getFlagFromCategory(currentFact.category) : ''

  // Trigger quiz prompt when we hit the limit
  useEffect(() => {
    if (!quizMode && viewedFacts.length === quizAfterAmount && viewedFacts.length > 0) {
      setShowPrompt(true)
    }
  }, [viewedFacts.length, quizMode, quizAfterAmount])

  const nextFact = () => {
    if (!currentFact) return

    if (quizMode) {
      // === QUIZ MODE: Check answer ===
      const isCorrect = currentFact.keys?.some(k =>
        k.text.toLowerCase() === input.trim().toLowerCase()
      ) || false

      if (isCorrect) {
        setPoints(p => p + 10)
        setStreak(s => s + 1)
        setCorrectCount(c => c + 1)
        setAnswerState('correct')
      } else {
        setStreak(0)
        setAnswerState('wrong')
      }

      setTimeout(() => {
        setInput('')
        setAnswerState('idle')

        if (quizIndex + 1 < viewedFacts.length) {
          setQuizIndex(q => q + 1)
        } else {
          // === QUIZ DONE → Back to learning, continue from next fact ===
          setShowResults(true)
          setQuizMode(false)
          setQuizIndex(0)
          setViewedFacts([])        // ← Clear batch for next round
          // setIndex(i => i + 1)      // ← THIS IS THE KEY: continue to fact #6
        }
      }, 2000)
    } else {
      // === LEARN MODE ===
      if (!viewedFacts.some(f => f.id === currentFact.id)) {
        setViewedFacts(prev => [...prev, currentFact])
      }
      setIndex(i => i + 1)
    }
  }

  const startQuiz = () => {
    setQuizMode(true)
    setQuizIndex(0)
    setShowPrompt(false)
  }

  const handlers = useSwipeable({
    onSwipedUp: nextFact,
    onSwipedDown: () => {
      if (quizMode) {
        if (quizIndex > 0) setQuizIndex(q => q - 1)
      } else {
        if (index > 0) setIndex(i => i - 1)
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

  const fireEmojis = () => {
    if (streak === 0) return ''
    if (streak < 5) return '🔥'.repeat(Math.min(streak, 3))
    if (streak < 10) return '🔥🔥🔥' + streak
    if (streak < 20) return '🔥🔥🔥' + streak + '🔥🔥🔥'
    return '🔥🔥🔥🔥🔥 ' + streak + ' 🔥🔥🔥🔥🔥'
  }

  return (
    <div className={styles.app} {...handlers}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <GlobeMenu />
          <div className={styles.points}>
            {fireEmojis()} {points} pts
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.categoryWrapper}>
          <h1 className={styles.categoryTitle}>
            {currentFact?.category || 'Loading...'} {flagEmoji}
          </h1>
        </div>

        <main className={styles.main}>
          {currentFact && (
            <FactCard
              fact={currentFact}
              mode={quizMode ? "quiz" : "learn"}
              isCorrect={answerState === 'correct' ? true : answerState === 'wrong' ? false : undefined}
            />
          )}
        </main>
      </div>

      {quizMode && (
        <QuizInput
          value={input}
          onChange={setInput}
          onSubmit={nextFact}
          isWrong={answerState === 'wrong'}
        />
      )}

      {showPrompt && (
        <QuizPrompt
          quizAfterAmount={quizAfterAmount}
          onStartQuiz={startQuiz}
          onContinue={() => {
            setShowPrompt(false)
            setViewedFacts([])           // Skip quiz? Reset batch, keep going
            // setIndex(i => i + 1)
          }}
        />
      )}

      {!quizMode && <SwipeHint />}
      {!quizMode && <div onClick={nextFact} className={styles.clickOverlay} />}

      {showResults && (
        <QuizResults
          correct={correctCount}
          total={quizAfterAmount}
          onClose={() => {
            setShowResults(false)
            setCorrectCount(0)
          }}
        />
      )}
    </div>
  )
}