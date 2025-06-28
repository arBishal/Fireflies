<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const el = canvas.value
  const ctx = el.getContext('2d')
  let animationFrameId

  // Initial canvas sizing
  let w = (el.width = window.innerWidth)
  let h = (el.height = window.innerHeight)

  const handleResize = () => {
    w = el.width = window.innerWidth
    h = el.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)

  const baseCount = 32
  const width = window.innerWidth
  let NUM_FIREFLIES = baseCount

  if (width < 640) {
    NUM_FIREFLIES = Math.floor(baseCount / 2)
  } else if (width < 1024) {
    NUM_FIREFLIES = Math.floor(baseCount / 1.5)
  }

  const fireflies = Array.from({ length: NUM_FIREFLIES }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    dx: Math.random() * 0.6 - 0.3,
    dy: -(Math.random() * 0.3 + 0.1),
    alpha: Math.random() * 0.5 + 0.5,
    pulseDir: Math.random() > 0.5 ? 1 : -1,
  }))

  const animate = () => {
    ctx.clearRect(0, 0, w, h)

    for (let f of fireflies) {
      // Pulse alpha
      f.alpha += f.pulseDir * 0.01
      if (f.alpha >= 1) {
        f.alpha = 1
        f.pulseDir = -1
      } else if (f.alpha <= 0.3) {
        f.alpha = 0.3
        f.pulseDir = 1
      }

      // Draw
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 150, ${f.alpha})`
      ctx.shadowColor = `rgba(255, 255, 150, ${f.alpha})`
      ctx.shadowBlur = 12
      ctx.fill()

      // Move
      f.x += f.dx
      f.y += f.dy

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
  })
})
</script>

<template>
  <canvas ref="canvas" class="w-full h-full pointer-events-none bg-black"></canvas>
</template>
