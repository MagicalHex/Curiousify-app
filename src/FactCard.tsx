// src/components/FactCard.tsx
import styles from './styles/FactCard.module.css'

interface FactCardProps {
  fact: any
  mode: 'learn' | 'quiz'
}

export default function FactCard({ fact, mode }: FactCardProps) {
  const displayText = mode === 'quiz' && fact.quiz_variants?.[0]?.template
    ? fact.quiz_variants[0].template
    : fact.full

  const renderTextWithBlanks = (text: string) => {
    return text.split('___').map((part, index) => (
      <span key={index}>
        {part}
        {index < text.split('___').length - 1 && (
          <span className={styles.blank}>___</span>
        )}
      </span>
    ))
  }

  return (
    <div className={styles.container}>
      {mode === 'quiz' ? (
        <span className={styles.quizTemplate}>
          {renderTextWithBlanks(displayText)}
        </span>
      ) : (
        <span>{displayText}</span>
      )}
    </div>
  )
}