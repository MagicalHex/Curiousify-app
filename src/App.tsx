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

import { getFlagFromCategory } from './utils/flags'

// Updated interface to match new structure
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
  // count facts
  const [index, setIndex] = useState(0)
  // seen fact
  const [seen, setSeen] = useState<Fact[]>([])
  // Quiz mode
  const [quizMode, setQuizMode] = useState(false)
  // input when quizzed
  const [input, setInput] = useState('')
  // Show quizz prompt
  const [showPrompt, setShowPrompt] = useState(false)
// Show quiz prompt after N amount
const [quizAfterAmount, setQuizAfterAmount] = useState<number>(5)

// ← currentFact must be calculated inside the component
  const currentFact = quizMode ? seen[index] || facts[0] : facts[index]

  // ← now we can use currentFact safely
  const flagEmoji = currentFact ? getFlagFromCategory(currentFact.category) : ''

// DOPAMINE STATES
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
const [currentAnswerState, setCurrentAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle')


  useEffect(() => {
    if (!quizMode && seen.length === quizAfterAmount && seen.length > 0) {
      setShowPrompt(true)
    }
  }, [seen, quizMode, quizAfterAmount])

  const nextFact = () => {
    if (!currentFact) return

    if (quizMode) {
      // Check answer
      const user = input.trim().toLowerCase()
      const isCorrect = currentFact.keys?.some(k => 
        k.text.toLowerCase() === user
      ) || false

      if (isCorrect) {
        setPoints(p => p + 10)
        setStreak(s => s + 1)
        setCurrentAnswerState('correct')
      } else {
        setStreak(0)
        setCurrentAnswerState('wrong')
      }

      // Show result for 2 seconds then next
      setTimeout(() => {
        setInput('')
setCurrentAnswerState('idle')
        setIndex(prev => prev + 1)
      }, 2000)
    } else {
      setSeen(prev => [...prev, currentFact])
      setIndex(prev => prev + 1)
    }
  }

  const handlers = useSwipeable({
  onSwipedUp: nextFact,
  onSwipedDown: () => index > 0 && setIndex(prev => prev - 1),
  trackMouse: true,
  preventScrollOnSwipe: true,
})

  const startQuiz = () => {
    setQuizMode(true)
    setShowPrompt(false)
    setIndex(0)
  }

  // Fire emoji based on streak
  const fireEmojis = () => {
    if (streak === 0) return ''
    if (streak < 5) return '🔥'.repeat(Math.min(streak, 3))
    if (streak < 10) return '🔥'.repeat(3) + `${streak}`
    if (streak < 20) return '🔥🔥🔥' + `${streak}🔥🔥🔥`
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
            {currentFact?.category || 'Loading...'}
          </h1>
        </div>

        <main className={styles.main}>
          <FactCard 
            fact={currentFact} 
            mode={quizMode ? "quiz" : "learn"}
            isCorrect={currentAnswerState === 'correct' ? true : currentAnswerState === 'wrong' ? false : undefined}
          />
        </main>
      </div>

      {quizMode && (
        <QuizInput 
          value={input} 
          onChange={setInput} 
          onSubmit={nextFact}
          isWrong={currentAnswerState === 'wrong'}
        />
      )}

      {showPrompt && (
        <QuizPrompt
          quizAfterAmount={quizAfterAmount}
          onStartQuiz={startQuiz}
          onContinue={() => {
            setShowPrompt(false)
            setSeen([])
          }}
        />
      )}

      {!quizMode && <SwipeHint />}
      {!quizMode && <div onClick={nextFact} className={styles.clickOverlay} />}
    </div>
  )
}