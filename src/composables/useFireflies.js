import { ref, watch } from 'vue'
import { FIREFLY_COUNT_LEVELS, SIZE_LEVELS, BREAKPOINTS, FIREFLY_CONFIG } from '../constants/constants.js'

/**
 * Manages the fireflies state, creation, and population control.
 * @param {Object} props - The component props (countLevel, sizeLevel, selectedColors)
 * @param {Ref<number>} width - The canvas width ref
 * @param {Ref<number>} height - The canvas height ref
 */
/**
 * Manages the population of fireflies.
 * Handles creating, removing, and updating firefly properties based on configuration.
 * 
 * @param {Object} props - Component props containing configuration (countLevel, sizeLevel, colors)
 * @param {Ref<number>} width - Reactive canvas width
 * @param {Ref<number>} height - Reactive canvas height
 * @returns {Object} Firefly state and update methods
 */
export function useFireflies(props, width, height) {
    const fireflies = ref([])

    /**
     * Calculates a multiplier for firefly count based on screen size.
     * Prevents overcrowding on small mobile screens.
     * @returns {number} Multiplier (0.5 to 1.0)
     */
    const getScreenSizeMultiplier = () => {
        const w = window.innerWidth
        if (w < BREAKPOINTS.SM) return 0.5
        if (w < BREAKPOINTS.MD) return 0.75
        return 1
    }

    /**
     * Calculates the actual number of fireflies to spawn.
     * @param {number} baseCount - The base count from configuration
     * @returns {number} The effective count adjusted for screen size
     */
    const getEffectiveCount = (baseCount) => {
        return Math.floor(baseCount * getScreenSizeMultiplier())
    }

    /**
     * Creates a new firefly object with randomized properties.
     * 
     * @param {Object} sizeRange - {min, max} radius
     * @param {string} color - Hex color code
     * @returns {Object} A fully initialized firefly object
     */
    const createFirefly = (sizeRange, color) => ({
        // Random position within canvas bounds
        x: Math.random() * width.value,
        y: Math.random() * height.value,

        // Random size within selected range
        r: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,

        // Random drift velocity
        dx: Math.random() * (FIREFLY_CONFIG.SPEED_RANGE_X[1] - FIREFLY_CONFIG.SPEED_RANGE_X[0]) + FIREFLY_CONFIG.SPEED_RANGE_X[0],
        dy: Math.random() * (FIREFLY_CONFIG.SPEED_RANGE_Y[1] - FIREFLY_CONFIG.SPEED_RANGE_Y[0]) + FIREFLY_CONFIG.SPEED_RANGE_Y[0],

        // Initial alpha and pulse direction
        alpha: Math.random() * (FIREFLY_CONFIG.MAX_ALPHA - FIREFLY_CONFIG.MIN_ALPHA) + FIREFLY_CONFIG.MIN_ALPHA,
        pulseDir: Math.random() > 0.5 ? 1 : -1,

        // Interaction velocity (starts at 0)
        vx: 0,
        vy: 0,
        repelled: false,
        repelStartX: 0,
        repelStartY: 0,
        repelDistanceTraveled: 0,

        color: color,
    })

    /**
     * Updates the firefly array to match the target count and settings.
     * Adds or removes fireflies as needed without resetting the entire array.
     */
    const updateFireflies = () => {
        const targetCount = getEffectiveCount(FIREFLY_COUNT_LEVELS[props.countLevel])
        const sizeRange = SIZE_LEVELS[props.sizeLevel]
        const defaultColor = props.selectedColors[0]

        // Add new fireflies if we have too few
        if (fireflies.value.length < targetCount) {
            const toAdd = targetCount - fireflies.value.length
            const newFireflies = Array.from({ length: toAdd }).map(() =>
                createFirefly(sizeRange, defaultColor)
            )
            fireflies.value.push(...newFireflies)
        }
        // Remove excess fireflies if we have too many
        else if (fireflies.value.length > targetCount) {
            fireflies.value.splice(targetCount)
        }

        // Update properties of existing fireflies (e.g., if size setting changed)
        // Note: We randomise size again to match new level
        fireflies.value.forEach(f => {
            f.r = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
        })
    }

    /**
     * Redistributes selected colors evenly across the firefly population.
     * e.g., if colors are [Yellow, Green], 50% become Yellow, 50% Green.
     */
    const redistributeColors = () => {
        const colors = props.selectedColors
        if (!colors.length) return

        const perColor = Math.floor(fireflies.value.length / colors.length)
        let index = 0

        colors.forEach((color, colorIndex) => {
            // For the last color, take all remaining fireflies (handles uneven division)
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

    // --- Watchers ---

    // Watch for window resize to scale positions
    watch(
        () => [width.value, height.value],
        ([newW, newH], [oldW, oldH]) => {
            if (oldW && oldH) {
                // Scale firefly positions proportionally so they maintain relative position
                const scaleX = newW / oldW
                const scaleY = newH / oldH
                fireflies.value.forEach(f => {
                    f.x *= scaleX
                    f.y *= scaleY
                })
            }
            // Recalculate count for new screen size
            updateFireflies()
        }
    )

    // Watch for config changes
    watch(() => [props.countLevel, props.sizeLevel], updateFireflies)

    // Watch for color changes
    watch(() => props.selectedColors, redistributeColors, { deep: true })

    return {
        fireflies,
        updateFireflies, // Exposed for initial setup
        redistributeColors
    }
}
