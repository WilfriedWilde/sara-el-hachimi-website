# Sara El Hachimi – Official Website

Official website for jazz saxophonist **Sara El Hachimi**.
This project was designed as a visually engaging and lightweight platform to present the artist’s work, with a strong focus on animation, fluid navigation, and simplicity in content management.

## Overview

The website emphasizes a **clean and immersive user experience**, combining smooth animations with a minimal and maintainable structure.

The platform enables the artist to **independently manage key content** such as concerts and media through external tools, without requiring direct access to the codebase.

## Features

* **Responsive design**

    Fully optimized for desktop, tablet, and mobile devices.

* **Animated interface (GSAP)**

    Uses GSAP to create smooth and expressive animations that enhance the visual experience.

* **Seamless page transitions (Barba.js)**

    Integrated Barba.js for fluid navigation between pages without full reloads.

* **Concerts section (Google Sheets driven)**

    The artist can update upcoming performances via Google Sheets.
    Concert data (date, venue, location, etc.) is fetched dynamically and displayed on the website, allowing quick updates without modifying the code.

* **Media section (Google Sheets driven)**

    * Media content is managed via Google Sheets, enabling the client to update the website independently.
    * Supports embedded content from:
        * **YouTube**
        * **Bandcamp**
        * **Tidal**

* **Lightweight content management**

    Both concerts and media are controlled via Google Sheets, providing a simple and efficient workflow.

* **Decoupled architecture**

    The site separates structure (frontend) from content (external data sources), ensuring:
    * Easy updates
    * No backend maintenance
    * Reduced complexity

## Tech Stack
* **HTML5** – structure
* **CSS3** – styling and layout
* **JavaScript (Vanilla)** – interactivity and data handling

External libraries and services:

* **GSAP** – animations
* **Barba.js** – page transitions
* **Google Sheets** – content management (concerts & media)

## Content Management Workflow

The website allows the client to manage content independently:

* **Concerts** → Google Sheets (dates, venues, details)
* **Media** → Google Sheets (links, structure, ordering)

This setup provides a simple CMS-like workflow without introducing unnecessary technical overhead.

## Author

Developed and designed by **Wilfried Wilde**.
