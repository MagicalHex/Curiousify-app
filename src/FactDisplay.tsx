// src/components/FactDisplay.tsx
import { useState, useEffect } from 'react'
import styles from './styles/FactDisplay.module.css'

interface Key {
  text: string
  type: string
}

interface Fact {
  id: string
  full: string
  keys?: Key[]
}

interface FactDisplayProps {
  fact: Fact
  mode: 'learn' | 'quiz'
  onCorrect?: () => void
  userAnswer?: string
  isCorrect?: boolean | null   // ← allow null (we use null = “not answered yet”)
}

export default function FactDisplay({ fact, mode, onCorrect, userAnswer = '', isCorrect }: FactDisplayProps) {
  const [blankedText, setBlankedText] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')

  useEffect(() => {
    if (mode === 'learn' || !fact.keys || fact.keys.length === 0) {
      setBlankedText(fact.full)
      return
    }

    // Pick random key to blank
    const randomKey = fact.keys[Math.floor(Math.random() * fact.keys.length)]
    const answer = randomKey.text
    setCorrectAnswer(answer)

    // Replace the exact key text with ___ (or styled blank)
    const regex = new RegExp(`\\b${escapeRegExp(answer)}\\b`, 'gi')
    const replaced = fact.full.replace(regex, '___')

    setBlankedText(replaced)
  }, [fact, mode])

  // Show golden answer after submit
// inside the component – only show golden text when we have a real answer
const displayText = mode === 'quiz' && isCorrect !== undefined && isCorrect !== null
  ? fact.full.replace(
      new RegExp(`\\b${escapeRegExp(correctAnswer)}\\b`, 'gi'),
      `<span class="${styles.golden}">${correctAnswer}</span>`
    )
  : blankedText

  return (
    <div className={styles.factContainer}>
<p
  className={`${styles.factText} ${mode === 'quiz' ? styles.quizMode : ''}`}
  dangerouslySetInnerHTML={{
    __html: mode === 'quiz' && isCorrect === true ? displayText : blankedText
  }}
/>
      {mode === 'quiz' && isCorrect && (
        <div className={styles.confettiTrigger}>🎉</div>
      )}
    </div>
  )
}

// Helper: escape special regex chars
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}