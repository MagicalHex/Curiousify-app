// src/components/GlobeMenu.tsx
import { useState } from 'react'
import styles from './styles/GlobeMenu.module.css'

const countries = ['USA', 'Poland', 'Sweden', 'Japan', 'Germany', 'Brazil', 'India', 'Australia', 'Canada', 'France']

export default function GlobeMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.globeButton}
        aria-label="Open country menu"
      >
        🌍
      </button>

      {isOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.menu}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.listContainer}>
              {countries
                .filter(c => c.toLowerCase().includes(search.toLowerCase()))
                .map(country => (
                  <button
                    key={country}
                    className={styles.countryItem}
                    onClick={() => {
                      console.log('Selected:', country)
                      setIsOpen(false)
                    }}
                  >
                    {country}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}