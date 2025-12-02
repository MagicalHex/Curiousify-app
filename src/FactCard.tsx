// src/components/FactCard.tsx
import FactDisplay from './FactDisplay'
import styles from './styles/FactCard.module.css'

interface FactCardProps {
  fact: any
  mode: 'learn' | 'quiz'
  userAnswer?: string
  isCorrect?: boolean | null
}

export default function FactCard({ 
  fact, 
  mode, 
  userAnswer = '', 
  isCorrect 
}: FactCardProps) {
  return (
    <div className={styles.container}>
      <FactDisplay 
        fact={fact} 
        mode={mode} 
        userAnswer={userAnswer}
        isCorrect={isCorrect}
      />
    </div>
  )
}