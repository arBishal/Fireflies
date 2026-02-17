# Fireflies: Understanding The Technicalities

This document explains **how the Fireflies simulation works under the hood**. It is designed for developers who know basic JavaScript but might be new to [Vue.js](https://vuejs.org/) or the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Architecture Overview

The application is built using a **hybrid approach**:
1.  **Vue.js (The Manager)**: Handles the user interface (buttons, sliders, modals), state management (Is the speed High? How many fireflies?), and orchestrates the application logic.
2.  **HTML5 Canvas (The Painter)**: Handles the high-performance animation. Vue tells the Canvas *what* to draw, and the Canvas draws thousands of particles 60 times a second.

This separation ensures the UI remains responsive even when animating hundreds of objects.

---

## Component Breakdown

Think of components as Lego blocks. Each one has a specific job.

### 1. `App.vue` (The Conductor)
This is the root component. It holds the **Source of Truth** for the entire application state:
-   `speedLevel`: How fast they move.
-   `countLevel`: How many fireflies exist.
-   `sizeLevel`: How big they are.
-   `selectedColors`: What color they glow.

**How it connects:**
It passes these values **down** to children (`FirefliesCanvas`, `ControlBar`) as **props** (read-only data). When a child wants to change something (e.g., user clicks a button), it emits an **event** back **up** to `App.vue` to update the state.

### 2. `FirefliesCanvas.vue` (The Engine)
This is where the magic happens. It doesn't use HTML elements for fireflies (which would be too slow). Instead, it uses a `<canvas>` element.

**Key Concepts:**
-   **The Loop (`animate`)**: A function that runs ~60 times per second using `requestAnimationFrame`. In every frame, it:
    1.  Clears the entire screen.
    2.  Calculates the new position of every firefly.
    3.  Draws every firefly as a circle.
-   **Reactivity**: It uses Vue's **`watch`** feature. When `App.vue` changes a prop (like `countLevel`), a watcher detects this change and immediately adds or removes fireflies to match the new count.

### 3. `ControlBar.vue` (The Steering Wheel)
A floating UI panel containing buttons to control the simulation.
-   It uses a **loop (`v-for`)** to render buttons based on configuration lists.
-   It emits events like `update:speedLevel` when clicked.
-   It uses **DOM Event Modifiers** like `@click.stop` to prevent clicks on the bar from propagating to the canvas (so you don't accidentally scatter fireflies when changing settings).

### 4. `InfoModal.vue` (The Manual)
A pop-up modal explaining the project.
-   **`Teleport` (Concept)**: Although not explicitly used here, modals often "break out" of their parent container layout. Here, we use fixed positioning (`z-index`) to overlay it on top of everything.
-   **`Transition`**: A Vue wrapper component that automatically applies CSS classes (fade in/out, scale up/down) when an element enters or leaves the DOM (e.g., when `v-if="isOpen"` toggles).

---

## Logic Reuse (Composables)

Instead of putting all logic inside components, we extract common logic into reusable functions (files in `src/composables/`). This keeps components clean.

-   **`useCanvas.js`**: Handles resizing the canvas when the window size changes. It listens for the `resize` event and updates width/height.
-   **`useFireflies.js`**: Manages the *data* of the fireflies array. It handles creating new firefly objects with random properties (x, y, speed, color).
-   **`useFireflyPhysics.js`**: The physics engine. It contains the math for:
    -   **Attraction**: Moving towards the mouse.
    -   **Repulsion**: Scattering away when clicked.
    -   **Wandering**: Adding random noise to movement so they don't move in straight robotic lines.

---

## Vue Features Explained

### 1. `ref()` (Reactivity)
In standard JS, `let count = 0` is just a number. If you change it, the screen doesn't update.
In Vue, `const count = ref(0)` creates a **reactive** reference. When you change `count.value`, Vue automatically detects it and re-renders any part of the UI that uses it.

### 2. `watch()`
Think of this as a side-effect triggers.
*"When `X` chances, do `Y`."*
We use this in `FirefliesCanvas` to wait for window resize or prop changes to adjust the simulation logic dynamically.

### 3. Props & Emits
-   **Props**: Data passed **down** (Parent -> Child). Like passing arguments to a function.
-   **Emits**: Messages sent **up** (Child -> Parent). Like a child shouting "I finished my homework!" so the parent knows.

### 4. `<Transition>`
A built-in component that adds CSS classes during state changes.
Example in `InfoModal.vue`:
```html
<Transition
  enter-from-class="opacity-0 scale-95"
  enter-to-class="opacity-100 scale-100"
>
  <div v-if="isOpen">...</div>
</Transition>
```
When `isOpen` becomes `true`, Vue adds the classes to animate the modal appearing smoothly.

---

## The Physics (Simplified)

Each firefly is an object: `{ x, y, vx, vy, ... }`.

**In every frame:**
1.  **Velocity**: We add "velocity" (`vx`, `vy`) to position (`x`, `y`).
2.  **Interaction**:
    -   If the mouse is close, we nudge the velocity towards the mouse (**Attraction**).
    -   If the mouse is clicked, we set a huge velocity away from the mouse (**Repulsion**).
3.  **Friction**: We multiply velocity by `0.9` (or similar). This acts like air resistance, slowing them down over time so they don't fly forever.
4.  **Wrapping**: If a firefly goes off-screen (`x > width`), we teleport it to the other side (`x = 0`), creating an infinite canvas effect.

---

## Why this approach?

Using **Vue** for the UI controls allows us to build complex, interactive interfaces easily.
Using **Canvas** for the particles allows us to animate thousands of objects efficiently, which would clog the browser if we used HTML DOM elements (`<div>`) for each firefly.

This hybrid approach gives you the best of both worlds: **Reactive UI** + **High-Performance Graphics**.
