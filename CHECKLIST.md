# Részletes Megvalósítási Checklist

Ez a dokumentum lépésről lépésre vezeti végig a fejlesztést a `PROJECT_SPECIFICATION.md` alapján. A cél egy Production-Ready AI Orchestrator létrehozása Monorepo környezetben.

## 1. Fázis: Projekt Inicializálás (Monorepo Setup)

A projekt alapjainak lerakása Turborepo segítségével.

- [x] **Repo Létrehozása**
  - [x] Inicializálj egy új Turborepo projektet (`npx create-turbo@latest`).
  - [x] Válaszd az `npm` csomagkezelőt.
  - [x] Töröld ki a példa appokat (`apps/docs`, `apps/web`), hogy tiszta lappal indulj.

- [x] **Alapvető Konfiguráció**
  - [x] Állítsd be a gyökér `package.json`-t (projektnév, scriptek).
  - [x] Konfiguráld a `turbo.json`-t a build pipeline-hoz.
  - [x] Hozz létre egy `.gitignore` fájlt.
  - [x] **Root Dependencies**:
    ```bash
    npm install -D -w turbo typescript eslint prettier
    ```

- [x] **Mappaszerkezet Kialakítása**
  - [x] Hozz létre üres mappákat: `apps/web`, `apps/api`, `apps/worker`.
  - [x] Hozz létre üres mappákat: `packages/database`, `packages/types`, `packages/tsconfig`.

## 2. Fázis: Közös Csomagok (Shared Packages)

### 2.1 `packages/tsconfig`
- [ ] Inicializálás (`npm init -y`)
- [ ] Hozz létre `base.json`, `nextjs.json`, `node.json`.

### 2.2 `packages/types`
- [x] Inicializálás és függőségek:
  ```bash
  cd packages/types
  npm install zod
  npm install -D typescript
  ```
- [ ] Definiáld a Zod sémákat (`src/schemas.ts`) és TS interfészeket (`src/index.ts`).
- [ ] Buildeld le a csomagot.

### 2.3 `packages/database`
- [x] Inicializálás és függőségek:
  ```bash
  cd packages/database
  npm install @prisma/client
  npm install -D prisma typescript
  ```
- [x] Inicializáld a Prisma-t: `npx prisma init`.
- [x] Írd meg a `schema.prisma` fájlt.
- [x] Exportáld a klienst.

## 3. Fázis: Backend API (`apps/api`)

Az Express szerver, ami a kéréseket fogadja és a Redis-be ír.

- [ ] **Projekt Setup és Függőségek**
  ```bash
  cd apps/api
  npm install express cors helmet dotenv zod bullmq ioredis http-status-codes
  # Belső függőségek
  npm install @repo/database @repo/types
  # Dev függőségek
  npm install -D @types/express @types/cors @types/node typescript nodemon ts-node
  ```

- [ ] **Redis Kapcsolat**
  - [ ] Hozz létre egy Upstash fiókot és szerezd meg a Redis URL-t.
  - [ ] Konfiguráld a Redis kapcsolatot és a BullMQ Queue-t (`pipeline-queue`).

- [ ] **API Végpontok Implementálása**
  - [ ] `POST /pipelines` (Mentés)
  - [ ] `GET /pipelines/:id` (Betöltés)
  - [ ] `POST /execute/:id` (Futtatás indítása)
  - [ ] `GET /executions/:id` (Státusz lekérdezés)
  - [ ] `GET /admin/stats` (Rendszer statisztikák: Queue méret, CPU, Memória)

## 4. Fázis: Worker Service (`apps/worker`)

A háttérfolyamat, ami a tényleges számításokat végzi.

- [ ] **Projekt Setup és Függőségek**
  ```bash
  cd apps/worker
  npm install bullmq ioredis ai @google/generative-ai groq-sdk openai pdf-parse
  # Belső függőségek
  npm install @repo/database @repo/types
  # Dev függőségek
  npm install -D @types/node typescript ts-node
  ```

- [ ] **Logika Implementálása**
  - [ ] BullMQ Worker inicializálása (`pipeline-queue`).
  - [ ] Topológiai Rendezés (DAG) implementálása.
  - [ ] `LLMNode` kezelő (Groq/OpenAI/Gemini hívások).
  - [ ] `Context` és változó behelyettesítés (`{{...}}`).

## 5. Fázis: Frontend (`apps/web`)

A vizuális szerkesztőfelület.

- [ ] **Projekt Setup és Függőségek**
  ```bash
  cd apps/web
  npx create-next-app@latest . --typescript --tailwind --eslint
  npm install @xyflow/react zustand @tanstack/react-query lucide-react clsx tailwind-merge zod react-hook-form
  # UI Könyvtár (Radix UI alapok, ha szükséges, vagy shadcn/ui init)
  npx shadcn-ui@latest init
  npm install @radix-ui/react-slot @radix-ui/react-dialog # stb...
  # Belső függőségek
  npm install @repo/types
  ```

- [ ] **UI Implementáció**
  - [ ] `/builder` oldal React Flow vászonnal.
  - [ ] `/admin` Dashboard oldal (Rendszer monitorozás, Logok).
  - [ ] Custom Node-ok: `TriggerNode`, `LLMNode`, `DisplayNode`.
  - [ ] Zustand store a gráf állapotának kezelésére.
  - [ ] API kliens (`inputs` -> `POST /execute`).

## 6. Fázis: Futtatás és Deploy

- [ ] **Scripts (`package.json`)**
  - [ ] `dev`: `turbo run dev`

- [ ] **Környezeti Változók (.env)**
  - [ ] `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`, `GROQ_API_KEY`.

- [ ] **Deploy**
  - [ ] Web -> Vercel
  - [ ] API & Worker -> Render.com
