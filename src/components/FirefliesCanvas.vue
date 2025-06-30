<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const el = canvas.value
  const ctx = el.getContext('2d')
  let animationFrameId

  // Canvas dimensions
  let w = (el.width = window.innerWidth)
  let h = (el.height = window.innerHeight)

  // Mouse state
  const mouse = { x: null, y: null }
  const interactionRadius = 120

  // Resize handler — scales fireflies proportionally
  const handleResize = () => {
    const oldW = w
    const oldH = h
    w = el.width = window.innerWidth
    h = el.height = window.innerHeight

    const scaleX = w / oldW
    const scaleY = h / oldH

    for (let f of fireflies) {
      f.x *= scaleX
      f.y *= scaleY
    }
  }
  window.addEventListener('resize', handleResize)

  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  // Click to scatter nearby fireflies
  window.addEventListener('click', () => {
    for (let f of fireflies) {
      const dx = f.x - mouse.x
      const dy = f.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < interactionRadius) {
        const force = 3
        const normX = dx / dist
        const normY = dy / dist

        f.vx = normX * force
        f.vy = normY * force
      }
    }
  })

  // Configuration
  const baseCount = 64
  const minAlpha = 0.3
  const maxAlpha = 1
  const pulseSpeed = 0.015
  const radiusRange = [2, 5]
  const speedRangeX = [-0.5, 0.5]
  const speedRangeY = [-0.5, 0.5]

  // Firefly count based on screen size
  const width = window.innerWidth
  let NUM_FIREFLIES = baseCount
  if (width < 640) NUM_FIREFLIES = Math.floor(baseCount / 2)
  else if (width < 1024) NUM_FIREFLIES = Math.floor(baseCount / 1.5)

  // Firefly array
  const fireflies = Array.from({ length: NUM_FIREFLIES }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0],
    dx: Math.random() * (speedRangeX[1] - speedRangeX[0]) + speedRangeX[0],
    dy: Math.random() * (speedRangeY[1] - speedRangeY[0]) + speedRangeY[0],
    alpha: Math.random() * (maxAlpha - minAlpha) + minAlpha,
    pulseDir: Math.random() > 0.5 ? 1 : -1,
    vx: 0, // Repulsion velocity x
    vy: 0, // Repulsion velocity y
  }))

  // Main animation loop
  const animate = () => {
    ctx.clearRect(0, 0, w, h)

    for (let f of fireflies) {
      // Glow pulsing
      f.alpha += f.pulseDir * pulseSpeed
      if (f.alpha >= maxAlpha) {
        f.alpha = maxAlpha
        f.pulseDir = -1
      } else if (f.alpha <= minAlpha) {
        f.alpha = minAlpha
        f.pulseDir = 1
      }

      const velocityMagnitude = Math.hypot(f.vx, f.vy)

      if (velocityMagnitude > 0.1) {
        // Continue repulsion motion
        f.x += f.vx
        f.y += f.vy
        f.vx *= 0.9
        f.vy *= 0.9
      } else if (mouse.x !== null && mouse.y !== null) {
        // Start attraction when repulsion stops
        const dx = mouse.x - f.x
        const dy = mouse.y - f.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < interactionRadius) {
          const attractionStrength = 0.02
          f.x += dx * attractionStrength
          f.y += dy * attractionStrength
        }
      }

      // Draw firefly
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 150, ${f.alpha})`
      ctx.shadowColor = `rgba(255, 255, 150, ${f.alpha})`
      ctx.shadowBlur = 12
      ctx.fill()

      // Base drift
      f.x += f.dx
      f.y += f.dy

      // Screen wrap and bounce
      if (f.x < 0 || f.x > w) f.dx *= -1
      if (f.y < 0) f.y = h
      if (f.y > h) f.y = 0
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', () => {})
    window.removeEventListener('click', () => {})
  })
})
</script>

<template>
  <canvas ref="canvas" class="w-full h-full pointer-events-none bg-black"></canvas>
</template>
