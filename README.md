# Abhay Gupta — Cinematic Portfolio

A cinematic portfolio concept with a procedural 3D city, blue/gold lighting, a walking character, scroll-linked camera movement, and a separate full-work archive.

## Included
- `index.html` — cinematic landing page with four featured categories using your uploaded artwork
- `work.html` — separate archive page opened by the **And more** link
- `work-data.json` — gallery index for 102 items, including 10 motion/video projects
- `work-gallery.js` / `work-gallery.css` — archive category filters, project search and image lightbox
- `assets/work/` — 84 optimized image previews generated from the uploaded Mailer, Print Work and Cue Card folders
- `assets/videos/` — 10 uploaded MP4 motion/video projects
- `assets/video-posters/` — lightweight poster images generated from each video for gallery previews
- The **Motion & Video** filter opens each MP4 in an in-page video player; the homepage also features a motion/video category card.
- PPT/PDF items are represented as presentation/document cards in the archive so the website remains lightweight; original editable files are not bundled into the site.

## Preview on a computer
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Click **And more** in Selected Work to open the full archive in a separate page. You can filter by category, search project names and click images to view them larger.

A local server is required because the archive page loads `work-data.json` with `fetch()` and the 3D scene uses ES modules.

## Publish with GitHub Pages
Upload the contents of this folder to your GitHub repository (keep the folder structure intact), then enable GitHub Pages from the repository's Settings → Pages. No build step is required.

## Before publishing
- Contact email is set to `511abhaygupta@gmail.com`. Instagram, LinkedIn, and CV download links are included in the contact section.
- The 3D robot model and Three.js modules load from external URLs, so an internet connection is required for the 3D scene and animated model. A stylised fallback character is included if the robot model fails to load.
- Check the final result in a browser on desktop and mobile. This package has been syntax- and archive-checked, but has not been fully browser-tested in this environment.
