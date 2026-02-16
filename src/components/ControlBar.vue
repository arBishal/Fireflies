<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  SwatchIcon,
  Squares2X2Icon,
  BoltIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/vue/24/outline'

import { PRESETS, COLOR_OPTIONS, DEFAULT_COLOR } from '../constants/constants.js'
import { useAutoFade } from '../composables/useAutoFade.js'
import ControlSection from './ControlSection.vue'

const emit = defineEmits(['update:speedLevel', 'update:countLevel', 'update:sizeLevel', 'update:selectedColors'])

const root = ref(null)

const activeSection = ref(null)
const fireflyCountLevel = ref(1)
const speedLevel = ref(1)
const sizeLevel = ref(1)
const selectedColors = ref([DEFAULT_COLOR])

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

const { isFaded, handleMouseEnter, handleMouseLeave, startFadeTimer } = useAutoFade()

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
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
      <ControlSection 
        :is-active="activeSection === 'count'"
        tooltip-text="Change Population"
        :hover-color="selectedColors[0]"
        @toggle="toggleSection('count')"
      >
        <template #icon>
          <Squares2X2Icon class="w-5 h-5 md:w-6 md:h-6" />
        </template>
        <template #content>
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
              :aria-label="'Set population to ' + preset.label"
            >
              <component :is="preset.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </template>
      </ControlSection>

      <!-- SPEED -->
      <ControlSection 
        :is-active="activeSection === 'speed'"
        tooltip-text="Change Speed"
        :hover-color="selectedColors[0]"
        @toggle="toggleSection('speed')"
      >
        <template #icon>
          <BoltIcon class="w-5 h-5 md:w-6 md:h-6" />
        </template>
        <template #content>
          <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
            <button
              v-for="(preset, index) in PRESETS"
              :key="'speed-' + index"
              @click="speedLevel = index; emit('update:speedLevel', index)"
              class="flex items-center justify-center p-2 transition-all duration-300"
              :class="
                speedLevel === index ? 'bg-white/20 rounded-full' : 'opacity-50 hover:opacity-100'
              "
              :aria-label="'Set speed to ' + preset.label"
            >
              <component :is="preset.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </template>
      </ControlSection>

      <!-- SIZE -->
      <ControlSection 
        :is-active="activeSection === 'size'"
        tooltip-text="Change Size"
        :hover-color="selectedColors[0]"
        @toggle="toggleSection('size')"
      >
        <template #icon>
          <ArrowsPointingOutIcon class="w-5 h-5 md:w-6 md:h-6" />
        </template>
        <template #content>
          <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
            <button
              v-for="(preset, index) in PRESETS"
              :key="'size-' + index"
              @click="sizeLevel = index; emit('update:sizeLevel', index)"
              class="flex items-center justify-center p-2 transition-all duration-300"
              :class="
                sizeLevel === index ? 'bg-white/20 rounded-full' : 'opacity-50 hover:opacity-100'
              "
              :aria-label="'Set size to ' + preset.label"
            >
              <component :is="preset.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </template>
      </ControlSection>

      <!-- COLOR -->
      <ControlSection 
        :is-active="activeSection === 'color'"
        tooltip-text="Change Swatch"
        :hover-color="selectedColors[0]"
        @toggle="toggleSection('color')"
      >
        <template #icon>
          <SwatchIcon class="w-5 h-5 md:w-6 md:h-6" />
        </template>
        <template #content>
          <div class="flex gap-4 bg-black/80 rounded-xl px-4 py-3">
            <button
              v-for="color in COLOR_OPTIONS"
              :key="color"
              :style="{ backgroundColor: color }"
              @click="toggleColor(color)"
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 cursor-pointer transition duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              :class="
                selectedColors.includes(color)
                  ? 'ring-2 ring-offset-1 ring-white/50'
                  : 'opacity-50 hover:opacity-80'
              "
              :aria-label="'Select color ' + color"
            ></button>
          </div>
        </template>
      </ControlSection>
    </div>
  </div>
</template>
