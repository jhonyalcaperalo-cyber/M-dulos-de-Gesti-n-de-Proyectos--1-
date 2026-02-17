# Guía de Despliegue a Producción

## Recomendación: Vercel
Es gratis, fácil de usar, y se integra perfectamente con Vite y GitHub.

## Pasos para Desplegar:

### 1. Preparar el Proyecto para Producción
Asegúrate de que el archivo `.env.local` tenga las variables correctas para producción:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
VITE_WOMPI_PUBLIC_KEY=tu-wompi-public-key
VITE_WOMPI_INTEGRITY_KEY=tu-wompi-integrity-key
VITE_WOMPI_ENV=production
```

### 2. Subir a GitHub
1. Crea un repositorio en GitHub
2. Sube tu código: `git init`, `git add .`, `git commit -m "ready for deploy"`
3. Conecta el repositorio a Vercel

### 3. Configurar Vercel
1. Ve a vercel.com y crea una cuenta
2. Importa tu repositorio de GitHub
3. En "Environment Variables" agrega las variables de producción
4. Deploy automático cada vez que haces push a main

### 4. Configurar Supabase para Producción
1. Ve a tu proyecto en Supabase
2. En Settings → API → Site URL: pon la URL de Vercel
3. En Authentication → URL Configuration: agrega tu URL de producción
4. Asegúrate de que los RLS estén correctamente configurados

### 5. Configurar Wompi para Producción
Ya está configurado en tu código. Solo asegurate de:
- Usar las keys de producción (no sandbox)
- El merchant ID de producción

### 6. Dominio Personalizado (opcional)
- En Vercel puedes agregar un dominio propio
- Configura los DNS según las instrucciones de Vercel

## Costos Estimados:
- **Vercel**: Gratis (hasta 100GB bandwidth/mes)
- **Supabase**: Gratis (hasta 500MB DB, 1GB storage)
- **Dominio**: ~$10-15/año (opcional)

## Notas Importantes:
- No expongas tu `service_role key` en el frontend
- Mantén las variables de producción en Vercel, no en el código
- Haz prueba de pagos con la sandbox antes de ir a producción
