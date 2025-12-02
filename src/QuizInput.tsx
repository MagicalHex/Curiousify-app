// src/components/QuizInput.tsx
import styles from './styles/QuizInput.module.css'

interface QuizInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  isWrong?: boolean
}

export default function QuizInput({ value, onChange, onSubmit, isWrong }: QuizInputProps) {
  return (
    <div className={`${styles.container} ${isWrong ? styles.shake : ''}`}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Type your answer..."
        autoFocus
      />
      <button className={styles.submitButton} onClick={onSubmit}>
        →
      </button>
    </div>
  )
}