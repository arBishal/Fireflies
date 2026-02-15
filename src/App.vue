<script setup>
import { ref } from 'vue'
import FireflyCanvas from './components/FirefliesCanvas.vue'
import ControlBar from './components/ControlBar.vue'
import InfoModal from './components/InfoModal.vue'

const speedLevel = ref(1) // Default is index 1 (1x speed)
const countLevel = ref(1) // Default is index 1 (32 fireflies)
const sizeLevel = ref(1) // Default is index 1 (medium size)
const selectedColors = ref(['#ddff11']) // Default is yellow
const isInfoOpen = ref(false)

const handleSpeedChange = (newLevel) => {
  speedLevel.value = newLevel
}

const handleCountChange = (newLevel) => {
  countLevel.value = newLevel
}

const handleSizeChange = (newLevel) => {
  sizeLevel.value = newLevel
}

const handleColorsChange = (newColors) => {
  selectedColors.value = newColors
}
</script>

<template>
  <main>
    <FireflyCanvas :speedLevel="speedLevel" :countLevel="countLevel" :sizeLevel="sizeLevel" :selectedColors="selectedColors" />
    <ControlBar 
      @update:speedLevel="handleSpeedChange" 
      @update:countLevel="handleCountChange"
      @update:sizeLevel="handleSizeChange"
      @update:selectedColors="handleColorsChange"
    />
    <InfoModal v-model:isOpen="isInfoOpen" :selectedColor="selectedColors[0]" />
  </main>
</template>
