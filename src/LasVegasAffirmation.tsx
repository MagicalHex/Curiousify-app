// src/components/LasVegasAffirmation.tsx
const affirmations = [
  'NICE!',
  'WOW!',
  'CRAY CRAY!',
  'GENIUS!',
  'TOO GOOD!',
  'INSANE!',
  'PERFECT!',
  'LEGEND!',
  'UNSTOPPABLE!',
  'GOD TIER!',
]

let lastIndex = -1
const getRandomAffirmation = () => {
  let index
  do {
    index = Math.floor(Math.random() * affirmations.length)
  } while (index === lastIndex && affirmations.length > 1)
  lastIndex = index
  return affirmations[index]
}

export default function LasVegasAffirmation({ show }: { show: boolean }) {
  const text = getRandomAffirmation()

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-jackpot">
        <h1 className="text-8xl md:text-9xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            {text}
          </span>
        </h1>
      </div>
    </div>
  )
}