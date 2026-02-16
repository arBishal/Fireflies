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

const handleClick = () => {
  repelFireflies(fireflies.value, mouse.x, mouse.y)
}

const handleTouchStart = (e) => {
  const touch = e.touches[0]
  if (touch) {
    mouse.x = touch.clientX
    mouse.y = touch.clientY
    handleClick()
  }
}

const animate = () => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width.value, height.value)
  const speedMultiplier = SPEED_LEVELS[props.speedLevel]

  for (let f of fireflies.value) {
    updateFirefly(f, width.value, height.value, speedMultiplier)
    drawFirefly(ctx, f)
  }

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  // Initialize
  updateFireflies()
  
  // Start loop
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 pointer-events-auto bg-black"
    @mousemove="handleMouseMove"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @click="handleClick"
  ></canvas>
</template>
