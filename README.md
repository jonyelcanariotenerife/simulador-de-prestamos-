# Simulador de Préstamos Pro — Pack PWA (instalable en Android)

Esta carpeta contiene todo lo necesario para subir el simulador a GitHub y
poder **instalarlo como app independiente en tu móvil Android** (sin pasar
por Google Play).

## Contenido

```
simulador.html          ← la app (ya enlaza el manifest y registra el sw)
manifest.json           ← metadatos de instalación (nombre, colores, iconos)
sw.js                   ← service worker (permite abrir la app sin internet)
favicon.ico
icons/
  icon-192.png
  icon-512.png
  icon-512-maskable.png
  apple-touch-icon.png
  favicon-16.png
  favicon-32.png
```

⚠️ **Importante:** sube todos los archivos manteniendo esta misma estructura
de carpetas (el `icons/` tiene que quedar dentro de la misma carpeta que
`simulador.html`), porque el manifest y el service worker los referencian con
rutas relativas.

## 1) Subir a GitHub

1. Crea un repositorio nuevo en GitHub (puede ser público o privado; para
   GitHub Pages gratuito necesita ser público, salvo que tengas plan de pago).
2. Sube estos archivos a la raíz del repo (o a una subcarpeta, p. ej. `docs/`,
   pero respetando siempre la estructura relativa entre ellos).
3. Haz commit y push.

## 2) Activar GitHub Pages

1. En el repo: **Settings → Pages**.
2. En "Source" elige la rama (normalmente `main`) y la carpeta donde subiste
   los archivos (`/ (root)` o `/docs`).
3. Guarda. GitHub te dará una URL parecida a:
   `https://tu-usuario.github.io/tu-repo/`
4. Espera 1–2 minutos a que se publique.

## 3) Instalar en tu Android

1. Abre **Chrome** en el móvil y entra en:
   `https://tu-usuario.github.io/tu-repo/simulador.html`
2. Toca el menú de tres puntos (⋮) arriba a la derecha.
3. Elige **"Instalar aplicación"** (o "Añadir a pantalla de inicio").
4. Confirma. Te aparecerá un icono nuevo en el escritorio del móvil que abre
   el simulador en pantalla completa, como una app nativa.

Chrome también puede mostrarte solo un banner/aviso de instalación
automáticamente al entrar (icono de instalación en la barra de direcciones)
si detecta que el manifest y el service worker están bien servidos por HTTPS,
que es justo lo que hace GitHub Pages.

## 4) Actualizar la app más adelante

Cuando cambies algo en `simulador.html` (o en cualquier archivo cacheado),
sube los cambios a GitHub y **sube en 1 el número de versión** en `sw.js`:

```js
const CACHE_VERSION = 'v2'; // antes v1
```

Esto obliga al service worker a descartar la caché antigua y servir la
versión nueva la siguiente vez que se abra la app (puede tardar hasta que se
cierre y reabra la app instalada una vez).

## Notas técnicas

- El simulador funciona **sin conexión** una vez visitado por primera vez con
  internet (el service worker cachea el HTML, el manifest, los iconos y las
  librerías externas como Chart.js y Font Awesome).
- `manifest.json` usa rutas relativas (`./simulador.html`, `icons/...`), así
  que funciona tanto si lo publicas en la raíz del dominio como en una
  subcarpeta tipo `usuario.github.io/repo/`.
- Si en el futuro quieres que la app instalada abra directamente el
  simulador (en vez de un index.html distinto), no toques `start_url`: ya
  apunta a `./simulador.html`.
