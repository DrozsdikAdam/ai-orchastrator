# AI Workflow Orchestrator (No-Code LLM Platform)

Ez egy modern, mesterséges intelligencia munkafolyamatokat kezelő platform, amely lehetővé teszi komplex AI pipeline-ok vizuális tervezését és automatizált futtatását.

## Projekt Állapot

| Fázis | Státusz |
| :--- | :--- |
| Monorepo Infrastruktúra | ✅ Kész |
| Közös Csomagok (types, database, tsconfig) | ✅ Kész |
| Backend API | ✅ Kész |
| Worker Service | ✅ Kész |
| Frontend (Next.js) | 🔄 Fejlesztés alatt |
| Deploy | ⏳ Tervezve |

---

## Architektúra

```
apps/
├── api/          Express.js REST API (auth, pipeline CRUD, execution, stats)
├── worker/       BullMQ Worker (pipeline végrehajtás, gráf feldolgozás)
└── web/          Next.js frontend (React Flow pipeline szerkesztő) [WIP]

packages/
├── database/     Prisma ORM + séma + migrációk
├── types/        Zod sémák + megosztott TypeScript típusok
└── tsconfig/     Megosztott TypeScript konfigurációk
```

## Technológiai Stack

| Terület | Technológia |
| :--- | :--- |
| Frontend | Next.js 16 (App Router), React Flow, Zustand, TanStack Query, TailwindCSS v4, Shadcn/UI |
| Backend API | Express.js, Node.js, Zod validáció |
| Worker | BullMQ, ioredis |
| Database | PostgreSQL (Supabase), Prisma ORM |
| Queue/Cache | Redis (Upstash) |
| AI (tervezve) | Groq (Llama 3), Google AI (Gemini), OpenAI |
| Monorepo | Turborepo |

---

## Backend API (`apps/api`)

### Funkciók
- **JWT autentikáció** – bcrypt jelszó hashelés, token alapú védelem
- **Pipeline CRUD** – létrehozás, listázás, módosítás, törlés
- **Execution** – pipeline futtatás indítása (BullMQ queue-ba helyezés), státusz lekérdezés
- **API Key kezelés** – AI szolgáltató kulcsok biztonságos tárolása
- **Dashboard Stats** – összesített statisztikák
- **Standardizált hibakezelés** – `ApiError` osztály, egységes hibaválaszok

### API Végpontok

Minden végpont az `/auth` kivételével `Authorization: Bearer <token>` fejlécet igényel.

#### 🔐 Auth
| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Új felhasználó létrehozása |
| `POST` | `/auth/login` | Belépés és JWT token igénylése |

#### 🏗️ Pipeline
| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/pipelines` | Új pipeline mentése |
| `GET` | `/pipelines` | Összes saját pipeline listázása |
| `GET` | `/pipelines/:id` | Egy konkrét definíció lekérése |
| `PUT` | `/pipelines/:id` | Meglévő gráf módosítása |
| `DELETE` | `/pipelines/:id` | Pipeline végleges törlése |

#### 🚀 Execution
| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/pipelines/:id/execute` | Futtatás indítása (queue-ba helyezés) |
| `GET` | `/pipelines/:id/executions` | Egy pipeline korábbi futásainak listája |
| `GET` | `/executions/:id` | Aktuális státusz, logok és eredmények |

#### 🔑 API Key
| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/api-keys` | Kulcs mentése vagy frissítése |
| `GET` | `/api-keys` | Mentett szolgáltatók listázása (kulcs nélkül) |
| `DELETE` | `/api-keys/:id` | API kulcs törlése |

#### 📊 Stats
| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `GET` | `/stats/dashboard` | Összesített statisztikák |

#### 🛠️ System
| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `GET` | `/health` | API állapot ellenőrzése (Public) |

---

## Worker Service (`apps/worker`)

A Worker a BullMQ queue-ból érkező feladatokat dolgozza fel.

### Működés
1. **Queue figyelés** – A `pipeline-queue` nevű sort figyeli
2. **Pipeline betöltés** – Adatbázisból lekéri a pipeline definíciót
3. **Topológiai rendezés** – Kahn-algoritmussal meghatározza a node-ok végrehajtási sorrendjét
4. **Változó feloldás** – `{{nodeId.field}}` mintákat behelyettesíti a context értékeivel
5. **Node végrehajtás** – Típus alapján meghívja a megfelelő handler-t
6. **Eredmény mentés** – Státusz frissítése (`COMPLETED` / `FAILED`) + logok mentése

### Engine komponensek
| Fájl | Funkció |
| :--- | :--- |
| `topologicalSort.ts` | DAG rendezés (Kahn-algoritmus), ciklus detektálás |
| `variableResolver.ts` | Template változók feloldása (`{{nodeId.output}}`) |
| `graphExecutor.ts` | Fő végrehajtó logika (orchestráció) |
| `nodes/index.ts` | Node handler registry (trigger, llm, http, logic) |

### Node típusok (handler-ek)
| Típus | Státusz | Leírás |
| :--- | :--- | :--- |
| `trigger` | ✅ Kész | Passthrough – továbbítja az adatot |
| `llm` | 🔲 Mock | AI modell hívás (Groq/Gemini/OpenAI) |
| `http` | 🔲 Mock | HTTP kérés küldése |
| `logic` | 🔲 Mock | Feltételes elágazás |

---

## Fejlesztés

### Követelmények
- Node.js 22+
- npm 10+

### Telepítés
```bash
git clone <repo>
cd ai-orchastrator
npm install
```

### Környezeti változók
Hozd létre a `.env` fájlokat:

**`apps/api/.env`**
```
DATABASE_URL=<Supabase connection string>
REDIS_URL=<Upstash Redis URL (rediss:// formátum)>
JWT_SECRET=<min. 32 karakter>
PORT=3000
```

**`apps/worker/.env`**
```
DATABASE_URL=<Supabase connection string>
REDIS_URL=<Upstash Redis URL (rediss:// formátum)>
```

**`packages/database/.env`**
```
DATABASE_URL=<Supabase connection string>
DIRECT_URL=<Supabase direct connection string>
```

### Futtatás
```bash
# Minden szolgáltatás egyszerre (API + Worker + Types + Database)
npm run dev

# Prisma client generálás (packages/database mappából)
npx prisma generate

# Prisma migráció
npx prisma migrate dev
```
