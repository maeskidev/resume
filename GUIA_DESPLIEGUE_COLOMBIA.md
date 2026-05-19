# Guia de despliegue (Colombia) para este proyecto Vite

Este proyecto es una app React + Vite estatica (sin backend), asi que puedes usar hosting estatico muy barato o gratis.

## Recomendacion rapida

Para una app de prueba y gastar lo minimo:

1. Usa **Cloudflare Pages (gratis)** para hosting.
2. Compra dominio en **Hostinger** (si te gusta su precio/promocion) o Namecheap.
3. Conecta DNS del dominio a Cloudflare y listo.

Con esto sueles pagar solo el dominio anual.

## Opciones economicas (resumen)

### Opcion A: Cloudflare Pages + dominio en Hostinger (recomendada)
- Costo hosting: gratis.
- Costo dominio: lo que te cobre Hostinger por ano.
- Pros: rapido, SSL automatico, buen rendimiento global.
- Contras: requiere configurar DNS (facil).

### Opcion B: Vercel + dominio en Hostinger
- Costo hosting: gratis (hobby).
- Costo dominio: anual.
- Pros: deploy muy simple con GitHub.
- Contras: limites del plan gratis si crece mucho.

### Opcion C: Netlify + dominio en Hostinger
- Costo hosting: gratis.
- Costo dominio: anual.
- Pros: facil y estable para sitios estaticos.
- Contras: limites del plan gratis.

### Opcion D: Hostinger completo (hosting + dominio)
- Costo: mensual/anual segun plan.
- Pros: todo en un solo panel.
- Contras: para este caso puede salir mas caro que usar hosting gratis.

## Paso a paso recomendado (Cloudflare Pages + dominio en Hostinger)

## 1) Preparar el proyecto

En tu carpeta del proyecto:

```bash
npm install
npm run build
```

Debes confirmar que se genere la carpeta `dist/`.

## 2) Subir el codigo a GitHub

Ya lo tienes en:

- Repo: `https://github.com/maeskidev/resume`
- Branch: `main`

## 3) Crear cuenta en Cloudflare Pages

1. Entra a Cloudflare Dashboard.
2. Ve a **Workers & Pages** > **Create application** > **Pages**.
3. Elige **Connect to Git** y conecta tu cuenta GitHub.
4. Selecciona el repo `maeskidev/resume`.

## 4) Configurar build en Cloudflare Pages

Usa estos valores:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: vacio (o `/`)

Variables de entorno opcionales (si usas AdSense):

- `VITE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx`
- `VITE_ADSENSE_SLOT=1234567890`

Publica con **Save and Deploy**.

## 5) Comprar dominio en Hostinger

1. Compra el dominio que quieras (.com, .site, etc).
2. En el panel DNS de Hostinger, deja listo para editar registros.

## 6) Conectar dominio con Cloudflare Pages

En Cloudflare Pages:

1. Abre tu proyecto Pages.
2. Ve a **Custom domains** > **Set up a custom domain**.
3. Agrega tu dominio (ejemplo: `tudominio.com`).
4. Cloudflare te mostrara los DNS que debes crear.

En Hostinger DNS:

1. Crea/edita los registros que te pida Cloudflare (normalmente CNAME y/o A).
2. Guarda cambios.
3. Espera propagacion (5 min a 24h).

Cuando termine, Cloudflare emitira SSL automaticamente (https).

## 7) Ajustes SEO finales despues del dominio

Cuando tengas dominio real, actualiza estos archivos:

1. `index.html`
- `canonical`
- `og:url`
- `twitter:url`
- JSON-LD (`url`)

2. `public/sitemap.xml`
- Reemplaza `https://example.com` por tu dominio real.

3. `public/robots.txt`
- Verifica la linea `Sitemap:` con el dominio real.

Luego:

```bash
git add .
git commit -m "chore: update SEO URLs for production domain"
git push origin main
```

Cloudflare desplegara automaticamente.

## 8) Checklist para AdSense

Antes de solicitar AdSense:

1. Sitio publico con dominio propio y https.
2. Paginas legales visibles:
- `/privacy`
- `/terms`
- `/contact`
3. Navegacion clara y sitio funcional en movil.
4. Contenido suficiente (descripcion del producto y ayuda/FAQ).

## 9) Costos aproximados (referencia)

- Dominio anual: varia bastante por extension y promo.
- Hosting: puede ser `0` con Cloudflare/Vercel/Netlify.
- Total minimo anual posible: basicamente el costo del dominio.

## 10) Si quieres todo en Hostinger

Tambien puedes desplegar por FTP en hosting compartido:

1. Ejecuta `npm run build`.
2. Sube el contenido de `dist/` a `public_html/`.
3. Activa SSL en Hostinger.
4. Para cada cambio, vuelves a subir `dist/`.

Funciona, pero para desarrollo continuo suele ser mas comodo Cloudflare Pages con deploy automatico desde GitHub.

---

Si quieres, en el siguiente paso te dejo una version corta tipo "checklist de 15 minutos" para que hoy mismo quede online con dominio temporal y luego lo cambias al dominio final.
