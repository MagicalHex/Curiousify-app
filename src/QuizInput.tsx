// src/components/QuizInput.tsx
import styles from './styles/QuizInput.module.css'

interface QuizInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function QuizInput({ value, onChange, onSubmit }: QuizInputProps) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSubmit()}
        placeholder="type your answer…"
        className={styles.input}
        autoFocus
      />
    </div>
  )
}