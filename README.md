# AI Workflow Orchestrator (No-Code LLM Platform)

Ez egy vizuális felületen tervezhető, mesterséges intelligencia munkafolyamatokat kezelő platform, amely lehetővé teszi komplex AI pipeline-ok tervezését és automatizált végrehajtását. A rendszer segítségével programozói tudás nélkül hozhatók létre automatizált munkafolyamatok, amelyek összekapcsolják a különböző LLM modelleket, külső API-kat és logikai elágazásokat.

## A projekt felépítése és architektúrája

A projekt egy monorepo struktúrában helyezkedik el, amelyet a Turborepo kezel. Ez biztosítja a TypeScript típusok és az adatbázis-sémák megosztását az egyes szolgáltatások között.

A rendszer az alábbi komponensekből áll:

### Alkalmazások (apps)
*   **api** (apps/api): Express.js alapú REST API, amely az autentikációt, a pipeline-ok kezelését (CRUD), a futtatások indítását, az API kulcsok tárolását és a dashboard statisztikákat kezeli.
*   **worker** (apps/worker): BullMQ alapú worker szolgáltatás, amely a pipeline-ok aszinkron végrehajtásáért, a gráf topológiai rendezéséért és a csomópontok feldolgozásáért felel.
*   **web** (apps/web): Next.js frontend alkalmazás React Flow alapú vizuális szerkesztővel, Zustand állapotkezeléssel és TailwindCSS v4/Shadcn UI stílusokkal.

### Közös csomagok (packages)
*   **database** (packages/database): Prisma ORM sémák és migrációk a PostgreSQL (Supabase) adatbázishoz.
*   **types** (packages/types): Megosztott TypeScript típusok és Zod validációs sémák.
*   **tsconfig** (packages/tsconfig): Közös TypeScript konfigurációk.

---

## Technológiai Stack

*   **Frontend**: Next.js 16 (App Router), React Flow, Zustand, TanStack Query, TailwindCSS v4, Shadcn/UI, Lucide React
*   **Backend API**: Express.js, Node.js, Zod (validáció), BullMQ, ioredis
*   **Worker**: BullMQ, ioredis, Prisma Client
*   **Adatbázis**: PostgreSQL (Supabase), Prisma ORM
*   **Üzenetsor / Gyorsítótár**: Redis (Upstash)
*   **AI Modellek (Tervezve)**: Groq (Llama 3, Mixtral), Google AI (Gemini, Gemma), OpenAI (GPT-4o mini)
*   **Monorepo menedzsment**: Turborepo

---

## A projekt jelenlegi állása

A fejlesztés jelenleg a frontend és a worker logika összekapcsolásának fázisában tart. Az alábbiakban olvasható a komponensek részletes készültségi állapota.

### 1. Monorepo Infrastruktúra és Közös Csomagok (Elkészült)
*   A Turborepo konfigurációja elkészült, a fejlesztési és build folyamatok megfelelően működnek.
*   A `packages/tsconfig` tartalmazza a megosztott TypeScript beállításokat Next.js és Node.js környezetekhez.
*   A `packages/types` tartalmazza a Zod sémákat és TypeScript definíciókat a felhasználókhoz, pipeline-okhoz és futtatásokhoz.
*   A `packages/database` tartalmazza a Prisma sémát (User, ApiKey, Pipeline, Execution modellek) és a Supabase PostgreSQL adatbázis-kapcsolatot. A migrációk sikeresen lefutottak.

### 2. Backend API (Elkészült)
Az Express.js backend szerver teljes körűen megvalósításra került a következő funkciókkal:
*   **Hitelesítés (Auth)**: JWT alapú regisztráció és bejelentkezés, bcrypt jelszó-hasheléssel.
*   **Pipeline CRUD**: Végpontok a folyamatok mentésére, betöltésére, módosítására és törlésére.
*   **Végrehajtás indítása**: A pipeline futtatásának sorba állítása a BullMQ üzenetsoron keresztül.
*   **API kulcsok kezelése**: Szolgáltatók (OpenAI, Groq, Gemini) API kulcsainak biztonságos tárolása és kezelése.
*   **Statisztikák és Monitorozás**: Dashboard statisztikák lekérdezése, valamint health check végpont.
*   **Hibakezelés**: Egységesített ApiError osztály és központi hibakezelő middleware.

Az API végpontok listája:
*   `POST /auth/register` - Új felhasználó regisztrációja
*   `POST /auth/login` - Bejelentkezés és token generálása
*   `POST /pipelines` - Új pipeline mentése
*   `GET /pipelines` - Pipeline-ok listázása
*   `GET /pipelines/:id` - Pipeline lekérése
*   `PUT /pipelines/:id` - Pipeline módosítása
*   `DELETE /pipelines/:id` - Pipeline törlése
*   `POST /pipelines/:id/execute` - Pipeline futtatásának indítása (queue-ba helyezés)
*   `GET /pipelines/:id/executions` - Pipeline korábbi futásainak listája
*   `GET /executions/:id` - Futási státusz, logok és eredmények lekérése
*   `POST /api-keys` - API kulcs mentése vagy frissítése
*   `GET /api-keys` - Mentett szolgáltatók listázása kulcsok nélkül
*   `DELETE /api-keys/:id` - API kulcs törlése
*   `GET /stats/dashboard` - Összesített statisztikák lekérése
*   `GET /health` - API egészségi állapotának ellenőrzése

### 3. Worker Service (Részben elkészült)
A háttérben futó feladatfeldolgozó alapjai és az orchestrator motor implementálva lettek:
*   **Üzenetsor kezelés**: A BullMQ-val megvalósított queue-figyelés beállításra került a `pipeline-queue` soron.
*   **Topológiai rendezés**: A Kahn-algoritmus segítségével a rendszer meghatározza a csomópontok végrehajtási sorrendjét (DAG), valamint detektálja az esetleges körkörös hivatkozásokat.
*   **Változó feloldás**: A `variableResolver` modul behelyettesíti a `{{nodeId.field}}` formátumú hivatkozásokat a futási környezet (Context) aktuális értékeivel.
*   **Gráf végrehajtó motor**: A `graphExecutor` végzi a teljes pipeline futtatásának menedzselését, a státuszok és naplófájlok (logs) frissítését.
*   **Csomópont típusok**: A trigger csomópont implementálásra került, míg a többi típus jelenleg szimulált (mock) válaszokat ad vissza.

### 4. Frontend (Fejlesztés alatt - frontEnd ágon)
A felhasználói felület alapvető vizuális elemei elkészültek:
*   **Pipeline Szerkesztő**: A React Flow segítségével megvalósított interaktív felület, ahol a felhasználók drag and drop módszerrel helyezhetnek el és köthetnek össze csomópontokat.
*   **Zustand Store**: Központi állapotkezelés a gráf csomópontjainak (nodes) és kapcsolatainak (edges) CRUD műveleteihez.
*   **Sidebar**: A Catppuccin dizájnrendszer alapján stílusozott paletta, Lucide ikonokkal ellátva.
*   **Egyedi Csomópontok**:
    *   TriggerNode: A folyamat indítási pontja (1 kimenet).
    *   LLMNode: AI modell hívás (2 bemenet, 1 kimenet).
    *   HttpNode: Külső HTTP kérések indítása (1 bemenet, 2 kimenet: válasz és hiba).
    *   LogicNode: Feltételes elágazások kezelése (1 bemenet, 2 kimenet: igaz és hamis ág).
    *   OutputNode: Folyamat kimeneti pontja (2 bemenet).

---

## Jövőbeli teendők (Roadmap)

A projekt teljes körű befejezéséhez az alábbi fejlesztési lépések szükségesek:

### 1. Worker fejlesztések
*   **Valós Node Handlerek implementálása**:
    *   `LLMNode` integrálása a tényleges szolgáltatók API-jaival (Groq Cloud SDK, Google Generative AI SDK, OpenAI SDK) a Vercel AI SDK használatával.
    *   `HttpNode` felkészítése valós HTTP kérések indítására, timeout kezelésre és státuszkódok ellenőrzésére.
    *   `LogicNode` logikai kiértékelésének implementálása (összehasonlító operátorok, feltételek ellenőrzése).

### 2. Frontend fejlesztések
*   **Csomópont tulajdonságok szerkesztő panelje**: Okyan oldalsó vagy modális panel létrehozása, amely lehetővé teszi az egyes csomópontok specifikus beállításainak módosítását (pl. LLM modell kiválasztása, prompt megadása, HTTP URL beállítása).
*   **Autentikációs oldalak**: Regisztrációs és bejelentkezési űrlapok felépítése a backend API hívások bekötésével.
*   **Dashboard**: Főoldal, amely megjeleníti az összesített statisztikákat (futtatások száma, sikeres/sikertelen arány, napi statisztikák).
*   **Pipeline lista**: Felhasználóbarát felület a meglévő pipeline-ok listázására, szerkesztés indítására és törlésére.
*   **Futtatási részletek**: Olyan nézet, ahol a felhasználók megtekinthetik az egyes folyamat-végrehajtások lépéseit, a csomópontok be- és kimeneteit, valamint a részletes naplókat (logokat).
*   **API kulcsok kezelő felülete**: Biztonságos űrlap, ahol a felhasználók beállíthatják és törölhetik saját API kulcsaikat.

### 3. Futtatás, Tesztelés és Deploy
*   **Turborepo scriptek finomhangolása**: A fejlesztési és build folyamatok parancsainak optimalizálása a gyökér szinten.
*   **Környezeti változók konfigurálása**: A `.env` sablonok véglegesítése a produkciós környezetekhez.
*   **Automatizált tesztelés**:
    *   Unit tesztek a topológiai rendezéshez és változófeloldáshoz (Vitest).
    *   API integrációs tesztek (Supertest).
    *   End-to-End tesztek a szerkesztőfelület működésének és a futtatási folyamatnak az ellenőrzésére (Playwright).
*   **Deployment**:
    *   Adatbázis migrációk beállítása produkciós környezetben (Supabase).
    *   Next.js frontend hosztolása a Vercel platformján.
    *   Backend API és Worker hosztolása a Render.com platformján.
    *   Redis kapcsolat (Upstash) stabilizálása és automatikus újracsatlakozási logika implementálása.

---

## Fejlesztési Útmutató

### Rendszerkövetelmények
*   Node.js 22 vagy újabb verzió
*   npm 10 vagy újabb verzió

### Telepítés
1. A távoli tároló klónozása:
   ```bash
   git clone <repository_url>
   cd ai-orchastrator
   ```
2. Függőségek telepítése a gyökérkönyvtárban:
   ```bash
   npm install
   ```

### Környezeti változók konfigurálása
Hozza létre a megfelelő `.env` fájlokat a megadott sablonok alapján az alábbi elérési utakon:

**`apps/api/.env`**
```env
DATABASE_URL=postgres://<felhasznalonev>:<jelszo>@<host>:5432/<adatbazis>
REDIS_URL=rediss://default:<jelszo>@<redis_host>:<port>
JWT_SECRET=<legalabb_32_karakteres_titok>
PORT=3000
```

**`apps/worker/.env`**
```env
DATABASE_URL=postgres://<felhasznalonev>:<jelszo>@<host>:5432/<adatbazis>
REDIS_URL=rediss://default:<jelszo>@<redis_host>:<port>
```

**`packages/database/.env`**
```env
DATABASE_URL=postgres://<felhasznalonev>:<jelszo>@<host>:5432/<adatbazis>
DIRECT_URL=postgres://<felhasznalonev>:<jelszo>@<host>:5432/<adatbazis>
```

### Futtatás helyi környezetben
1. Generálja le a Prisma klienst a `packages/database` könyvtárból:
   ```bash
   npx prisma generate
   ```
2. Futtassa a migrációkat:
   ```bash
   npx prisma migrate dev
   ```
3. Indítsa el az összes szolgáltatást egyszerre (API, Worker, Frontend):
   ```bash
   npm run dev
   ```

### Git ágak kezelése
*   **development**: Stabil fejlesztői ág, amely a backend API-t és a worker szolgáltatást tartalmazza.
*   **frontEnd**: Aktív fejlesztési ág a frontend webalkalmazás és a pipeline szerkesztő részére.
