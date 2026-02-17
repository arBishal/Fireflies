# Fireflies 🌟

> A mesmerizing, interactive firefly simulation that brings the magic of nature to your screen.

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

This simulation was inspired by personal fascination and nostalgia for fireflies. As these luminous insects are sadly declining due to habitat loss, pollution, and light interference, this project serves as a small tribute—preserving their magic in code.

Built with **Vue 3** and the **Canvas API**, fireflies drift naturally across the screen, pulse with light, and react dynamically to your interactions.

[**Try Live Demo**](https://fireflies-canvas.vercel.app/)

## Features

- **Interactive Physics**: Fireflies are gently attracted to the cursor and scatter when clicked.
- **Dynamic Controls**: Adjust population density, movement speed, and size in real-time.
- **Theming**: Choose from preset color themes (Golden Yellow, Lime Green, Blueish White).
- **Responsive Design**: Optimized for both desktop and mobile experiences.
- **Accessibility**: Keyboard navigable controls and screen-reader friendly interface.

## Documentation

Want to understand how it works? Check out the detailed guides:

-   [**Technical Guide**](./TECHNICAL_GUIDE.md): Introduction to the architecture, components, and Vue features.
-   [**Physics & Canvas Internals**](./PHYSICS_&_CANVAS_INTERNALS.md): Deep dive into the math, logic, and rendering engine.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Rendering**: HTML5 Canvas API
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Heroicons](https://heroicons.com/)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/arBishal/Fireflies.git
    cd Fireflies
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Run development server**
    ```sh
    npm run dev
    ```

4.  **Build for production**
    ```sh
    npm run build
    ```

## Roadmap

- [x] Control bar to adjust speed, size, and count.
- [x] Color theme support.
- [x] Mobile responsiveness and touch support.
- [ ] Background music / ambient sound.
- [ ] Custom background options (e.g., Night Forest).

## Contributing

Contributions are welcome! Please feel free to open an issue for bug reports or feature requests. You can also fork the repository and make your own version to your liking.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Recommended Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
