// src/QuizResults.tsx
import React, { useState } from 'react'
import ConfettiBurst from './ConfettiBurst'
import styles from './styles/QuizResults.module.css'

interface QuizResultsProps {
  correct: number
  total: number
  quizStyle: 'minimalist' | 'lasvegas'
  onClose: () => void
}

export default function QuizResults({ correct, total, quizStyle, onClose }: QuizResultsProps) {
  const isPerfect = correct === total
  const isLasVegasJackpot = quizStyle === 'lasvegas' && isPerfect

  const [hasCelebrated, setHasCelebrated] = useState(false)
  if (isLasVegasJackpot && !hasCelebrated) setHasCelebrated(true)

  return (
    <>
      <ConfettiBurst trigger={isLasVegasJackpot && hasCelebrated} />

      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={`
            ${styles.title}
            ${isPerfect ? styles.perfectTitle : ''}
            ${isLasVegasJackpot ? styles.jackpotPulse : ''}
          `}>
            {isPerfect ? 'PERFECT! JACKPOT!' : 'Great job!'}
          </h2>

          <p className={styles.score}>
            {correct} / {total}
          </p>

<button 
  className={`
    ${styles.closeButton}
    ${quizStyle === 'lasvegas' ? styles.lasVegasButton : ''}
    ${quizStyle === 'lasvegas' ? styles.jackpotButtonText : ''}
  `} 
  onClick={onClose}
>
  {quizStyle === 'lasvegas' ? "LET'S GO!!!" : "Keep Learning"}
</button>
        </div>
      </div>
    </>
  )
}