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
- **Séma**: Kész felhasználókezelési (jelszó validációval), pipeline és végrehajtási modellek.
- **Migráció**: Sikeresen alkalmazott migrációk Supabase (PostgreSQL) környezetben.

### 3. Típusbiztonság (`packages/types`)
- **Zod Schemas**: Runtime validálható adatsémák minden fontos entitáshoz.
- **Domain-alapú felosztás**: Különálló, átlátható modulok a felhasználók, pipeline-ok és API kérések számára.
- **Inferred Types**: Automatikusan származtatott TypeScript interfészek.

## Technológiai Stack
- **Frontend**: Next.js (App Router), React Flow (Tervezve)
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Supabase), Prisma
- **Queue/Cache**: Redis (Upstash)
- **AI**: Groq (Llama 3), Google AI (Gemini Flash)

## Következő Lépések
- Az Express alapú API API szerver elindítása és a Redis kapcsolat felépítése.
- A Worker szolgáltatás inicializálása a munkafolyamatok futtatásához.
