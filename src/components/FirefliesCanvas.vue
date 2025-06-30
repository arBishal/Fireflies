<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Reference to the <canvas> element
const canvas = ref(null)

onMounted(() => {
  const el = canvas.value
  const ctx = el.getContext('2d')
  let animationFrameId

  // Set initial canvas size
  let w = (el.width = window.innerWidth)
  let h = (el.height = window.innerHeight)

  // Handle window resize
  const handleResize = () => {
    const oldW = w
    const oldH = h
    w = el.width = window.innerWidth
    h = el.height = window.innerHeight

    const scaleX = w / oldW
    const scaleY = h / oldH

    // Reposition fireflies proportionally
    for (let f of fireflies) {
      f.x *= scaleX
      f.y *= scaleY
    }
  }
  window.addEventListener('resize', handleResize)

  // === CONFIGURATION SETTINGS ===
  const baseCount = 48 // Number of fireflies on large screens
  const minAlpha = 0.3 // Minimum glow intensity (transparency)
  const maxAlpha = 1 // Maximum glow intensity
  const pulseSpeed = 0.015 // Speed at which fireflies pulse (increase/decrease glow)
  const radiusRange = [2, 5] // Radius size range of each firefly
  const speedRangeX = [-0.75, 0.75] // Horizontal speed range
  const speedRangeY = [-0.75, 0.75] // Vertical (upward) speed range

  // Determine firefly count based on screen width
  const width = window.innerWidth
  let NUM_FIREFLIES = baseCount
  if (width < 640) {
    NUM_FIREFLIES = Math.floor(baseCount / 2)
  } else if (width < 1024) {
    NUM_FIREFLIES = Math.floor(baseCount / 1.5)
  }

  // Generate fireflies with randomized properties
  const fireflies = Array.from({ length: NUM_FIREFLIES }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0],
    dx: Math.random() * (speedRangeX[1] - speedRangeX[0]) + speedRangeX[0],
    dy: Math.random() * (speedRangeY[1] - speedRangeY[0]) + speedRangeY[0],
    alpha: Math.random() * (maxAlpha - minAlpha) + minAlpha,
    pulseDir: Math.random() > 0.5 ? 1 : -1,
  }))

  // Main animation loop
  const animate = () => {
    ctx.clearRect(0, 0, w, h)

    for (let f of fireflies) {
      // Update glow intensity (pulsing effect)
      f.alpha += f.pulseDir * pulseSpeed
      if (f.alpha >= maxAlpha) {
        f.alpha = maxAlpha
        f.pulseDir = -1
      } else if (f.alpha <= minAlpha) {
        f.alpha = minAlpha
        f.pulseDir = 1
      }

      // Draw the firefly
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 150, ${f.alpha})`
      ctx.shadowColor = `rgba(255, 255, 150, ${f.alpha})`
      ctx.shadowBlur = 12
      ctx.fill()

      // Update position
      f.x += f.dx
      f.y += f.dy

      // Handle screen boundaries
      if (f.x < 0 || f.x > w) f.dx *= -1 // Bounce horizontally
      if (f.y < 0) f.y = h // Wrap from top to bottom
      if (f.y > h) f.y = 0
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // Cleanup on component unmount
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<template>
  <canvas ref="canvas" class="w-full h-full pointer-events-none bg-black"></canvas>
</template>
