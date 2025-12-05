// src/components/ConfettiBurst.tsx
import { useEffect} from 'react'
import styles from './styles/ConfettiBurst.module.css'

export default function ConfettiBurst({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (!trigger) return

    const canvas = document.createElement('canvas')
    canvas.className = styles.canvas
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    const colors = ['#ff3860', '#ffdd57', '#7fffd4', '#ff9ff3', '#a8e6cf', '#ffd93d']

    for (let i = 0; i < 100; i++) {  // more particles = richer
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.random() * 8 - 4,     // ← much slower horizontal
        vy: Math.random() * -9 - 4,    // ← slower upward launch
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 9 + 6,   // slightly bigger
        life: 120,                     // ← lives 2× longer (was 70)
        gravity: 0.12,                 // ← gentle fall instead of 0.35
        spin: Math.random() * 0.1      // tiny rotation for elegance
      })
    }

    let rotation = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity                 // slow, dreamy fall
        p.life--
        rotation += p.spin

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(rotation)
        ctx.globalAlpha = p.life / 120
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size /2, p.size, p.size)
        ctx.restore()
      })

      if (particles.some(p => p.life > 0)) {
        requestAnimationFrame(animate)
      } else {
        canvas.remove()
      }
    }

    animate()

    return () => canvas.remove()
  // cleanup
  }, [trigger])

  return null
}