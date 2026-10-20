# Abhay's Works World — 3D Portfolio
This is the existing Three.js portfolio experience with the skyfall intro, Rajasthani-inspired palace, room interactions, creative universe, profile hall, and THANK YOU ending.

## Realistic character asset
The code now supports a rigged GLB human model at `assets/models/abhay-human.glb`. The website will gracefully keep the fallback character until that file exists. To achieve the requested photorealistic human, place a properly licensed rigged GLB model at that path (ideally with idle, walk, run and falling animations). A photorealistic model cannot be truthfully fabricated from code primitives alone.

## Run
GitHub Pages serves the site from the repository root. Three.js and GLTFLoader are loaded from jsDelivr, so the browser needs internet access.
