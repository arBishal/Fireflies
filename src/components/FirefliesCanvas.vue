<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const el = canvas.value
  const ctx = el.getContext('2d')
  let animationFrameId

  // Canvas size
  let w = (el.width = window.innerWidth)
  let h = (el.height = window.innerHeight)

  const mouse = { x: null, y: null }
  const interactionRadius = 160

  // Resize handler
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

  // Firefly Config
  const baseCount = 64
  const minAlpha = 0.1
  const maxAlpha = 1
  const pulseSpeed = 0.015
  const radiusRange = [2, 5]
  const speedRangeX = [-0.5, 0.5]
  const speedRangeY = [-0.5, 0.5]

  // Count adjustment
  let NUM_FIREFLIES = baseCount
  const screenW = window.innerWidth
  if (screenW < 640) NUM_FIREFLIES = Math.floor(baseCount / 2)
  else if (screenW < 1024) NUM_FIREFLIES = Math.floor(baseCount / 1.5)

  // Create fireflies
  const fireflies = Array.from({ length: NUM_FIREFLIES }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0],
    dx: Math.random() * (speedRangeX[1] - speedRangeX[0]) + speedRangeX[0],
    dy: Math.random() * (speedRangeY[1] - speedRangeY[0]) + speedRangeY[0],
    alpha: Math.random() * (maxAlpha - minAlpha) + minAlpha,
    pulseDir: Math.random() > 0.5 ? 1 : -1,
    vx: 0,
    vy: 0,
    repelled: false,
    repelStartX: 0,
    repelStartY: 0,
    repelDistanceTraveled: 0,
  }))

  // Mouse move: update position & reset repelled
  const handleMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    for (let f of fireflies) {
      f.repelled = false
    }
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    if (touch) {
      mouse.x = touch.clientX
      mouse.y = touch.clientY
      for (let f of fireflies) {
        f.repelled = false
      }
    }
  }

  // Click: repel nearby fireflies
  const handleClick = () => {
    for (let f of fireflies) {
      const dx = f.x - mouse.x
      const dy = f.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < interactionRadius) {
        const baseForce = 3 // force
        const multiplier = 2 // initial speed multiplier
        const normX = dx / dist
        const normY = dy / dist
        f.vx = normX * baseForce * multiplier
        f.vy = normY * baseForce * multiplier

        f.repelled = true
        f.repelStartX = f.x
        f.repelStartY = f.y
        f.repelDistanceTraveled = 0
      }
    }
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    if (touch) {
      mouse.x = touch.clientX
      mouse.y = touch.clientY
      handleClick()
    }
  }

  // Animate
  const animate = () => {
    ctx.clearRect(0, 0, w, h)

    for (let f of fireflies) {
      // Pulsing alpha
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
        // Repelled motion
        f.x += f.vx
        f.y += f.vy

        // Track distance traveled since repel start
        if (f.repelled) {
          const dx = f.x - f.repelStartX
          const dy = f.y - f.repelStartY
          f.repelDistanceTraveled = Math.sqrt(dx * dx + dy * dy)
          if (f.repelDistanceTraveled >= interactionRadius) {
            f.repelled = false
          }
        }

        // Velocity decay
        f.vx *= 0.9
        f.vy *= 0.9
      } else if (!f.repelled && mouse.x !== null && mouse.y !== null) {
        // Attraction with reduced velocity
        const dx = mouse.x - f.x
        const dy = mouse.y - f.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < interactionRadius) {
          const attractionStrength = 0.01
          f.x += dx * attractionStrength
          f.y += dy * attractionStrength
        }
      }

      // Draw firefly
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 100, ${f.alpha})`
      ctx.shadowColor = `rgba(255, 255, 100, ${f.alpha})`
      ctx.shadowBlur = 8
      ctx.fill()

      // Base drift
      f.x += f.dx
      f.y += f.dy

      // Screen wrap / bounce
      if (f.x < 0 || f.x > w) f.dx *= -1
      if (f.y < 0) f.y = h
      if (f.y > h) f.y = 0
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // Event listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('click', handleClick)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })

  // Cleanup
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('click', handleClick)
    window.removeEventListener('touchstart', handleTouchStart)
  })
})
</script>

<template>
  <canvas ref="canvas" class="w-full h-full pointer-events-none bg-black"></canvas>
</template>
