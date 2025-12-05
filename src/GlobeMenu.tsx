// src/components/GlobeMenu.tsx
import { useState, useEffect, useRef } from 'react'
import styles from './styles/GlobeMenu.module.css'
import { getFlagEmoji } from './utils/flags'
import ModeSelector from './ModeSelector'

const countries = [
  'Global', 'Germany', 'Poland', 'Sweden', 'Japan', 'Brazil', 'India', 'Australia',
  'Canada', 'France', 'Italy', 'Spain', 'Mexico', 'South Korea', 'Netherlands',
  'Denmark', 'Norway', 'Finland', 'Belgium', 'Austria', 'Switzerland', 'USA'
]

const goalPlaceholders = [
  'Become Polish',
  'Understand space',
  'Better cooking',
  'Master quantum physics',
  'Speak like a native',
  'Decode ancient texts',
  'Think in 11 dimensions'
]

type View = 'global' | 'account'

interface GlobeMenuProps {
  isOpen?: boolean
  onToggle?: () => void
  mode: 'chill' | 'quiz'
  onModeChange: (mode: 'chill' | 'quiz') => void
  selectedCountry: string           // ← string, not string | null
  onCountrySelect: (country: string) => void
  userSettings: {
    quizStyle: 'minimalist' | 'lasvegas'
    quizAfterAmount: number
    mode: 'chill' | 'quiz'
    selectedCountry: string        // ← also here
  }
  onSettingsChange: (settings: GlobeMenuProps['userSettings']) => void
}

export default function GlobeMenu({
isOpen: isOpenProp,        // ← renamed so we don’t shadow
  onToggle,
  mode,
  onModeChange,
  selectedCountry,
  onCountrySelect,
  userSettings,
  onSettingsChange,
}: GlobeMenuProps) {
  // const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<View>('global')
  const [countrySearch, setCountrySearch] = useState('')
  const [globalSearch, setGlobalSearch] = useState('')
  const [placeholder, setPlaceholder] = useState(goalPlaceholders[0])
  const inputRef = useRef<HTMLInputElement>(null)

  // Controlled mode: use prop if provided, otherwise fall back to internal state
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = isOpenProp !== undefined ? isOpenProp : internalOpen
  const setIsOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    if (onToggle) {
      // Let parent decide the next value (they’ll usually do !prev)
      onToggle()
    } else {
      setInternalOpen(value)
    }
  }

  // Rolling placeholder
  // Animated typing placeholder (one letter at a time)
  useEffect(() => {
    if (!isOpen) {
      setPlaceholder('')
      return
    }

    let currentIndex = 0
    let charIndex = 0
    let isDeleting = false
    let currentText = ''
let timer: number

    const type = () => {
      const target = goalPlaceholders[currentIndex]

      if (!isDeleting) {
        // Typing
        currentText = target.slice(0, charIndex + 1)
        charIndex++
      } else {
        // Deleting
        currentText = target.slice(0, charIndex)
        charIndex--
      }

      setPlaceholder(currentText + (charIndex < target.length && !isDeleting ? '|' : ''))

      let delay = 120

      if (!isDeleting && charIndex === target.length) {
        delay = 2000 // Pause at end
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        currentIndex = (currentIndex + 1) % goalPlaceholders.length
        delay = 500 // Pause before next word
      } else if (isDeleting) {
        delay = 60 // Faster delete
      }

      timer = setTimeout(type, delay)
    }

    // Start after slight delay when menu opens
    const startTimer = setTimeout(() => {
      type()
    }, 400)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(timer)
    }
  }, [isOpen])

  // Auto-focus top search
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on Escape
useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    if (isOpen) window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [isOpen]) // ← now works
  
  const filtered = countries.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  return (
    <div className={styles.container}>
<button
  onClick={() => setIsOpen(v => !v)}
  className={styles.globeBtn}
  aria-label={isOpen ? 'Close menu' : 'Change country'}
>
  {isOpen ? (
    '✕'
  ) : selectedCountry ? (
    // Show flag for real countries, Global for global
    getFlagEmoji(selectedCountry)
  ) : (
    'Global' // fallback
  )}
</button>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
            ✕
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <button
            className={`${styles.tab} ${view === 'global' ? styles.activeTab : ''}`}
            onClick={() => setView('global')}
          >
            🌍 Global
          </button>

          <button className={`${styles.tab} ${styles.activeTab}`}>
            🎚️ Modes
          </button>

          <button
            className={`${styles.tab} ${view === 'account' ? styles.activeTab : ''}`}
            onClick={() => setView('account')}
          >
            📒 Account
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className={styles.twoColumnGrid}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            {view === 'global' ? (
              <div className={styles.countriesSection}>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className={styles.countryInput}
                />
                <div className={styles.countryList}>
                  {filtered.length === 0 ? (
                    <p className={styles.noResult}>No countries found</p>
                  ) : (
                    filtered.map(country => (
<button
    key={country}
    className={`${styles.countryBtn} ${
      selectedCountry === country ? styles.active : ''
    }`}
    onClick={() => {
      onCountrySelect(country)        // ← updates userSettings.selectedCountry
      setIsOpen(false)
      setCountrySearch('')
    }}
  >
                        <span className={styles.flag}>{getFlagEmoji(country)}</span>
                        {country}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : (
              // In Account view → Modes move to left
<ModeSelector
  mode={mode}
  onChange={onModeChange}
  quizStyle={userSettings.quizStyle}
  onQuizStyleChange={(style) => 
    onSettingsChange({ ...userSettings, quizStyle: style })
  }
  quizAfterAmount={userSettings.quizAfterAmount}
  onQuizAfterAmountChange={(amount) => 
    onSettingsChange({ ...userSettings, quizAfterAmount: amount })
  }
/>
            )}
          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>
            {view === 'global' ? (
              // Main view → Modes on right (with full settings!)
<ModeSelector
  mode={mode}
  onChange={onModeChange}
  quizStyle={userSettings.quizStyle}
  onQuizStyleChange={(style) => 
    onSettingsChange({ ...userSettings, quizStyle: style })
  }
  quizAfterAmount={userSettings.quizAfterAmount}
  onQuizAfterAmountChange={(amount) => 
    onSettingsChange({ ...userSettings, quizAfterAmount: amount })
  }
/>
            ) : (
              // Account view → Profile stuff
              <div className={styles.accountSection}>
                <div className={styles.avatar}>👤</div>
                <div className={styles.accountHeader}>
                  <div>
                    <strong>Guest Explorer</strong>
                    <br />
                    <small>Level 12 • 8,420 pts</small>
                  </div>
                </div>
                <button className={styles.signInBtn}>
                  Sign in to save progress →
                </button>
                <div className={styles.footer}>
                  <small>v1.0 • Made on Earth</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}