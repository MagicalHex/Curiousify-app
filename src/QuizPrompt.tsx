// src/components/QuizPrompt.tsx
import styles from './styles/QuizPrompt.module.css'

interface QuizPromptProps {
  onStartQuiz: () => void
  onContinue: () => void
}

export default function QuizPrompt({ onStartQuiz, onContinue }: QuizPromptProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2 className={styles.title}>You just saw 10 facts.</h2>
        <button
          onClick={onStartQuiz}
          className={styles.startButton}
        >
          Quiz me now
        </button>
        <button
          onClick={onContinue}
          className={styles.continueButton}
        >
          Keep learning →
        </button>
      </div>
    </div>
  )
}