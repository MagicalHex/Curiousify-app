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

interface Fact {
  id: string
  full: string
  scenario?: string
  quiz_variants?: Array<{ template: string; answers: string[] }>
}

const facts: Fact[] = factsData as Fact[]

export default function App() {
  const [index, setIndex] = useState(0)
  const [seen, setSeen] = useState<Fact[]>([])
  const [quizMode, setQuizMode] = useState(false)
  const [input, setInput] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)

  const currentFact = quizMode ? seen[index] : facts[index]

  useEffect(() => {
    if (!quizMode && seen.length === 10 && seen.length > 0) {
      setShowPrompt(true)
    }
  }, [seen, quizMode])

  const nextFact = () => {
    if (!currentFact) return

    if (quizMode) {
      // Simple check (you can improve with real answer validation later)
      const correct = currentFact.quiz_variants?.some(v =>
        v.answers.some(a => a.toLowerCase() === input.trim().toLowerCase())
      )
      if (correct) {
        // You can add points here later
        console.log('Correct! 🎉')
      }
      setInput('')
    } else {
      setSeen(prev => [...prev, facts[index]])
    }
    setIndex(prev => prev + 1)
  }

  const startQuiz = () => {
    setQuizMode(true)
    setShowPrompt(false)
    setIndex(0)
  }

  const handlers = useSwipeable({
    onSwipedUp: () => {
      console.log('Swiped up!') // Debug log
      nextFact()
    },
    onSwipedDown: () => {
      // Optional: go back
      if (index > 0) setIndex(prev => prev - 1)
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    // swipeDurationThreshold: 500,
    // swipeVelocityThreshold: 0.5,
  })

  return (
    <div className={styles.app} {...handlers}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <GlobeMenu />
          <div className={styles.points}>🔥 0 pts</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {currentFact ? (
          quizMode ? (
            <FactCard fact={currentFact} mode="quiz" />
          ) : (
            <FactCard fact={currentFact} mode="learn" />
          )
        ) : (
          <div className={styles.noFacts}>End of facts — add more!</div>
        )}
      </main>

      {/* Quiz Input */}
      {quizMode && (
        <QuizInput
          value={input}
          onChange={setInput}
          onSubmit={nextFact}
        />
      )}

      {/* Quiz Prompt Overlay */}
      {showPrompt && (
        <QuizPrompt
          onStartQuiz={startQuiz}
          onContinue={() => {
            setShowPrompt(false)
            setSeen([])
          }}
        />
      )}

      {/* Swipe Hint */}
      {!quizMode && <SwipeHint />}

      {/* Invisible click-to-next overlay (for desktop) */}
      {!quizMode && (
        <div
          onClick={nextFact}
          className={styles.clickOverlay}
        />
      )}
    </div>
  )
}