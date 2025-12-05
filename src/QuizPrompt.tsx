// src/components/QuizPrompt.tsx
import styles from './styles/QuizPrompt.module.css'

interface QuizPromptProps {
  quizAfterAmount: number
  onStartQuiz: () => void
  onContinue: () => void
}

export default function QuizPrompt({ quizAfterAmount, onStartQuiz, onContinue }: QuizPromptProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          You just learned {quizAfterAmount} facts!
        </h2>
        {/* <p className={styles.subtitle}>Ready to test yourself?</p> */}
        <div className={styles.buttons}>
          <button onClick={onStartQuiz} className={styles.startButton}>
            Quiz me now 🎯
          </button>
          <button onClick={onContinue} className={styles.continueButton}>
            Keep learning →
          </button>
        </div>
      </div>
    </div>
  )
}