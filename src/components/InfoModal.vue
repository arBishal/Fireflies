<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Tooltip from './Tooltip.vue'

const emit = defineEmits(['update:isOpen'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  selectedColor: {
    type: String,
    default: '#ddff11',
  },
})

const isFaded = ref(false)
let fadeTimer = null

const startFadeTimer = () => {
  clearTimeout(fadeTimer)
  fadeTimer = setTimeout(() => {
    isFaded.value = true
  }, 10000) // 10 seconds
}

const handleMouseEnter = () => {
  isFaded.value = false
  startFadeTimer()
}

const handleMouseLeave = () => {
  startFadeTimer()
}

const toggleModal = () => {
  emit('update:isOpen', !props.isOpen)
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('update:isOpen', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  startFadeTimer()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  clearTimeout(fadeTimer)
})
</script>

<template>
  <!-- Info Button -->
  <div
    class="fixed top-6 right-6 z-50 transition-opacity duration-500"
    :class="{ 'opacity-25': isFaded, 'opacity-100': !isFaded }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <Tooltip text="Info">
      <button
        @click="toggleModal"
        class="text-white transition-all duration-300 active:scale-90"
        @mouseenter="$event.currentTarget.style.color = selectedColor"
        @mouseleave="$event.currentTarget.style.color = ''"
      >
        <InformationCircleIcon class="w-8 h-8" />
      </button>
    </Tooltip>
  </div>

  <!-- Modal Dropdown -->
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed top-16 right-4 z-40"
      @click.stop
    >
      <!-- Dropdown Content -->
      <div
        class="bg-black/80 border border-white/20 rounded-2xl p-6 w-80 text-white shadow-xl"
      >
        <!-- Close Button -->
        <button
          @click="toggleModal"
          class="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <!-- Content -->
        <h2 class="text-2xl font-bold mb-4">Fireflies</h2>
        <div class="space-y-3 text-sm text-white/80">
          <p>A mesmerizing canvas of glowing fireflies that react to your touch.</p>
          
          <div class="pt-2">
            <h3 class="font-semibold text-white mb-2">Interactions:</h3>
            <ul class="space-y-1 pl-4">
              <li>• <strong>Hover</strong>: Fireflies are gently attracted</li>
              <li>• <strong>Click</strong>: Nearby fireflies scatter away</li>
            </ul>
          </div>

          <div class="pt-2">
            <h3 class="font-semibold text-white mb-2">Controls:</h3>
            <ul class="space-y-1 pl-4">
              <li>• Adjust population, speed, and size</li>
              <li>• Choose from 3 color swatches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Invisible backdrop to close on click outside -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30"
    @click="toggleModal"
  ></div>
</template>
