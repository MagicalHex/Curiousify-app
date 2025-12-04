// src/components/ModeSelector.tsx
import { useState } from 'react'
import styles from './styles/ModeSelector.module.css'

interface ModeSelectorProps {
  mode: 'chill' | 'quiz'
  onChange: (mode: 'chill' | 'quiz') => void
quizStyle: 'minimalist' | 'lasvegas'
  onQuizStyleChange: (style: 'minimalist' | 'lasvegas') => void
  quizAfterAmount: number
  onQuizAfterAmountChange: (n: number) => void
  className?: string
}

const frequencies = [5, 10, 15, 20] as const

export default function ModeSelector({
mode,
  onChange,
  quizAfterAmount,
  onQuizAfterAmountChange,
  quizStyle,
  onQuizStyleChange,
  className = '',
}: ModeSelectorProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.modeWrapper}>
        <button
          className={`${styles.modeBtn} ${mode === 'chill' ? styles.active : ''}`}
          onClick={() => {
            onChange('chill')
            setExpanded(false)
          }}
        >
           🔭 Chill Mode
        </button>

        <button
          className={`${styles.modeBtn} ${mode === 'quiz' ? styles.active : ''}`}
          onClick={() => {
            onChange('quiz')
            setExpanded(true)
          }}
        >
          🎲 Quiz Mode
          {mode === 'quiz' && <span className={styles.expandIcon}></span>}
        </button>
      </div>

      {/* Expandable Quiz Settings */}
      <div className={`${styles.quizSettings} ${expanded && mode === 'quiz' ? styles.expanded : ''}`}>
        
        {/* QUIZ STYLE — Now using same button style as frequency */}
        <div className={styles.settingGroup}>
          <p className={styles.settingLabel}>Quiz Style</p>
          <div className={styles.freqGrid}>
            <button
              className={`${styles.freqBtn} ${quizStyle === 'minimalist' ? styles.activeFreq : ''}`}
              onClick={() => onQuizStyleChange('minimalist')}
            >
              {quizStyle === 'minimalist' && ''} Minimalist
            </button>
            <button
              className={`${styles.freqBtn} ${quizStyle === 'lasvegas' ? styles.activeFreq : ''}`}
              onClick={() => onQuizStyleChange('lasvegas')}
            >
              {quizStyle === 'lasvegas' && ''} Las Vegas 🎰
            </button>
          </div>
        </div>

        {/* FREQUENCY — unchanged */}
        <div className={styles.settingGroup}>
<label className={styles.settingLabel1}>
  Quiz me after every <strong>{quizAfterAmount}</strong> facts
</label>
<div className={styles.freqGrid1}>
  {frequencies.map(f => (
    <button
      key={f}
      className={`${styles.freqBtn} ${quizAfterAmount === f ? styles.activeFreq : ''}`}
      onClick={() => onQuizAfterAmountChange(f)}
    >
      {quizAfterAmount === f && '✓'} {f}
    </button>
  ))}
</div>
        </div>
        
      </div>
    </div>
  )
}