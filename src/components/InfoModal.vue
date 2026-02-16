<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'
import Tooltip from './Tooltip.vue'
import { DEFAULT_COLOR } from '../constants/constants.js'
import { useAutoFade } from '../composables/useAutoFade.js'

const emit = defineEmits(['update:isOpen'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  selectedColor: {
    type: String,
    default: DEFAULT_COLOR,
  },
})

const { isFaded, handleMouseEnter, handleMouseLeave } = useAutoFade()
const starCount = ref(null)

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
  
  // Fetch GitHub stars
  fetch('https://api.github.com/repos/arBishal/Fireflies')
    .then(res => res.json())
    .then(data => {
      starCount.value = data.stargazers_count
    })
    .catch(err => console.error('Failed to fetch stars:', err))
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
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
        class="text-neutral-100 transition-all duration-300 active:scale-90"
        @mouseenter="$event.currentTarget.style.color = selectedColor"
        @mouseleave="$event.currentTarget.style.color = ''"
        aria-label="Open Info Modal"
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <!-- Dropdown Content -->
      <div
        class="bg-black/80 backdrop-blur-md border border-neutral-100/20 rounded-lg px-6 py-4 w-80 text-neutral-100"
      >
        <!-- Close Button -->
        <button
          @click="toggleModal"
          class="absolute top-5 right-6 text-neutral-100/60 hover:text-neutral-100 transition-colors"
          aria-label="Close Info Modal"
        >
          <XMarkIcon class="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        <!-- Content -->
        <h2 id="modal-title" class="text-2xl font-bold mb-4 text-neutral-100/90">Fireflies</h2>
        <div class="space-y-3 text-sm text-neutral-100/80">
          <p>A mesmerizing canvas of glowing fireflies that react to your touch.</p>
          
          <div>
            <h3 class="font-semibold text-neutral-100/90 mb-2">Interactions</h3>
            <ul class="space-y-1 list-disc list-inside marker:text-neutral-100/60">
              <li>Movee the cursor to attract fireflies.</li>
              <li>Click to scatter them away.</li>
            </ul>
          </div>

          <div>
            <h3 class="font-bold text-neutral-100/90 mb-2">Controls</h3>
            <ul class="space-y-1 list-disc list-inside marker:text-neutral-100/60">
              <li>Adjust population, speed, and size.</li>
              <li>Choose from 3 color swatches.</li>
            </ul>
          </div>

          <!-- GitHub Link & Stars -->
          <div class="border-t border-neutral-100/20 pt-2 mt-4 flex flex items-center justify-between gap-2">
            <a
              href="https://github.com/arBishal/Fireflies"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-neutral-100/60 hover:text-neutral-100 transition-colors group"
              aria-label="View source on GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                class="w-5 h-5 sm:w-6 sm:h-6 fill-current"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                />
              </svg>
              <span class="text-sx sm:text-sm group-hover:underline underline-offset-4">View Source Code</span>
            </a>
            
            <!-- Star Count -->
            <div 
              v-if="starCount !== null"
              class="flex items-center gap-1 rounded-full text-sm text-neutral-100/80"
              title="GitHub Stars"
            >
              <StarIcon 
                class="w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300"
                :style="{ color: selectedColor }"
              />
              <span>{{ starCount }}</span>
            </div>
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
