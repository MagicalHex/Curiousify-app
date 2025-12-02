// src/QuizResults.tsx
import React from 'react'
import styles from './styles/QuizResults.module.css'  // create this CSS

interface QuizResultsProps {
  correct: number
  total: number
  onClose: () => void
}

export default function QuizResults({ correct, total, onClose }: QuizResultsProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Great job! 🎉</h2>
        <p className={styles.score}>{correct} out of {total}!</p>
        <button className={styles.closeButton} onClick={onClose}>
          Keep Learning 🚀
        </button>
      </div>
    </div>
  )
}