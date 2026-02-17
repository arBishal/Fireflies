# Firefly Physics & Canvas Internals 📐

This document dives deep into the **mathematics** and **rendering logic** of the Fireflies simulation. It explains exactly how each firefly is born, how it moves, and how it interacts with the world.

## 1. The Anatomy of a Firefly 🧬

Each firefly is a simple JavaScript object with properties that define its existence in the 2D space.

```javascript
const firefly = {
  // Position
  x: Math.random() * width,
  y: Math.random() * height,
  
  // Base Velocity (Drift)
  dx: Math.random() * (maxSpeed - minSpeed) + minSpeed,
  dy: Math.random() * (maxSpeed - minSpeed) + minSpeed,
  
  // Appearance
  r: Math.random() * (maxSize - minSize) + minSize, // Radius
  alpha: Math.random(), // Transparency (0 to 1)
  pulseDir: 1, // 1 = getting brighter, -1 = fading
  
  // Physics State (for interactions)
  vx: 0, // Velocity X added by repulsion
  vy: 0, // Velocity Y added by repulsion
  repelled: false
}
```

### Why these properties?
-   **`dx`, `dy`**: Represents the firefly's "natural" movement. They always drift in this direction unless disturbed.
-   **`vx`, `vy`**: Represents external forces (like a user clicking). These start at 0 but spike when an interaction occurs.

---

## 2. The Animation Loop 🔄

The simulation runs on a loop powered by `requestAnimationFrame`. This method tells the browser "I want to paint a frame" and usually runs at **60 frames per second (FPS)**.

In every frame, we do two things for **every single firefly**:
1.  **Update**: Calculate new position based on physics.
2.  **Draw**: Render it to the canvas.

---

## 3. Movement Logic (The Math) 🧮

### A. Base Drift
Every frame, we add the base velocity to the position:
```javascript
x = x + (dx * speedMultiplier)
y = y + (dy * speedMultiplier)
```
This creates the constant, soothing movement.

### B. Screen Wrapping
To prevent fireflies from disappearing forever, we use **wrapping logic**.
-   If `x < 0` (went off left), set `x = canvasWidth`.
-   If `y > canvasHeight` (went off bottom), set `y = 0`.
This creates an infinite, seamless world.

### C. Pulsing (Alpha Channel)
The glowing effect comes from changing the opacity (`alpha`) over time.
```javascript
alpha += pulseDir * PULSE_SPEED
if (alpha >= MAX_ALPHA) pulseDir = -1 // Start fading
if (alpha <= MIN_ALPHA) pulseDir = 1  // Start brightening
```
This is a simple **linear oscillation**.

---

## 4. Interaction Physics 🖱️

### A. Attraction (Hover)
When the mouse moves, fireflies are gently pulled towards it.
We calculate the distance (`dist`) between the firefly and the mouse using the **Pythagorean theorem**:
$$dist = \sqrt{(mouse.x - x)^2 + (mouse.y - y)^2}$$

If the distance is within the `INTERACTION_RADIUS` (e.g., 150px):
```javascript
// Calculate vector towards mouse
dx = mouse.x - x
dy = mouse.y - y

// Move a tiny fraction of that distance (e.g., 5%)
x += dx * ATTRACTION_STRENGTH
y += dy * ATTRACTION_STRENGTH
```
This is **Linear Interpolation (Lerp)**. It makes the firefly "lag" behind the mouse, creating a smooth, organic trailing effect.

### B. Repulsion (Click)
When clicked, fireflies are violently pushed away.
1.  Calculate normalized direction vector (length of 1) away from click:
    ```javascript
    normX = (x - clickX) / dist
    normY = (y - clickY) / dist
    ```
2.  Apply an instant force to the velocity vector (`vx`, `vy`):
    ```javascript
    vx = normX * REPEL_FORCE
    vy = normY * REPEL_FORCE
    ```

### C. Velocity Decay (Friction)
If we just added velocity, the firefly would fly away forever. We need **friction** to slow it down.
In every frame:
```javascript
vx *= 0.95 // Lose 5% of speed per frame
vy *= 0.95
```
Eventually, `vx` and `vy` become close to 0, and the firefly returns to its peaceful drifting state.

---

## 5. Canvas Rendering 🎨

We use the standard 2D Context API (`ctx`).

1.  **Clear Screen**:
    ```javascript
    ctx.clearRect(0, 0, width, height)
    ```
    (Note: In this app, we don't clear; we sometimes draw a semi-transparent black rectangle to create trails, but currently we clear fully for sharpness).

2.  **Draw Firefly**:
    ```javascript
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2) // Draw circle
    ctx.fillStyle = `rgba(r, g, b, alpha)`
    
    // The Glow Effect
    ctx.shadowColor = `rgb(r, g, b)`
    ctx.shadowBlur = 10 // Blurs the edges to look like light
    
    ctx.fill()
    ```

### Optimization Note
Calculating `rgba()` strings every frame for hundreds of particles is expensive.
To optimize, we convert HEX colors to RGB objects `{r, g, b}` **once** or outside the loop, so inside the loop we just concatenate numbers.

---

## Summary

The "life" of a firefly is simply a summation of vectors:
$$Position_{new} = Position_{old} + Drift + Attraction + Repulsion$$

Where:
-   **Drift**: Constant random vector.
-   **Attraction**: Vector pointing *to* the mouse (if close).
-   **Repulsion**: Decaying vector pointing *away* from click.
