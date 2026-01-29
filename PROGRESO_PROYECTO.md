# Progreso del Proyecto - Heal and Play

## Estado Actual
Landing page "Coming Soon" para Magic Box - estructura creada, falta ejecutar.

## Problema Pendiente
Renombrar la carpeta de `Heal&Play` a `HealAndPlay` (el & causa problemas con Node.js)

## Stack Definido
- **Frontend:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS v4
- **Backend:** Node.js + Express (para después)
- **Base de datos:** Azure Cosmos DB (para después)
- **Autenticación:** Pendiente (Auth0 o custom)
- **Hosting:** Azure

## Archivos Creados

### 1. index.html
- Configurado con meta tags para SEO
- Google Fonts (Poppins) cargada
- Título: "Magic Box - Coming Soon | Heal and Play"

### 2. src/index.css
- Tailwind CSS v4 importado
- Font-face para Brittany (fuente cursiva) - **PENDIENTE: agregar archivo de fuente**
- Colores custom definidos:
  - Beige: #f1ebe6
  - Dark: #2e2b29

### 3. src/App.tsx
- Landing page completa con:
  - Header "Mágica Mujer presenta:"
  - Título "THE magic BOX PARA TI"
  - Imagen de la caja
  - Badge "Coming Soon"
  - Formulario de captura de email
  - Footer con link a Instagram @heal_play

### 4. vite.config.ts
- Configurado con plugin de Tailwind CSS

## Archivos de Assets
- `public/magic-box.png` - Imagen de la caja con moño negro

## Pendientes Inmediatos
1. Renombrar carpeta a HealAndPlay
2. Agregar fuente Brittany en `public/fonts/`
3. Ejecutar `npm run dev` para ver el resultado
4. Conectar formulario de email con backend

## Colores de la Marca
- Beige fondo: #f1ebe6
- Negro texto: #2e2b29

## Tipografías
- Poppins (Google Fonts) - texto general
- Brittany - palabra "magic" en cursiva

## Redes Sociales
- Instagram: @heal_play

## Siguiente Paso
Después de renombrar la carpeta:
```bash
cd C:\Users\OmarHW\OneDrive\Documents\HealAndPlay
npm run dev
```

## Contexto del Negocio
Ver archivo: CONTEXTO_HEAL_AND_PLAY.md
