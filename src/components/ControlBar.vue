<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  SwatchIcon,
  Squares2X2Icon,
  BoltIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/vue/24/outline'

import { PRESETS, COLOR_OPTIONS } from '../constants/constants.js'
import Tooltip from './Tooltip.vue'

const emit = defineEmits(['update:speedLevel', 'update:countLevel', 'update:sizeLevel', 'update:selectedColors'])

const root = ref(null)

const activeSection = ref(null)
const fireflyCountLevel = ref(1)
const speedLevel = ref(1)
const sizeLevel = ref(1)
const selectedColors = ref(['#ddff11'])
const isFaded = ref(false)
let fadeTimer = null

const toggleColor = (color) => {
  // Single selection - always replace with the clicked color
  selectedColors.value = [color]
  emit('update:selectedColors', [color])
}

const toggleSection = (section) => {
  activeSection.value = activeSection.value === section ? null : section
}

const handleClickOutside = (e) => {
  if (root.value && !root.value.contains(e.target)) {
    activeSection.value = null
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    activeSection.value = null
  }
}

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  startFadeTimer() // Start the initial fade timer
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  clearTimeout(fadeTimer)
})
</script>

<template>
  <div
    class="fixed bottom-4 right-1/2 translate-x-1/2 z-50 w-fit backdrop-blur-xs text-white transition-opacity duration-500"
    :class="{ 'opacity-25': isFaded, 'opacity-100': !isFaded }"
    ref="root"
    @click.stop
    @mousedown.stop
    @mousemove.stop
    @touchstart.stop
    @touchmove.stop
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="flex justify-center items-center gap-4 md:gap-6 mt-2 border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full"
    >
      <!-- COUNT -->
      <div class="relative">
        <Tooltip text="Change Population">
          <button class="flex flex-col items-center text-xs" @click="toggleSection('count')">
            <Squares2X2Icon
              class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
            />
          </button>
        </Tooltip>
        <Transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="activeSection === 'count'"
            class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform"
          >
            <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
              <button
                v-for="(preset, index) in PRESETS"
                :key="'count-' + index"
                @click="fireflyCountLevel = index; emit('update:countLevel', index)"
                class="flex items-center justify-center p-2 transition-all duration-300"
                :class="
                  fireflyCountLevel === index
                    ? 'bg-white/20 rounded-full'
                    : 'opacity-50 hover:opacity-100'
                "
              >
                <component :is="preset.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- SPEED -->
      <div class="relative">
        <Tooltip text="Change Speed">
          <button class="flex flex-col items-center text-xs" @click="toggleSection('speed')">
            <BoltIcon
              class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
            />
          </button>
        </Tooltip>
        <Transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="activeSection === 'speed'"
            class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform"
          >
            <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
              <button
                v-for="(preset, index) in PRESETS"
                :key="'speed-' + index"
                @click="speedLevel = index; emit('update:speedLevel', index)"
                class="flex items-center justify-center p-2 transition-all duration-300"
                :class="
                  speedLevel === index ? 'bg-white/20 rounded-full' : 'opacity-50 hover:opacity-100'
                "
              >
                <component :is="preset.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- SIZE -->
      <div class="relative">
        <Tooltip text="Change Size">
          <button class="flex flex-col items-center text-xs" @click="toggleSection('size')">
            <ArrowsPointingOutIcon
              class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
            />
          </button>
        </Tooltip>
        <Transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="activeSection === 'size'"
            class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform"
          >
            <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
              <button
                v-for="(preset, index) in PRESETS"
                :key="'size-' + index"
                @click="sizeLevel = index; emit('update:sizeLevel', index)"
                class="flex items-center justify-center p-2 transition-all duration-300"
                :class="
                  sizeLevel === index ? 'bg-white/20 rounded-full' : 'opacity-50 hover:opacity-100'
                "
              >
                <component :is="preset.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- COLOR -->
      <div class="relative">
        <Tooltip text="Change Swatch">
          <button class="flex flex-col items-center text-xs" @click="toggleSection('color')">
            <SwatchIcon
              class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
            />
          </button>
        </Tooltip>
        <Transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="activeSection === 'color'"
            class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform"
          >
            <div class="flex gap-4 bg-black/80 rounded-xl px-4 py-3">
              <div
                v-for="color in COLOR_OPTIONS"
                :key="color"
                :style="{ backgroundColor: color }"
                @click="toggleColor(color)"
                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 cursor-pointer transition duration-300"
                :class="
                  selectedColors.includes(color)
                    ? 'ring-2 ring-offset-1 ring-white/50'
                    : 'opacity-50 hover:opacity-80'
                "
              ></div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
