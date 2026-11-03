# ME2 en Firebase: pasar de Spark a Blaze

Proyecto: `me2-app-ar` (región Firestore `southamerica-east1`).
Ya desplegado en Spark: Firestore + reglas + índices. **Sin desplegar:** Functions (requiere Blaze) y Hosting (listo, se puede en Spark).

## 1. Activar Blaze
1. https://console.firebase.google.com/project/me2-app-ar/usage/details → **Modificar plan** → Blaze → vincular cuenta de facturación.
2. **Alerta de presupuesto** (obligatorio): https://console.cloud.google.com/billing → Presupuestos y alertas → Crear presupuesto
   - Proyecto: me2-app-ar · Monto: USD 10/mes · Alertas al 50 %, 90 % y 100 % por mail.
   - Nota: la alerta avisa, no corta el servicio. `maxInstances: 5` en `functions/index.js` limita el gasto.

## 2. Secretos y configuración
```bash
cd firebase
firebase functions:secrets:set MP_ACCESS_TOKEN     # Access token de producción de Mercado Pago
firebase functions:secrets:set MP_WEBHOOK_SECRET   # "Clave secreta" de Webhooks en MP
firebase functions:secrets:set LOCAL_AI_KEY        # clave de tu servidor Qwen3-VL (o un valor vacío)
cp functions/.env.example functions/.env           # completar LOCAL_AI_URL (túnel público a tu máquina)
```

## 3. Desplegar
```bash
cd firebase/functions && npm install && cd ..
firebase deploy --only functions --project me2-app-ar
firebase deploy --only hosting --project me2-app-ar     # https://me2-app-ar.web.app
```

## 4. Mercado Pago
En Tus integraciones → Webhooks: URL `https://southamerica-east1-me2-app-ar.cloudfunctions.net/mpWebhook`, evento **Pagos**.

## 5. Pendientes fuera de este código
- Habilitar **Authentication → Google** en la consola (y agregar el SHA-1 de la release al app Android).
- Proveedor de verificación de edad: debe escribir `users/{uid}.ageVerified = true` desde el servidor.
- Envío del `outbox` (aviso de invitaciones por mail/WhatsApp/red de origen).
- Subir la APK a `hosting/public/apk/me2.apk`.

## Reglas de negocio (functions/src/config.js)
Prueba 24 h, 300 mensajes, sin adulto · Básico $4000 / Full $8000, 30 días, apilables, renovación manual, 300 msg/día ·
Full solo se cobra con edad verificada · modo reposo sin IA · 100 cupos/día · lista de espera con links de 24 h de un solo uso ·
400 activos/día que solo frenan pruebas nuevas · IA solo local, sin Groq; si cae, estado `offline`.
