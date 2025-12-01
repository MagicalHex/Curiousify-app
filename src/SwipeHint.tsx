// src/components/SwipeHint.tsx
import styles from './styles/SwipeHint.module.css'

export default function SwipeHint() {
  return (
    <div className={styles.container}>
      <span>swipe up to continue</span>
      <span className={styles.arrow}>↑</span>
    </div>
  )
}