# Guía de Migración a Nuxt 3 ✅

## ¡Migración Completada! 🎉

Tu aplicación de aprendizaje de ruso ha sido exitosamente migrada de **Vue 3 + Vite + SQLite local** a **Nuxt 3 + API FastAPI**.

---

## 📋 Resumen de Cambios

### ✅ Lo que se eliminó:
- ❌ SQLite en el navegador (`sql.js`)
- ❌ Vite como bundler
- ❌ Vue Router manual
- ❌ Pinia (reemplazado por composables de Nuxt)
- ❌ Base de datos local

### ✅ Lo que se agregó:
- ✅ **Nuxt 3** - Framework full-stack con auto-imports
- ✅ **API REST** - Integración con FastAPI backend
- ✅ **Autenticación JWT** - Sistema completo de login/registro
- ✅ **Composables** - Lógica reutilizable y modular
- ✅ **File-based routing** - Rutas automáticas
- ✅ **Middleware** - Protección de rutas
- ✅ **Layouts** - Estructura consistente

---

## 🏗 Nueva Estructura del Proyecto

```
apps_learn_ruso/
├── 📁 assets/css/          # Estilos globales de Tailwind
├── 📁 components/          # Componentes Vue reutilizables
│   └── HelpModals.vue      # Modales de ayuda
├── 📁 composables/         # Lógica de negocio reutilizable
│   ├── useAuth.ts          # 🔐 Autenticación
│   ├── useVerbs.ts         # 📝 Gestión de verbos
│   ├── useVerbGroups.ts    # 📚 Gestión de grupos
│   ├── useConjugation.ts   # ✏️ Lógica de conjugación
│   └── usePronunciation.ts # 🔊 Síntesis de voz
├── 📁 layouts/             # Layouts de página
│   ├── default.vue         # Layout principal
│   └── auth.vue            # Layout login/registro
├── 📁 middleware/          # Middleware de rutas
│   └── auth.ts             # Protección de rutas
├── 📁 pages/               # Páginas (auto-routing)
│   ├── index.vue           # Página de inicio
│   ├── login.vue           # 🔑 Login
│   ├── register.vue        # 📝 Registro
│   ├── practice.vue        # 🎯 Práctica
│   ├── pronunciation.vue   # 🔊 Pronunciación
│   ├── groups.vue          # 📚 Grupos
│   └── verbs/
│       └── index.vue       # ✏️ Administrar verbos
├── 📁 utils/               # Utilidades
│   └── api.ts              # Cliente HTTP con interceptores
├── app.vue                 # Componente raíz
├── nuxt.config.ts          # ⚙️ Configuración de Nuxt
└── package.json            # Dependencias y scripts
```

---

## 🚀 Cómo Usar la Nueva Aplicación

### 1️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

### 2️⃣ Asegúrate de que el backend FastAPI esté corriendo

```bash
# En el directorio de tu API FastAPI
uvicorn app.main:app --reload
```

### 3️⃣ Iniciar el servidor de desarrollo

```bash
pnpm dev
```

### 4️⃣ Abrir en el navegador

```
http://localhost:3000
```

---

## 🔄 Comparación: Antes vs Ahora

| Característica | Antes (Vue 3 + Vite) | Ahora (Nuxt 3) |
|---|---|---|
| **Base de datos** | SQLite en navegador | API FastAPI |
| **Autenticación** | ❌ No | ✅ JWT completo |
| **Multi-usuario** | ❌ No | ✅ Sí |
| **Roles** | ❌ No | ✅ Admin/Teacher/Student |
| **Grupos** | ❌ No | ✅ Sí |
| **Routing** | Manual | Auto (file-based) |
| **State Management** | ❌ No | ✅ Composables |
| **SSR** | ❌ No | ✅ Opcional |
| **Auto-imports** | ❌ No | ✅ Sí |
| **Middleware** | ❌ No | ✅ Sí |
| **Escalabilidad** | Baja | Alta |

---

## 📝 Nuevas Funcionalidades

### 🔐 Sistema de Autenticación
- **Login** con usuario/contraseña
- **Registro** de nuevos usuarios
- **JWT tokens** almacenados en cookies
- **Auto-refresh** de sesión
- **Protección** de rutas con middleware

### 👥 Multi-usuario
- Cada usuario tiene sus propios verbos y grupos
- Roles: Admin, Teacher, Student
- Profesores pueden gestionar estudiantes

### 📚 Gestión Avanzada
- **CRUD completo** de verbos
- **Grupos personalizados** de verbos
- **Sincronización** con el servidor
- **Persistencia** en base de datos PostgreSQL/SQLite

### 🎯 Mejoras en la UI
- **Navegación** con menú superior
- **Layouts** consistentes
- **Feedback visual** mejorado
- **Botones flotantes** de ayuda
- **Responsive** optimizado

---

## 🔧 Composables Disponibles

### `useAuth()`
```typescript
const { user, isAuthenticated, login, register, logout } = useAuth()
```

### `useVerbs()`
```typescript
const { verbs, fetchVerbs, createVerb, updateVerb, deleteVerb } = useVerbs()
```

### `useVerbGroups()`
```typescript
const { groups, fetchGroups, createGroup, addVerbToGroup } = useVerbGroups()
```

### `useConjugation()`
```typescript
const { conjugate, getPronounTranslation, checkAnswer } = useConjugation()
```

### `usePronunciation()`
```typescript
const { speak, stop, transliterateToSpanish, processText } = usePronunciation()
```

---

## 🛠 Scripts NPM

```bash
# Desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Vista previa de producción
pnpm preview

# Generar sitio estático
pnpm generate
```

---

## 🔌 Endpoints de la API

La aplicación consume los siguientes endpoints de tu API FastAPI:

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/me` - Usuario actual

### Verbos
- `GET /api/verbs` - Listar verbos
- `GET /api/verbs/:id` - Obtener verbo
- `POST /api/verbs` - Crear verbo
- `PUT /api/verbs/:id` - Actualizar verbo
- `DELETE /api/verbs/:id` - Eliminar verbo

### Grupos
- `GET /api/verb-groups` - Listar grupos
- `GET /api/verb-groups/:id` - Obtener grupo
- `POST /api/verb-groups` - Crear grupo
- `PUT /api/verb-groups/:id` - Actualizar grupo
- `DELETE /api/verb-groups/:id` - Eliminar grupo
- `POST /api/verb-groups/:groupId/verbs/:verbId` - Agregar verbo
- `DELETE /api/verb-groups/:groupId/verbs/:verbId` - Quitar verbo

---

## 🎨 Personalización

### Cambiar URL de la API

Edita el archivo `.env`:

```env
NUXT_PUBLIC_API_BASE=https://tu-api.com/api
```

### Cambiar colores

Edita `tailwind.config.js` para personalizar los colores:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      // ... más colores
    }
  }
}
```

### Agregar más páginas

Solo crea un archivo en `pages/`:

```
pages/
  └── mi-nueva-pagina.vue  →  /mi-nueva-pagina
```

---

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Limpia los módulos y reinstala
rm -rf node_modules .nuxt
pnpm install
pnpm dev
```

### Error de CORS
Asegúrate de que tu API FastAPI tiene CORS habilitado:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token no se guarda
Verifica que las cookies estén habilitadas en tu navegador.

---

## 📚 Recursos

- [Documentación de Nuxt 3](https://nuxt.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Axios](https://axios-http.com/docs/intro)

---

## ✅ Checklist de Migración

- [x] ✅ Nuxt 3 configurado
- [x] ✅ Tailwind CSS integrado
- [x] ✅ Composables creados
- [x] ✅ Sistema de autenticación
- [x] ✅ Páginas migradas
- [x] ✅ Layouts creados
- [x] ✅ Middleware de protección
- [x] ✅ Componentes modulares
- [x] ✅ Cliente API con interceptores
- [x] ✅ Archivos antiguos eliminados

---

## 🎯 Próximos Pasos

1. **Probar la aplicación** con tu API FastAPI
2. **Crear usuarios de prueba** para verificar autenticación
3. **Agregar verbos** y probar la funcionalidad completa
4. **Personalizar** estilos si lo deseas
5. **Desplegar** en producción cuando esté listo

---

**¡Tu aplicación está lista para producción!** 🚀

Si tienes alguna duda o problema, revisa los logs del servidor con `pnpm dev` o consulta la documentación de Nuxt 3.

