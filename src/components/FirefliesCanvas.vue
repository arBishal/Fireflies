<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { SPEED_LEVELS, FIREFLY_COUNT_LEVELS, SIZE_LEVELS, DEFAULT_COLOR, BREAKPOINTS, FIREFLY_CONFIG } from '../constants/constants.js'

// Helper to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

const props = defineProps({
  speedLevel: {
    type: Number,
    default: 1,
  },
  countLevel: {
    type: Number,
    default: 1,
  },
  sizeLevel: {
    type: Number,
    default: 1,
  },
  selectedColors: {
    type: Array,
    default: () => [DEFAULT_COLOR],
  },
})

const canvas = ref(null)

onMounted(() => {
  const el = canvas.value
  const ctx = el.getContext('2d')
  let animationFrameId

  // Canvas size
  let w = (el.width = window.innerWidth)
  let h = (el.height = window.innerHeight)

  const mouse = { x: null, y: null }
  const interactionRadius = FIREFLY_CONFIG.INTERACTION_RADIUS

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

    // Adjust firefly count based on new screen size
    const targetCount = getEffectiveCount(FIREFLY_COUNT_LEVELS[props.countLevel])
    if (fireflies.length < targetCount) {
      const toAdd = targetCount - fireflies.length
      fireflies.push(...Array.from({ length: toAdd }).map(() => createFirefly(SIZE_LEVELS[props.sizeLevel], props.selectedColors[0])))
    } else if (fireflies.length > targetCount) {
      fireflies.splice(targetCount)
    }
  }

  // Screen size multiplier for population (Tailwind breakpoints)
  const getScreenSizeMultiplier = () => {
    const width = window.innerWidth
    if (width < BREAKPOINTS.SM) return 0.5  // Below sm
    if (width < BREAKPOINTS.MD) return 0.75 // Below md
    return 1 // md and above
  }

  // Calculate effective firefly count based on screen size
  const getEffectiveCount = (baseCount) => {
    return Math.floor(baseCount * getScreenSizeMultiplier())
  }

  // Function to create a firefly
  const createFirefly = (sizeRange, color = DEFAULT_COLOR) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
    dx: Math.random() * (FIREFLY_CONFIG.SPEED_RANGE_X[1] - FIREFLY_CONFIG.SPEED_RANGE_X[0]) + FIREFLY_CONFIG.SPEED_RANGE_X[0],
    dy: Math.random() * (FIREFLY_CONFIG.SPEED_RANGE_Y[1] - FIREFLY_CONFIG.SPEED_RANGE_Y[0]) + FIREFLY_CONFIG.SPEED_RANGE_Y[0],
    alpha: Math.random() * (FIREFLY_CONFIG.MAX_ALPHA - FIREFLY_CONFIG.MIN_ALPHA) + FIREFLY_CONFIG.MIN_ALPHA,
    pulseDir: Math.random() > 0.5 ? 1 : -1,
    vx: 0,
    vy: 0,
    repelled: false,
    repelStartX: 0,
    repelStartY: 0,
    repelDistanceTraveled: 0,
    color: color,
  })

  // Create initial fireflies (all yellow by default)
  let fireflies = Array.from({ length: getEffectiveCount(FIREFLY_COUNT_LEVELS[props.countLevel]) }).map(() =>
    createFirefly(SIZE_LEVELS[props.sizeLevel], props.selectedColors[0])
  )

  // Watch for count/size changes and rebuild fireflies
  watch(
    () => [props.countLevel, props.sizeLevel],
    ([newCount, newSize]) => {
      const targetCount = getEffectiveCount(FIREFLY_COUNT_LEVELS[newCount])
      const sizeRange = SIZE_LEVELS[newSize]

      if (fireflies.length < targetCount) {
        // Add new fireflies with default color
        const toAdd = targetCount - fireflies.length
        fireflies.push(...Array.from({ length: toAdd }).map(() => createFirefly(sizeRange, props.selectedColors[0])))
      } else if (fireflies.length > targetCount) {
        // Remove excess fireflies
        fireflies.splice(targetCount)
      }

      // Update existing fireflies' sizes
      fireflies.forEach((f) => {
        f.r = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
      })
    }
  )

  // Watch for color changes and redistribute
  watch(
    () => props.selectedColors,
    (newColors) => {
      // Simple equal redistribution among all selected colors
      const perColor = Math.floor(fireflies.length / newColors.length)
      let index = 0
      newColors.forEach((color, colorIndex) => {
        const count = colorIndex === newColors.length - 1 
          ? fireflies.length - index // Last color gets remainder
          : perColor
        for (let i = 0; i < count; i++) {
          if (fireflies[index]) {
            fireflies[index].color = color
            index++
          }
        }
      })
    },
    { deep: true }
  )

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
        const baseForce = FIREFLY_CONFIG.REPEL_FORCE
        const multiplier = FIREFLY_CONFIG.REPEL_MULTIPLIER
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
      f.alpha += f.pulseDir * FIREFLY_CONFIG.PULSE_SPEED
      if (f.alpha >= FIREFLY_CONFIG.MAX_ALPHA) {
        f.alpha = FIREFLY_CONFIG.MAX_ALPHA
        f.pulseDir = -1
      } else if (f.alpha <= FIREFLY_CONFIG.MIN_ALPHA) {
        f.alpha = FIREFLY_CONFIG.MIN_ALPHA
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
          const attractionStrength = FIREFLY_CONFIG.ATTRACTION_STRENGTH
          f.x += dx * attractionStrength
          f.y += dy * attractionStrength
        }
      }

      // Draw firefly
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      
      // Draw firefly
      const rgb = hexToRgb(f.color) || { r: 255, g: 255, b: 0 }
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${f.alpha})`
      ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${f.alpha})`
      ctx.shadowBlur = 8
      ctx.fill()

      // Base drift (apply speed multiplier)
      const speedMultiplier = SPEED_LEVELS[props.speedLevel]
      f.x += f.dx * speedMultiplier
      f.y += f.dy * speedMultiplier

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
