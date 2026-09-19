

## Alpha Software Release (DON'T USE)

# App Builder Workspace

A production-ready **TanStack Start** application template for building modern web apps in the Grok ecosystem. Pre-configured with React 19, Vite 8, Tailwind CSS 4, Radix UI, database support, and authentication.

> **Note**: This is alpha software release.

---

## Features

- **Modern React**: React 19 + React DOM with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand + TanStack Query for server state
- **Styling**: Tailwind CSS 4 with JIT compilation
- **UI Components**: Complete Radix UI component library
- **Icons**: Lucide React icons
- **Database**: PGlite (SQLite-compatible) with Kysely query builder, PostgreSQL-ready
- **Authentication**: Better Auth integration with pre-wired middleware
- **Build Tool**: Vite 8 with optimized production builds
- **Linting**: ESLint with React hooks and refresh plugins
- **Formatting**: Prettier with opinionated defaults
- **Testing**: Playwright for end-to-end tests

---

## Project Structure

```
app-builder-workspace/
├── src/
│   ├── components/           # Shared React components
│   ├── lib/                  # Utility functions and configurations
│   ├── routes/               # Application routes (TanStack Router)
│   ├── router.tsx            # Root router configuration
│   ├── routeTree.gen.ts      # Generated route tree types
│   └── styles.css            # Global styles with Tailwind
├── server/
│   └── middleware/           # Server middleware (Grok PWA, auth)
├── migrations/               # Database migration files
├── scripts/                  # Build and development utilities
│   ├── with-app-env.mjs      # Environment wrapper for Vite
│   ├── migrate.mjs           # Database migration runner
│   ├── preview.mjs           # Production preview server
│   └── check-auth-invariant.mjs
├── public/                   # Static assets
├── artifacts/                # Build outputs
├── .tanstack/                # TanStack Start configuration
├── .vercel/                  # Vercel deployment configuration
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── startup.sh                # Development server startup script
└── AGENTS.md                 # Grok App Builder guidelines
```

---

## Getting Started

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://0.0.0.0:8080` with Hot Module Replacement (HMR) enabled.

### Production Build

Create an optimized production build:

```bash
npm run build
```

This runs Vite build followed by database migrations.

### Preview Production Build

Serve the production build locally for testing:

```bash
npm run preview        # Start preview server
npm run preview:restart  # Restart preview server
npm run preview:stop   # Stop preview server
```

Preview runs on `http://127.0.0.1:8081` by default.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Production build + database migrations |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview production build |
| `npm run preview:restart` | Restart preview server |
| `npm run preview:stop` | Stop preview server |
| `npm run db:migrate` | Run database migrations |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run all tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run check:auth` | Verify auth invariants |

---

## Core Dependencies

### Framework & Routing
- [`@tanstack/react-start`](https://tanstack.com/start/latest) - Meta-framework
- [`@tanstack/react-router`](https://tanstack.com/router/latest) - Type-safe routing
- [`@tanstack/react-query`](https://tanstack.com/query/latest) - Server state management
- [`@tanstack/react-table`](https://tanstack.com/table/latest) - Data tables

### UI & Styling
- [`react`](https://react.dev) ^19.2.0
- [`react-dom`](https://react.dev) ^19.2.0
- [`tailwindcss`](https://tailwindcss.com) ^4.3.0
- [`@tailwindcss/vite`](https://tailwindcss.com) - Tailwind Vite plugin
- **Radix UI**: Complete headless component library
  - Accordion, Alert Dialog, Avatar, Checkbox, Collapsible
  - Dialog, Dropdown Menu, Label, Popover, Progress
  - Radio Group, Scroll Area, Select, Separator, Slider
  - Slot, Switch, Tabs, Toggle, Toggle Group, Tooltip
- [`lucide-react`](https://lucide.dev) - Icon library
- [`clsx`](https://github.com/lukeed/clsx) - Class name utilities
- [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) - Tailwind class merging
- [`class-variance-authority`](https://cva.style) - Variant handling
- [`tw-animate-css`](https://github.com/্যাসifুatak/tw-animate-css) - Animations

### State & Forms
- [`zustand`](https://github.com/pmndrs/zustand) - Client state management
- [`react-hook-form`](https://react-hook-form.com) - Form handling
- [`@hookform/resolvers`](https://github.com/ react-hook-form/resolvers) - Form validation
- [`zod`](https://zod.dev) - Type-safe schema validation

### Database
- [`@electric-sql/pglite`](https://electric-sql.com) - SQLite-compatible database
- [`kysely`](https://github.com/koskimas/kysely) - Type-safe SQL query builder
- [`pg`](https://node-postgres.com) - PostgreSQL client

### Authentication
- [`better-auth`](https://github.com/am enhancement/better-auth) - Authentication library
- [`jose`](https://github.com/panva/jose) - JWT handling
- [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) - Cryptographic hashing
- [`@scure/base`](https://github.com/paulmillr/scure-base) - Base encoding

### Charts & Visualization
- [`recharts`](https://recharts.org) - Charting library
- [`react-day-picker`](https://react-day-picker.js.org) - Date picker
- [`cmdk`](https://github.com/pacocoursey/cmdk) - Command palette

### Other
- [`vaul`](https://github.com/emilkowalski/vaul) - Drawer component
- [`sonner`](https://sonner.emilkowal.ski) - Toast notifications
- [`date-fns`](https://date-fns.org) - Date utilities
- [`react-resizable-panels`](https://github.com/jackdudley/react-resizable-panels) - Resizable panels

---

## Dev Dependencies

- [`vite`](https://vitejs.dev) ^8.2.0
- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react)
- [`typescript`](https://www.typescriptlang.org) ^5.7.0
- [`eslint`](https://eslint.org) ^9.20.0
- [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
- [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier)
- [`eslint-plugin-react-hooks`](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [`eslint-plugin-react-refresh`](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
- [`prettier`](https://prettier.io) ^3.4.0
- [`lightningcss`](https://github.com/parcel-bundler/lightningcss) - CSS processor
- [`playwright`](https://playwright.dev) ^1.62.0 - Testing
- [`nitro`](https://nitro.unjs.io) ^3.0.260610-beta - Server framework

---

## Environment Configuration

### Development Environment

The app uses `scripts/with-app-env.mjs` to inject environment variables from `.grok/app-env.json`:

- `VITE_AUTH_ENABLED` - Controls authentication flow

### Production Environment

On Vercel deployment, the platform injects:
- `DATABASE_URL` - Database connection string
- Auth credentials

**Important**: Never create a `.env` file. Use `VITE_` prefix for browser-accessible variables.

---

## Database

### Migrations

Database migrations are stored in the `migrations/` directory as SQL files. Run migrations with:

```bash
npm run db:migrate
```

### Query Builder

Use Kysely for type-safe database queries:

```typescript
import { db } from '@/lib/db'

const users = await db.selectFrom('users').selectAll().execute()
```

---

## Authentication

Better Auth is pre-wired but **opt-in**. Enable authentication only when the app requires:
- User accounts / sign-in / login
- Per-user data
- Cross-device data persistence
- User sharing features
- Leaderboards

When auth is enabled, all server functions should use `authMiddleware` and scope queries by `context.userId`.

---

## Routing

### Adding Routes

Create route files in `src/routes/` following TanStack Router conventions:

```typescript
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return <div>About Page</div>
}
```

### Dynamic Routes

```typescript
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  component: UserProfile,
  parserParams: { userId: z.string() },
  loader: async ({ params }) => {
    // Fetch user data
  },
})
```

---

## Styling

### Tailwind CSS

Tailwind CSS 4 is configured with the Vite plugin. All classes are available without additional configuration.

```css
/* src/styles.css */
@import "tailwindcss";

/* Custom styles */
button,
[role="button"] {
  cursor: pointer;
}
```

### Design Tokens

Use Tailwind's built-in classes or extend with custom tokens in `src/styles.css`.

---

## State Management

### Client State (Zustand)

```typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### Server State (TanStack Query)

```typescript
import { useQuery } from '@tanstack/react-query'

function UserProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })
}
```

---

## Forms

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      <input {...form.register('password')} type="password" />
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

---

## Testing

### Unit Tests

```bash
npm run test
```

Runs tests for:
- `scripts/**/*.test.mjs`
- `src/lib/app-data/*.test.ts`
- `src/lib/auth/*.test.ts`

### Browser QA

Use the pre-installed Playwright for interactive testing:

```bash
node scripts/browser-smoke.mjs
```

This runs automated smoke tests for desktop and mobile viewports.

---

## Deployment

The app is configured for **Vercel** deployment. Key considerations:

1. **Server Functions**: Use `server/` for server-only code
2. **Environment Variables**: Injected by the platform on deploy
3. **Static Files**: Served from `public/`
4. **Build Output**: `artifacts/` directory

### Deployment Constraints

- No runtime filesystem writes
- No server-only Node APIs at import time
- No dev-only dependencies in production
- No hard-coded hosts/ports/secrets

---

## Grok Integration

This workspace is optimized for the Grok App Builder platform:

- **Preview Proxy**: Auto-discovers `0.0.0.0:8080`
- **Branding**: Grok PWA branding is injected automatically
- **Auth Gateway**: Viewers from Grok are pre-authenticated
- **xAI API**: `XAI_API_KEY` is available for server-side AI calls

### Preview Bridge

The `<PreviewHostBridge />` component in `__root.tsx` enables communication between the preview chrome and the app via `postMessage`. This is a silent noop in production.

---

## Configuration Files

### `vite.config.ts`

Vite configuration with TanStack Start plugin, PWA plugin, and Nitro integration.

### `tsconfig.json`

TypeScript configuration with strict mode and path aliases.

### `.prettierrc`

Prettier configuration for consistent code formatting.

### `eslint.config.mjs`

ESLint flat config with React and Prettier plugins.

---

## Development Workflow

1. **Start the server**: `npm run dev`
2. **Edit files**: Changes trigger HMR
3. **Run typecheck**: `npm run typecheck`
4. **Run lint**: `npm run lint`
5. **Format code**: `npm run format`
6. **Test**: `npm run test`
7. **Build**: `npm run build`
8. **Preview**: `npm run preview`

---

## Adding Dependencies

Install new packages with:

```bash
npm install package-name
```

For packages with native modules requiring compilation:

```bash
GROK_ALLOW_INSTALL_SCRIPTS=1 npm install package-name
```

---

## Troubleshooting

### Dev Server Not Starting

Ensure `startup.sh` is executable and correctly configured:

```bash
chmod +x startup.sh
sh /workspace/startup.sh
```

### Build Failures

Check TypeScript errors with `npm run typecheck` and fix any type issues.

### Preview Issues

Run the smoke test to verify rendering:

```bash
node scripts/browser-smoke.mjs
```

### Database Connection Issues

Verify the `DATABASE_URL` environment variable is set and the migrations have run.

---

## License

This workspace is configured for building applications in the Grok ecosystem. Refer to the [Grok Terms of Service](https://grok.com/terms) for usage terms.

---

## Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Better Auth Documentation](https://github.com/am enhancement/better-auth)
- [Kysely Documentation](https://github.com/koskimas/kysely)
- [PGlite Documentation](https://electric-sql.com)

---

## Contributing

This is a generated workspace. Customize it for your specific application needs.

1. Update the app name and description
2. Configure routing for your application
3. Add your custom components and styles
4. Set up your database schema and migrations
5. Implement authentication if needed
6. Test thoroughly before deployment
