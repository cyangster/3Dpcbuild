# 3D PC Build (Interactive)

An interactive 3D explainer for PC components. Users orbit a stylized mid-tower build, select parts from a sidebar (or the model), and read descriptions while the camera frames each piece. Some hidden parts use clickable callout arrows.

## Tools & stack

| Tool | Role |
|------|------|
| **[React 18](https://react.dev/)** | UI layer: sidebar, selection state, layout, and the canvas host. |
| **[Vite](https://vitejs.dev/)** | Dev server and production build (fast HMR, ES modules, optimized bundles). |
| **[Three.js](https://threejs.org/)** | WebGL engine: scenes, lights, materials, geometries, shadows, and orbit math. |
| **[React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)** | React renderer for Three.js—declarative `<mesh>`, `<Canvas>`, hooks like `useFrame` / `useThree`, and reconciler-friendly updates. |
| **[React Three Drei](https://github.com/pmndrs/drei)** | Helpers on top of R3F: `OrbitControls`, `Environment` (HDR lighting), `RoundedBox`, `ContactShadows`, etc.—less boilerplate for common 3D patterns. |

Together, **Vite + React** handle the app shell; **Three.js + R3F + Drei** handle the 3D view, camera, and interactions.

## Scripts

```bash
npm install    # dependencies
npm run dev    # local dev at http://localhost:5173
npm run build  # production output in dist/
npm run preview # serve the production build locally
```

## Deploy (e.g. Vercel)

This is a static SPA after `npm run build`. Connect the repo to [Vercel](https://vercel.com/), use the default Vite settings, or rely on the included `vercel.json` (`build` → `dist`).

## Project layout (high level)

- `src/App.jsx` — layout, part list, details panel, selection state.
- `src/components/PCScene.jsx` — `<Canvas>`, lighting, environment, camera rig.
- `src/components/PCModel.jsx` — case, motherboard, GPU, cooler, RAM, SSD, PSU, fans, arrows.
- `src/data/pcParts.js` — copy and specs per part.
- `src/data/cameraFocus.js` — orbit targets per part for sidebar / selection framing.
