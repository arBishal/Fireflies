<script setup>
import { ref } from 'vue'
import { DEFAULT_COLOR } from './constants/constants.js'
import FireflyCanvas from './components/FirefliesCanvas.vue'
import ControlBar from './components/ControlBar.vue'
import InfoModal from './components/InfoModal.vue'

const speedLevel = ref(1)
const countLevel = ref(1)
const sizeLevel = ref(1)
const selectedColors = ref([DEFAULT_COLOR])
const isInfoOpen = ref(false)
</script>

<template>
  <main>
    <FireflyCanvas :speedLevel="speedLevel" :countLevel="countLevel" :sizeLevel="sizeLevel" :selectedColors="selectedColors" />
    <ControlBar 
      @update:speedLevel="v => speedLevel = v" 
      @update:countLevel="v => countLevel = v"
      @update:sizeLevel="v => sizeLevel = v"
      @update:selectedColors="v => selectedColors = v"
    />
    <InfoModal v-model:isOpen="isInfoOpen" :selectedColor="selectedColors[0]" />
  </main>
</template>
