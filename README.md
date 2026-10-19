# THECORTESINHO

Lectura de posibles amarillas, rojas y penales según el árbitro en **Chile**, **Colombia** y **Perú**.

App web hecha con React + TanStack Start + Tailwind.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:8080

## Deploy en Vercel

1. Sube este repo a GitHub
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo
3. Framework preset: deja el que detecte (Vite / Other)
4. Build command: `npm run build`
5. Output: el que detecte Nitro / Vercel

Listo. Cada push a `main` actualiza la app.

## Actualizar datos de la fecha

Edita `src/data/corte.ts` con los nuevos partidos y designaciones de árbitros, haz commit y push.
