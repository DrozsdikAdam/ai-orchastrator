# AI Workflow Orchestrator (No-Code LLM Platform)

Ez egy modern, mesterséges intelligencia munkafolyamatokat kezelő platform, amely lehetővé teszi komplex AI pipeline-ok vizuális tervezését és automatizált futtatását.

## Jelenlegi Állapot (Working Features)

A projekt kezdeti fázisán túl vagyunk, az alapvető infrastruktúra és a közös adatszerkezetek készen állnak.

### 1. Monorepo Infrastruktúra
- **Turborepo**: Skálázható, nagy teljesítményű monorepo struktúra.
- **TypeScript**: Szigorú típuskezelés a teljes kódbázisban.
- **Megosztott konfigurációk**: Egységesített `tsconfig` csomagok az alkalmazásokhoz.

### 2. Adatbázis Réteg (`packages/database`)
- **Prisma ORM**: Modern adatbázis hozzáférési réteg.
- **Séma**: Felhasználókezelési (jelszó validációval), API kulcs, pipeline és végrehajtási modellek.
- **Migráció**: Produkciós adatbázis sémával szinkronizált állapot.

### 3. Backend API (`apps/api`)
- **Express.js API**: Strukturált, middleware-alapú architektúra.
- **Autentikáció**: JWT-alapú védelem jelszó hasheléssel (bcrypt).
- **Pipeline Kezelés**: Teljes körű CRUD műveletek pipeline-okhoz.
- **Végrehajtás**: Pipeline futtatások indítása és státuszellenőrzés (BullMQ integrációval).
- **Validáció**: Zod sémák használata a requestek automatikus validálásához.

### 4. Típusbiztonság (`packages/types`)
- **Zod Schemas**: Runtime validálható adatsémák minden fontos entitáshoz.
- **Megosztott Típusok**: Egységes interfészek a frontend és backend között.

## Technológiai Stack
- **Frontend**: Next.js (App Router), React Flow (Tervezve)
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Supabase), Prisma
- **Queue/Cache**: Redis (Upstash)
- **AI**: Groq (Llama 3), Google AI (Gemini Flash)
- **Queue**: BullMQ (Redis)

## API Végpontok

Minden végpont a `/auth` kivételével `Authorization: Bearer <token>` fejlécet igényel.

### 🔐 Felhasználókezelés (Auth)
A rendszerbe való regisztrációért és a biztonságos belépésért felelős végpontok.

| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Új felhasználó létrehozása |
| `POST` | `/auth/login` | Belépés és JWT token igénylése |

### 🏗️ Pipeline menedzsment
A munkafolyamatok (gráfok) létrehozására, szerkesztésére és tárolására szolgáló felület.

| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/pipelines` | Új pipeline mentése |
| `GET` | `/pipelines` | Összes saját pipeline listázása |
| `GET` | `/pipelines/:id` | Egy konkrét definíció lekérése |
| `PUT` | `/pipelines/:id` | Meglévő gráf módosítása |
| `DELETE` | `/pipelines/:id` | Pipeline végleges törlése |

### 🔑 API kulcsok (ApiKey)
A saját AI szolgáltatók (pl. Groq, Gemini) kulcsainak biztonságos tárolására szolgáló végpontok.

| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/api-keys` | Kulcs mentése vagy frissítése |
| `GET` | `/api-keys` | Mentett szolgáltatók listázása (kulcs nélkül) |
| `DELETE` | `/api-keys/:id` | API kulcs törlése |

### 🚀 Végrehajtás (Execution)
A kész pipeline-ok elindításáért és a futási eredmények nyomon követéséért felelős végpontok.

| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/pipelines/:id/execute` | Futtatás indítása (behelyezés a sorba) |
| `GET` | `/pipelines/:id/executions` | Egy pipeline korábbi futásainak listája |
| `GET` | `/executions/:id` | Aktuális státusz, logok és eredmények |

### 🛠️ Rendszer (System)
Diagnosztikai és technikai végpontok.

| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `GET` | `/health` | API állapot ellenőrzése (Public) |

## Következő Lépések
- Az Express alapú API API szerver elindítása és a Redis kapcsolat felépítése.
- A Worker szolgáltatás inicializálása a munkafolyamatok futtatásához.
