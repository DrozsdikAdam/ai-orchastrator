# AI Workflow Orchestrator (No-Code LLM Pipeline Platform)
## Részletes Projekt Specifikáció és Senior Fejlesztői Dokumentáció

Ez a dokumentum a projekt teljes körű technikai specifikációját, architektúráját, és megvalósítási ütemtervét tartalmazza. A cél egy skálázható, karbantartható, "production-ready" rendszer felépítése modern technológiák felhasználásával.

---

## 1. Architektúra és Technológiai Stack

A rendszer **Monorepo** struktúrában (Turborepo) épül fel, biztosítva a kódmegosztást (típusok, adatbázis sémák, UI komponensek) a frontend és backend között.

### 1.1. Frontend Alkalmazás (`/apps/web`)
A felhasználók itt szerkesztik és menedzselik a folyamatokat.

*   **Framework:** **Next.js 14+ (App Router)** - Server-Side Rendering (SSR) és optimalizált routing.
*   **Nyelv:** TypeScript.
*   **Visual Library:** **React Flow** (vagy `@xyflow/react`) - A diagram szerkesztő alapja.
*   **State Management:**
    *   **Zustand:** Globális kliens oldali állapot (pl. a szerkesztőben lévő node-ok állapota).
    *   **TanStack Query (React Query):** Szerver oldali állapot (API kérések cache-elése, loading state-ek).
*   **UI Komponensek:** **TailwindCSS** + **Shadcn/UI** (Radix UI alapokon) + **Lucide Icons**.
*   **Form Kezelés:** **React Hook Form** + **Zod** (validáció).
*   **Kulcsfontosságú NPM Csomagok:**
    ```json
    {
      "dependencies": {
        "next": "latest",
        "react": "latest",
        "react-dom": "latest",
        "@xyflow/react": "^12.0.0",
        "zustand": "^4.5.0",
        "@tanstack/react-query": "^5.0.0",
        "lucide-react": "^0.300.0",
        "lucide-react": "^0.300.0",
        "clsx": "^2.0.0",
        "tailwind-merge": "^2.0.0",
        "zod": "^3.22.0",
        "react-hook-form": "^7.0.0"
      }
    }
    ```

### 1.2. Backend API Szerver (`/apps/api`)
Ez a réteg felelős az üzleti logikáért, adatbázis műveletekért és a feladatok (Jobs) delegálásáért.

*   **Runtime:** **Node.js** + **Express.js** (Könnyűsúlyú, gyors fejlesztés).
*   **Validáció:** **Zod** (Request body validáció) - Ugyanazt a sémát használhatjuk, mint a frontend!
*   **Queue Producer:** **BullMQ** (Redis alapú üzenetsor kezelő).
*   **Biztonság:** `helmet`, `cors`, Firebase Auth vagy JWT alapú saját auth.
*   **Kulcsfontosságú NPM Csomagok:**
    ```json
    {
      "dependencies": {
        "express": "^4.18.0",
        "cors": "^2.8.5",
        "helmet": "^7.0.0",
        "dotenv": "^16.0.0",
        "bullmq": "^5.0.0",
        "ioredis": "^5.3.0",
        "zod": "^3.22.0",
        "http-status-codes": "^2.3.0"
      }
    }
    ```

### 1.3. Worker Service (`/apps/worker`)
A háttérben futó folyamat, amely ténylegesen végrehajtja az AI hívásokat és a logikát. Ez skálázható horizontálisan (több példány is futhat).

*   **Runtime:** **Node.js** (TypeScript).
*   **Feladat Feldolgozó:** **BullMQ** Worker.
*   **AI Integráció:**
    *   **Vercel AI SDK** (`ai`): Egységes interfész különböző modellekhez.
    *   **LangChain** (Opcionális): Komplexebb láncokhoz, ha a Vercel SDK nem elég.
*   **Egyéb:** `pdf-parse` (Dokumentum feldolgozás).
*   **Kulcsfontosságú NPM Csomagok:**
    ```json
    {
      "dependencies": {
        "bullmq": "^5.0.0",
        "ioredis": "^5.3.0",
        "ai": "^3.0.0",
        "@google/generative-ai": "^0.1.0",
        "groq-sdk": "^0.3.0",
        "openai": "^4.0.0"
      }
    }
    ```

### 1.4. Közös Csomagok (`/packages`)
*   **`/packages/database`:** Prisma Schema, Prisma Client, Migrációk.
*   **`/packages/types`:** Közös TypeScript interface-ek (pl. `Pipeline`, `Node`, `Edge`, `ExecutionStatus`).
*   **`/packages/tsconfig`:** Közös TypeScript beállítások.

### 1.5. Tesztelés és Minőségbiztosítás
*   **Unit Tests:** **Vitest** (Gyors, Vite-native tesztfuttató).
*   **Integration Tests:** **Supertest** (API végpontok tesztelésére).
*   **E2E Tests:** **Playwright** (Böngésző alapú végponttól végpontig tesztelés).
*   **CI/CD:** **GitHub Actions** (Automatikus tesztfuttatás minden push-nál).

---

## 2. Részletes Monorepo Struktúra

```text
/my-ai-orchestrator
 ├── .gitignore
 ├── package.json               # Root dependencies (turbo, prettier, eslint)
 ├── turbo.json                 # Turborepo pipeline config
 │
 ├── apps
 │   ├── web                    # NEXT.JS FRONTEND
 │   │   ├── src
 │   │   │   ├── app            # App Router (routes)
 │   │   │   ├── components
 │   │   │   │   ├── flow       # Custom React Flow Nodes (LLMNode.tsx, TriggerNode.tsx)
 │   │   │   │   └── ui         # Shadcn UI (Button, Input, Card)
 │   │   │   ├── hooks          # Custom hooks (usePipeline, useSocket)
 │   │   │   ├── lib            # Utils, API client (fetch wrapper)
 │   │   │   └── stores         # Zustand stores (useBuilderStore.ts)
 │   │   ├── public
 │   │   ├── tailwind.config.ts
 │   │   └── package.json
 │   │
 │   ├── api                    # EXPRESS BACKEND
 │   │   ├── src
 │   │   │   ├── config         # Env vars, Constants
 │   │   │   ├── controllers    # Request handlers (pipelineController.ts)
 │   │   │   ├── middlewares    # Auth, Validation, ErrorHandling
 │   │   │   ├── routes         # Express routers
 │   │   │   ├── services       # Business logic (QueueService.ts)
 │   │   │   └── app.ts         # App entry point
 │   │   └── package.json
 │   │
 │   └── worker                 # NODE.JS WORKER
 │       ├── src
 │       │   ├── config         # Env vars
 │       │   ├── engine         # Execution Engine (GraphExecutor.ts, TopologicalSort.ts)
 │       │   ├── nodes          # Node Implementations (LLMNode.ts, HttpNode.ts)
 │       │   └── index.ts       # Worker entry point
 │       └── package.json
 │
 └── packages
     ├── database               # PRISMA API
     │   ├── prisma
     │   │   └── schema.prisma  # Database Schema Definition
     │   ├── src                # Seeders, export client
     │   ├── index.ts
     │   └── package.json
     │
     └── types                  # SHARED TYPES
         ├── src
         │   ├── index.ts       # Export all types
         │   └── schemas.ts     # Zod schemas (shared validation)
         └── package.json
```

---

## 3. Hosting Infrastruktúra (Ingyenes Tier Barát Stack)

*   **Frontend (Web):**
    *   **Szolgáltató:** **Vercel**.
    *   **URL:** `https://my-ai-orchestrator.vercel.app`
    *   **Deployment:** Git push a `main` ágra -> Automatikus build és deploy.
*   **Backend (API) & Worker:**
    *   **Szolgáltató:** **Render.com** (vagy Railway).
    *   **Típus:**
        *   API: "Web Service" (Node.js környezet).
        *   Worker: "Background Worker" (Node.js környezet).
    *   **URL:** `https://api-my-ai-orchestrator.onrender.com`
*   **Adatbázis (SQL):**
    *   **Szolgáltató:** **Supabase** (vagy Neon).
    *   **Típus:** PostgreSQL.
    *   **Elérhetőség:** Connection String (`postgres://user:pass@host:5432/db`).
*   **Üzenetsor & Cache (Redis):**
    *   **Szolgáltató:** **Upstash**.
    *   **Típus:** Serverless Redis.
    *   **Elérhetőség:** Connection String (`redis://default:pass@host:port`).

---

## 4. Részletes Működési Folyamatok

### 4.1. Pipeline Futtatási Folyamat (Execution Lifecycle)

1.  **Indítás (Trigger)**:
    *   A felhasználó a UI-on megnyomja a "Run" gombot.
    *   **Frontend**: Összeállítja a `Build` objektumot (nodes, edges, config), és elküldi: `POST /api/pipelines/:id/execute`.

2.  **API Feldolgozás**:
    *   **Backend**: Validálja a requestet (Zod).
    *   **Database**: Létrehoz egy új `Execution` rekordot `status: 'PENDING'` állapottal.
    *   **Redis Queue**: Hozzáad egy jobot a `pipeline-queue`-hoz: `{ executionId: "123", pipelineId: "abc" }`.
    *   **Response**: Visszaadja az `executionId`-t a kliensnek (`202 Accepted`).

3.  **Worker Feldolgozás (Az "Agy")**:
    *   A Worker `process` függvénye megkapja a jobot.
    *   **Adatbetöltés**: Lekéri a teljes Pipeline definíciót (JSON gráf) az adatbázisból (Prisma).
    *   **Státusz frissítés**: `Execution` status -> `'RUNNING'`.
    *   **Topológiai Rendezés (Topological Sort)**:
        *   Meghatározza a node-ok végrehajtási sorrendjét a függőségek alapján.
        *   *Hiba:* Ha körkörös hivatkozást (ciklust) talál, a futás azonnal leáll hibával.
    *   **Végrehajtási Ciklus (Execution Loop)**:
        *   Inicializálja a `Context` objektumot (üres map).
        *   Iterál a rendezett node-okon.
        *   **Változó Feloldás (Variable Resolution)**: Megvizsgálja a node bemeneteit. Ha talál `{{NodeA.output}}` mintát, kicseréli a `Context`-ben tárolt tényleges értékre.
        *   **Node Futtatás**: Meghívja a node típusának megfelelő `Handler`-t (pl. `executeLLMNode`, `executeHttpNode`).
        *   **Eredmény Mentése**: A node kimenetét elmenti a `Context`-be a node ID-ja alá.
    *   **Befejezés**:
        *   Ha minden sikeres: `status: 'COMPLETED'`, `logs: Context`.
        *   Ha hiba történt: `status: 'FAILED'`, `error: "Error message"`.

### 4.2. Adatbázis Séma Terv (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  apiKeys   ApiKey[] // Saját API kulcsok (OpenAI, Groq) titkosítva
  pipelines Pipeline[]
}

model Pipeline {
  id          String   @id @default(uuid())
  name        String
  description String?
  definition  Json     // A teljes gráf (nodes, edges) React Flow formátumban
  isPublic    Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  executions  Execution[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Execution {
  id          String   @id @default(uuid())
  status      ExecutionStatus // ENUM: PENDING, RUNNING, COMPLETED, FAILED
  logs        Json?    // A futás részletes eredménye (Context)
  error       String?
  startedAt   DateTime @default(now())
  finishedAt  DateTime?
  pipelineId  String
  pipeline    Pipeline @relation(fields: [pipelineId], references: [id])
}

enum ExecutionStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}
```

---

### 4.3. Standard Node Könyvtár
| Kategória | Típusok |
|-----------|---------|
| **Triggerek** | Webhook, Ütemezett (Cron), Manuális indítás |
| **Generatív AI** | Szöveggenerálás (LLM), Összegzés, Adatkinyerés (JSON) |
| **Tudásbázis (RAG)** | Vektoros keresés, Dokumentum beolvasás |
| **Logika** | Feltételes elágazás (If/Else), Változó manipuláció |
| **Standard Eszközök** | HTTP Request, JSON Parse, Delay |

### 4.4. Külső Integrációk és Szolgáltatások (Tervezett lista)

Az alkalmazás az alábbi külső rendszerekkel képes kommunikálni (API-n keresztül):

#### 📧 Kommunikáció és Értesítés
*   **Gmail / SMTP:** Emailek küldése saját Gmail fiókból vagy vállalati SMTP szerverről. (Pl. automatikus válaszok, riportok kiküldése).
*   **Slack / Discord:** Üzenetek küldése csatornákra, DM küldése, státusz frissítések.
*   **Microsoft Teams:** Csoportmunka értesítések.

#### 📝 Dokumentumok és Tudásmenedzsment
*   **Google Drive / Docs:** Fájlok olvasása, dokumentumok létrehozása/szerkesztése.
*   **Notion:** Adatbázisok olvasása és írása (pl. feladatlista frissítése, jegyzetek mentése).
*   **Airtable:** Strukturált adatok kezelése, CRM funkciók kiváltása.

#### 📊 Üzleti és E-commerce (Jövőbeli bővítés)
*   **Shopify / WooCommerce:** Rendelések lekérdezése, státusz módosítása.
*   **HubSpot / Salesforce:** Új lead létrehozása, ügyféladatok frissítése.
*   **Stripe:** Fizetési linkek generálása.

#### 🛠️ Fejlesztői Eszközök
*   **GitHub / GitLab:** Issue létrehozása, PR kommentek elemzése.
*   **Webhooks:** Bármilyen rendszerrel való kommunikáció, ami támogatja a HTTP kéréseket.

---

### 4.4. Támogatott AI Modellek (Modellkönyvtár)

A rendszer alapértelmezetten az alábbi ingyenesen vagy olcsón elérhető, mégis nagy teljesítményű modelleket támogatja:

| Szolgáltató | Modell Neve | Leírás | Felhasználási Terület |
| :--- | :--- | :--- | :--- |
| **Groq Cloud** | **Llama 3 (8B & 70B)** | Villámgyors válaszidő (500+ token/s). | Chatbotok, gyors döntéshozatal, egyszerű feladatok. |
| **Groq Cloud** | **Mixtral 8x7B** | Kiváló ár/érték arány, jó reasoning képesség. | Összetettebb analízis, kreatív írás. |
| **Google AI** | **Gemini 1.5 Flash** | **Ingyenes Tier!** Hatalmas kontextus (1M token). | Hosszú dokumentumok elemzése, adatkinyerés. |
| **Google AI** | **Gemma 2 (9B)** | Nyílt forráskódú, gyors modell. | Helyi/Gyors feladatok, ha a biztonság kritikus. |
| **OpenAI** | **GPT-4o mini** | (Opcionális, fizetős) Olcsóbb és gyorsabb, mint a GPT-4. | "Backup" lehetőség, ha a többi nem elérhető. |

---

## 5. Részletes Végrehajtási Ütemterv (Roadmap)

### 1. Fázis: Projekt Inicializálás (Kész)
*   [x] **Repo Setup**: `npx create-turbo@latest`.
*   [x] **Package Config**: TypeScript, ESLint, Prettier beállítása a root-ban.
*   [x] **Apps Létrehozása**: Üres `web`, `api`, `worker` mappák inicializálása.
*   [x] **Shared Packages**: `database` és `types` csomagok létrehozása.
*   [x] **Adatbázis**: Supabase projekt létrehozása, Connection string beszerzése.
*   [x] **Prisma Init**: `schema.prisma` megírása és `npx prisma db push` (vagy migrate) futtatása.

### 2. Fázis: Backend Core & Worker Logic (Folyamatban)
*   [ ] **Redis Setup**: Upstash fiók és `bullmq` connection beállítása.
*   [x] **Shared Types**: Zod sémák és alap típusok definiálása.
*   [x] **API Alapok**: Express szerver, Health check endpoint, Zod middleware.
*   [x] **Pipeline CRUD**: `POST /pipelines` (mentés), `GET /pipelines/:id` (betöltés, lista, módosítás, törlés).
*   [x] **Execution Endpoint**: `POST /execute` endpoint megírása (Job létrehozása + státusz/lista).
*   [ ] **Worker Váz**: BullMQ Worker process elindítása, Job fogadása.
*   [ ] **Topological Sort**: Algoritmus implementálása a `worker/src/engine` mappában.
*   [ ] **Dummy Node**: Egy egyszerű "Console Log" node implementálása teszteléshez.

### 3. Fázis: Frontend Visual Builder MVP (Nap 8-14)
*   [ ] **React Flow Setup**: Canvas megjelenítése, alap node-ok regisztrálása.
*   [ ] **Custom Node-ok**:
    *   `TriggerNode` (Start pont).
    *   `LLMNode` (Prompt input mezővel).
    *   `DisplayNode` (Eredmény megjelenítő).
*   [ ] **State Management**: Zustand store a gráf adatainak tárolására.
*   [ ] **API Integráció**: Mentés gomb bekötése (`fetch` API).
*   [ ] **Run Button**: Futtatás indítása és Polling (vagy SWR) a státusz lekérdezésére.

### 4. Fázis: AI Integráció és Logika (Nap 15-21)
*   [ ] **Variable Interpolation**: A `{{...}}` szintaxis parse-olása és cseréje a workeren belül.
*   [ ] **Node Implementációk**:
    *   `GroqService`: `groq-sdk` bekötése LLM hívásokhoz.
    *   `HttpService`: `fetch` alapú wrapper tetszőleges API hívásokhoz.
*   [ ] **Environment Variables**: API kulcsok kezelése (felhasználó adja meg vagy szerver oldali env).

### 5. Fázis: Polírozás és Deploy (Nap 22+)
*   [ ] **Hibakezelés**: UI visszajelzés (Toasts), ha a futás sikertelen.
*   [ ] **Logs View**: Egy egyszerű oldal, ahol a JSON logok szépen formázva megjelennek.
*   [ ] **Deployment**:
    *   Adatbázis migrációk futtatása prod-ban.
    *   Vercel és Render environment variable-k beállítása.
    *   Éles tesztelés.

### 6. Fázis: Tesztelés és QA (Folyamatos)
*   [ ] **Unit Tesztelés**:
    *   `src/engine/TopologicalSort.ts` algoritmus tesztelése körkörös hivatkozásokra.
    *   `src/nodes/LLMNode.ts` mockolt API válaszokkal.
*   [ ] **Integrációs Tesztelés**:
    *   API végpontok (`POST /execution`) tesztelése Supertest-tel.
    *   Adatbázis tranzakciók ellenőrzése.
*   [ ] **E2E Tesztelés (Playwright)**:
    *   Teljes felhasználói folyamat: Belépés -> Pipeline létrehozása -> Node-ok összekötése -> Futtatás -> Eredmény ellenőrzése.
*   [ ] **Terheléses Tesztelés**:
    *   Sok párhuzamos job indítása (Queue concurrency tesztelése).

---

## 7. Kockázatelemzés és Edge Case-ek (Risk Assessment)

Ez a fejezet a fejlesztés során potenciálisan felmerülő problémákat, határeseteket (edge cases) és kockázatokat gyűjti össze, valamint javaslatokat tesz a kezelésükre.

### 7.1. Végrehajtási Motor (Execution Engine) Kockázatok
*   **Végtelen Ciklusok (Infinite Loops):** Bár a UI elvileg csak DAG-ot (Directed Acyclic Graph) engedélyez, egy rosszindulatú felhasználó beküldhet olyan JSON-t, ahol `A -> B -> A` hivatkozás van.
    *   **Megoldás:** Szigorú Topológiai Rendezés ellenőrzés a mentéskor ÉS a futtatás előtt. Max Step Limit bevezetése (pl. 50 lépés).
*   **"Zombie" Job-ok:** A Worker folyamat összeomlik egy futó job közben.
    *   **Megoldás:** Heartbeat mechanizmus és Global Timeout (pl. 5 perc) minden pipeline futásra.
*   **Memória Kifutás (OOM):** Nagy adatok (pl. könyvek) betöltése node-okba.
    *   **Megoldás:** Payload Limit (pl. 1MB/node) és Reference Passing (Fájlok URL-ként utaztatása).

### 7.2. Külső API és LLM Integrációs Kockázatok
*   **Rate Limiting és Költségek:** A felhasználó véletlenül egy ciklusba tesz egy LLM hívást.
    *   **Megoldás:** Concurrency Control (max. 1-2 párhuzamos futás/user), Exponential Backoff retry strategy, és napi költési limit figyelése.
*   **Prompt Injection:** A felhasználó manipulálja a System Promptot.
    *   **Megoldás:** Bemeneti adatok (Variables) egyértelmű elválasztása XML tagekkel (`<user_input>...`).
*   **Nem Determinisztikus Kimenet:** Az LLM nem valid JSON-t ad vissza.
    *   **Megoldás:** Robust Parsing (zod-gpt) és automatikus újrapróbálkozás hiba esetén.

### 7.3. Infrastruktúra és Hosting Kockázatok (Free Tier)
*   **Cold Start:** A Render/Vercel szerverek leállnak inaktivitás után (30-60s várakozás).
    *   **Megoldás:** Keep-Alive Ping (cron job 10 percenként) és türelmes Loading State a UI-on.
*   **Redis Kapcsolat Szakadása:** Serverless Redis idle időben bonthatja a kapcsolatot.
    *   **Megoldás:** Automatikus újracsatlakozási logika (`retryStrategy`) konfigurálása.

### 7.4. UI/UX Kockázatok
*   **Elavult Gráf Állapot:** Szerkesztés közbeni futtatás.
    *   **Megoldás:** Versioning/Snapshot készítése futtatáskor.
*   **Túl Komplex Gráf:** React Flow belassulása sok node esetén.
    *   **Megoldás:** Csak a látható terület (Viewport) renderelése.

