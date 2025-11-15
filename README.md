# Aplicación de Aprendizaje de Ruso con Nuxt 3

Aplicación web para practicar conjugaciones de verbos rusos y mejorar la pronunciación.

## 🚀 Características

- ✅ **Autenticación JWT** - Sistema seguro de login/registro
- ✅ **Gestión de Verbos** - CRUD completo de verbos rusos
- ✅ **Grupos Personalizados** - Organiza verbos en grupos
- ✅ **Práctica Interactiva** - Sistema de conjugación con verificación en tiempo real
- ✅ **Pronunciación** - Síntesis de voz con transliteración
- ✅ **Diseño Responsive** - Funciona en móviles, tablets y desktop
- ✅ **Modales de Ayuda** - Tablas de conjugación y reglas de pronunciación

## 🛠 Stack Tecnológico

- **Nuxt 3** - Framework Vue.js con SSR
- **Tailwind CSS** - Estilos utilitarios
- **Axios** - Cliente HTTP para consumir API FastAPI
- **Pinia** (implícito en Nuxt) - Gestión de estado
- **Vue Router** (file-based) - Navegación

## 📁 Estructura del Proyecto

```
apps_learn_ruso/
├── assets/
│   └── css/
│       └── main.css           # Estilos globales de Tailwind
├── components/
│   └── HelpModals.vue         # Modales de ayuda (conjugaciones, vocales)
├── composables/
│   ├── useAuth.ts             # Lógica de autenticación
│   ├── useVerbs.ts            # Gestión de verbos
│   ├── useVerbGroups.ts       # Gestión de grupos
│   ├── useConjugation.ts      # Lógica de conjugación
│   └── usePronunciation.ts    # Síntesis de voz y transliteración
├── layouts/
│   ├── default.vue            # Layout principal con navegación
│   └── auth.vue               # Layout para login/registro
├── middleware/
│   └── auth.ts                # Protección de rutas
├── pages/
│   ├── index.vue              # Redirige según autenticación
│   ├── login.vue              # Página de login
│   ├── register.vue           # Página de registro
│   ├── practice.vue           # Práctica de conjugación
│   ├── pronunciation.vue      # Traductor de pronunciación
│   ├── groups.vue             # Listado de grupos
│   └── verbs/
│       └── index.vue          # Administración de verbos
├── utils/
│   └── api.ts                 # Cliente Axios con interceptores
├── app.vue                    # Componente raíz
├── nuxt.config.ts             # Configuración de Nuxt
├── tailwind.config.js         # Configuración de Tailwind
└── package.json               # Dependencias y scripts
```

## 🔧 Instalación y Configuración

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

### 3. Iniciar servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔗 Conexión con API FastAPI

Asegúrate de que tu backend FastAPI esté corriendo en `http://localhost:8000` antes de usar la aplicación.

### Endpoints que consume la aplicación:

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual
- `GET /api/verbs` - Listar verbos
- `POST /api/verbs` - Crear verbo
- `DELETE /api/verbs/:id` - Eliminar verbo
- `GET /api/verb-groups` - Listar grupos
- `POST /api/verb-groups` - Crear grupo
- Y más...

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Preview de producción
pnpm preview

# Generar sitio estático
pnpm generate
```

## 🎨 Características de la UI

- **Diseño Moderno** - Interfaz limpia con Tailwind CSS
- **Feedback Visual** - Colores para respuestas correctas/incorrectas
- **Navegación Intuitiva** - Menú superior con rutas claras
- **Botones de Ayuda** - Acceso rápido a guías de conjugación
- **Síntesis de Voz** - Pronunciación nativa en ruso

## 🔐 Autenticación

La aplicación usa JWT tokens almacenados en cookies. El middleware `auth.ts` protege las rutas automáticamente y redirige al login si no estás autenticado.

## 📱 Responsive

La aplicación está optimizada para:
- 📱 Móviles (< 640px)
- 📱 Tablets (640px - 1024px)
- 💻 Desktop (> 1024px)

## 🌐 Internacionalización

Actualmente en **Español**, pero preparada para agregar más idiomas fácilmente.

## 🚧 Próximas Funcionalidades

- [ ] Práctica de sustantivos
- [ ] Sistema de progreso y estadísticas
- [ ] Modo offline con PWA
- [ ] Tests unitarios y e2e
- [ ] Dark mode

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando Nuxt 3 y FastAPI**

