import { ref, watch } from 'vue'
import { FIREFLY_COUNT_LEVELS, SIZE_LEVELS, BREAKPOINTS, FIREFLY_CONFIG } from '../constants/constants.js'

/**
 * Manages the fireflies state, creation, and population control.
 * @param {Object} props - The component props (countLevel, sizeLevel, selectedColors)
 * @param {Ref<number>} width - The canvas width ref
 * @param {Ref<number>} height - The canvas height ref
 */
export function useFireflies(props, width, height) {
    const fireflies = ref([])

    // Screen size multiplier for population
    const getScreenSizeMultiplier = () => {
        const w = window.innerWidth
        if (w < BREAKPOINTS.SM) return 0.5
        if (w < BREAKPOINTS.MD) return 0.75
        return 1
    }

    const getEffectiveCount = (baseCount) => {
        return Math.floor(baseCount * getScreenSizeMultiplier())
    }

    const createFirefly = (sizeRange, color) => ({
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        r: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
        dx: Math.random() * (FIREFLY_CONFIG.SPEED_RANGE_X[1] - FIREFLY_CONFIG.SPEED_RANGE_X[0]) + FIREFLY_CONFIG.SPEED_RANGE_X[0],
        dy: Math.random() * (FIREFLY_CONFIG.SPEED_RANGE_Y[1] - FIREFLY_CONFIG.SPEED_RANGE_Y[0]) + FIREFLY_CONFIG.SPEED_RANGE_Y[0],
        alpha: Math.random() * (FIREFLY_CONFIG.MAX_ALPHA - FIREFLY_CONFIG.MIN_ALPHA) + FIREFLY_CONFIG.MIN_ALPHA,
        pulseDir: Math.random() > 0.5 ? 1 : -1,
        vx: 0,
        vy: 0,
        repelled: false,
        repelStartX: 0,
        repelStartY: 0,
        repelDistanceTraveled: 0,
        color: color,
    })

    // Initialize and update fireflies based on props
    const updateFireflies = () => {
        const targetCount = getEffectiveCount(FIREFLY_COUNT_LEVELS[props.countLevel])
        const sizeRange = SIZE_LEVELS[props.sizeLevel]
        const defaultColor = props.selectedColors[0]

        // Add new fireflies
        if (fireflies.value.length < targetCount) {
            const toAdd = targetCount - fireflies.value.length
            const newFireflies = Array.from({ length: toAdd }).map(() =>
                createFirefly(sizeRange, defaultColor)
            )
            fireflies.value.push(...newFireflies)
        }
        // Remove excess
        else if (fireflies.value.length > targetCount) {
            fireflies.value.splice(targetCount)
        }

        // Update sizes for existing
        fireflies.value.forEach(f => {
            // Only update radius if it falls out of range (optional, or just update all)
            // For smoothness, maybe unnecessary to change existing radii constantly, 
            // but let's stick to the original behavior roughly:
            // Actually original behavior updated all radii on change.
            // But we can just leave them or update them. Let's update them to match level.
            f.r = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
        })
    }

    // Handle color redistribution
    const redistributeColors = () => {
        const colors = props.selectedColors
        if (!colors.length) return

        const perColor = Math.floor(fireflies.value.length / colors.length)
        let index = 0

        colors.forEach((color, colorIndex) => {
            const count = colorIndex === colors.length - 1
                ? fireflies.value.length - index
                : perColor

            for (let i = 0; i < count; i++) {
                if (fireflies.value[index]) {
                    fireflies.value[index].color = color
                    index++
                }
            }
        })
    }

    // Watchers
    watch(
        () => [width.value, height.value],
        ([newW, newH], [oldW, oldH]) => {
            if (oldW && oldH) {
                const scaleX = newW / oldW
                const scaleY = newH / oldH
                fireflies.value.forEach(f => {
                    f.x *= scaleX
                    f.y *= scaleY
                })
            }
            // Update count if needed
            updateFireflies()
        }
    )

    watch(() => [props.countLevel, props.sizeLevel], updateFireflies)

    watch(() => props.selectedColors, redistributeColors, { deep: true })

    return {
        fireflies,
        updateFireflies, // exposed for initial call
        redistributeColors
    }
}
