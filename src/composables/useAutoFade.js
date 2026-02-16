import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useAutoFade(delay = 10000) {
    const isFaded = ref(false)
    let fadeTimer = null

    const startFadeTimer = () => {
        clearTimeout(fadeTimer)
        fadeTimer = setTimeout(() => {
            isFaded.value = true
        }, delay)
    }

    const handleMouseEnter = () => {
        isFaded.value = false
        startFadeTimer()
    }

    const handleMouseLeave = () => {
        startFadeTimer()
    }

    onMounted(() => {
        startFadeTimer()
    })

    onBeforeUnmount(() => {
        clearTimeout(fadeTimer)
    })

    return {
        isFaded,
        handleMouseEnter,
        handleMouseLeave,
        startFadeTimer // Exported in case manual reset is needed
    }
}
