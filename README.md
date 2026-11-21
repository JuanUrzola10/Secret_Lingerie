# SECRET LINGERIE — sitio estático

HTML + CSS + JS puro. Sin backend, sin instalación. Funciona abriendo `index.html` (mejor con la extensión **Live Server** de VS Code).

## 1. Configurar contacto (obligatorio)
Edita `js/config.js`: cambia `whatsapp` por tu número en formato `57` + 10 dígitos (ej. `573001234567`) y completa Instagram, Facebook, atención y horarios. Mientras el número sea el de ejemplo, WhatsApp abre sin destinatario y avisa.

## 2. Agregar un producto
En `js/products.js`, dentro de `PRODUCTOS`, copia una línea `D(...)`:
`D(15,"Nombre","conjuntos",99900,0,{d:"Descripción",c:[VINO,ROSA],m:"Materiales",f:1,n:1})`
- Parámetros: id único, nombre, categoría (conjuntos, brasieres, panties, pijamas, bodies, prendas, accesorios), precio, precio anterior (0 si no hay oferta), opciones.
- `t` tallas, `ta` tallas agotadas, `c` colores, `ca` colores agotados, `f` destacado, `n` nuevo, `av` disponibilidad ("disponible", "pocas unidades", "agotado"), `col` colección (burgundy, rose, esencial).
- Si hay `precio anterior`, el producto sale como OFERTA automáticamente.
- Quita `demo:true` (en la función D) o pon `mostrarDemo:false` en config para ocultar la etiqueta DEMO.

## 3. Cambiar fotografías
Las imágenes actuales son ilustraciones de demostración. Guarda tus fotos (JPG/WebP, ~800×1000 px, menos de 200 KB) en `assets/images/products/` y cambia las rutas en `imagenes` (puedes dejar varias). También reemplaza `assets/images/banners/` y `categories/`. Usa solo fotos con derechos de uso.

## 4. Publicar en Netlify
1. Crea una cuenta en netlify.com.
2. *Add new site → Deploy manually*: arrastra la carpeta `secret-lingerie` completa. (O *Import from Git* con tu repositorio de GitHub.)
3. Directorio de publicación: la raíz (`.`), sin comando de build (ya está en `netlify.toml`).
4. Publica y abre la URL que te da Netlify.
5. Prueba: filtros, favoritos, lista de consultas y mensajes de WhatsApp.

## 5. Cómo probar
- Catálogo: busca "SL-004", filtra por talla/color/precio, ordena, limpia filtros, "Ver más".
- Producto: Vista rápida → talla/color (los agotados están deshabilitados) → ampliar foto → agregar a lista.
- Favoritos y lista: recarga la página; deben conservarse (localStorage).
- WhatsApp: botón del producto y "Enviar consulta" de la lista.
