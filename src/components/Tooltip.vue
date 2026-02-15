<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'top', // top, bottom, left, right
  },
})

const isVisible = ref(false)

const showTooltip = () => {
  isVisible.value = true
}

const hideTooltip = () => {
  isVisible.value = false
}

const positionClasses = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'top-full mt-3'
    case 'left':
      return 'right-full mr-3'
    case 'right':
      return 'left-full ml-3'
    default: // top
      return 'bottom-full mb-3'
  }
})
</script>

<template>
  <div class="relative inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click="hideTooltip">
    <slot></slot>
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        class="absolute left-1/2 -translate-x-1/2 z-50 px-2 py-1 text-xs text-white bg-black/50 rounded-full whitespace-nowrap pointer-events-none mb-5 bottom-full"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
