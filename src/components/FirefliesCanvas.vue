<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { SPEED_LEVELS, FIREFLY_COUNT_LEVELS, SIZE_LEVELS, DEFAULT_COLOR } from '../constants/constants.js'
import { useCanvas } from '../composables/useCanvas.js'
import { useFireflyPhysics } from '../composables/useFireflyPhysics.js'
import { useFireflies } from '../composables/useFireflies.js'

const props = defineProps({
  speedLevel: { 
    type: Number, 
    default: 1,
    validator: (v) => v >= 0 && v < SPEED_LEVELS.length 
  },
  countLevel: { 
    type: Number, 
    default: 1,
    validator: (v) => v >= 0 && v < FIREFLY_COUNT_LEVELS.length
  },
  sizeLevel: { 
    type: Number, 
    default: 1,
    validator: (v) => v >= 0 && v < SIZE_LEVELS.length
  },
  selectedColors: { 
    type: Array, 
    default: () => [DEFAULT_COLOR],
    validator: (v) => v.length > 0 && v.every(c => /^#[0-9A-F]{6}$/i.test(c))
  },
})

// Composables
const { canvas, width, height } = useCanvas()
const { 
  mouse, 
  handleMouseMove, 
  handleTouchMove, 
  repelFireflies, 
  updateFirefly, 
  drawFirefly 
} = useFireflyPhysics()

// Pass props to useFireflies
const { fireflies, updateFireflies } = useFireflies(props, width, height)

// Lifecycle
let animationFrameId
let touchHandled = false

// --- Event Handlers ---

/**
 * Handles click interactions to repel fireflies.
 * Guarded against synthetic click events fired by the browser after touch.
 */
const handleClick = () => {
  if (touchHandled) {
    touchHandled = false
    return
  }
  repelFireflies(fireflies.value, mouse.x, mouse.y)
}

/**
 * Handles touch start interactions.
 * Only updates mouse position so the attraction logic takes effect.
 * @param {TouchEvent} e - Touch event
 */
const handleTouchStart = (e) => {
  const touch = e.touches[0]
  if (touch) {
    mouse.x = touch.clientX
    mouse.y = touch.clientY
  }
}

/**
 * Handles touch end interactions.
 * Repels fireflies from the last known touch position and clears the mouse.
 */
const handleTouchEnd = () => {
  if (mouse.x !== null && mouse.y !== null) {
    repelFireflies(fireflies.value, mouse.x, mouse.y)
  }
  mouse.x = null
  mouse.y = null
  touchHandled = true
}

/**
 * The Main Animation Loop.
 * Runs approximately 60 times per second using requestAnimationFrame.
 */
const animate = () => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  // 1. Clear the canvas for the new frame
  ctx.clearRect(0, 0, width.value, height.value)
  
  // 2. Determine current speed multiplier
  const speedMultiplier = SPEED_LEVELS[props.speedLevel]

  // 3. Update and draw each firefly
  for (let f of fireflies.value) {
    updateFirefly(f, width.value, height.value, speedMultiplier)
    drawFirefly(ctx, f)
  }

  // 4. Request the next frame
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  // Initialize fireflies based on default props
  updateFireflies()
  
  // Start the animation loop
  animate()

  // --- Interaction Listeners ---
  // We attach movement listeners to the window so fireflies track the cursor
  // even when it's hovering over UI elements (like the control bar).
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove)
  
  // Handle start events to initialize mouse position (optional, but good for touch)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('click', handleClick) // Just in case
})
</script>

<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 pointer-events-auto bg-black"
    @click="handleClick"
  ></canvas>
</template>
