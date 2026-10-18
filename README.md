# 🍃 Medical Missionary Agentic E-Commerce Platform

An enterprise-grade, production-ready, cross-platform architecture combining a **Next.js Full-Stack Web Engine** and a **React Native Mobile Frontend** into a single system. This ecosystem serves as a digital health center, integrating an autonomous AI Health Consultant Layer alongside secure, localized countrywide payment processing systems.

---

## 🏗️ System Architecture & Data Flow

To maintain high security and data integrity, a strict **API Proxy Rule** is enforced across the ecosystem. Frontends never communicate directly with the database or external APIs; all operations are safely securely mediated through the centralized Next.js backend engine.

[ Next.js Web Frontend ] (For Browsers)
│
▼
[ Mobile App Frontend ] ───> [ Next.js Backend (API / Handlers) ] ───> [ Central Neon Postgres DB ]
(React Native / Expo) ▲
│
[ AI Agent Layer (LLM) ]

### 1. Vector Proximity Search Flow (AI Remedy Search)

- **Ingress:** Client enters a natural language health goal or health concern through the chat drawer interface.
- **Orchestration:** The Next.js Backend Action proxies the text query to the OpenAI Embeddings engine, which returns a vector coordinate array of 1,536 fractions representing semantic context.
- **Data Layer:** The system runs an optimized mathematical distance check against the PostgreSQL database engine utilizing the `pgvector` index matching engine.
- **Egress:** The matched inventory data points are returned as type-safe data schemas and natively rendered as responsive product recommendations in the client interface.

### 2. Transactional Payment Webhook Lifecycle

- **Ingress:** The customer checks out utilizing their regional profile data attributes (M-Pesa STK Push for Kenyan mobile currency or Stripe for international payment card routing).
- **Validation:** Forms and parameters are parsed using **Zod Validation Engines** on the server before mutating states.
- **Orchestration:** Next.js establishes a tracking footprint inside the `orders` ledger under a `pending` state, then fires the remote gateway handshake.
- **Callback Execution:** External provider systems handle PIN inputs securely and shoot an encrypted payload back to the localized system webhook routes (`/api/webhooks/mpesa` or `/api/webhooks/stripe`). Ledgers automatically settle state changes into `paid` upon validation.

---

## 🗄️ Relational Database Blueprint (Neon PostgreSQL + Drizzle ORM)

The data infrastructure is handled within a single, serverless instance of PostgreSQL tracked programmatically using **Drizzle ORM Object Contracts**.

┌──────────────┐ ┌──────────────┐
│ categories │1 ─── 0.._ │ products │ 1 ─── 1 [ product_embeddings ] (AI Memory Vector)
└──────────────┘ └──────┬───────┘
│ 1
│
▼ 0.._
┌──────────────┐ 1 ┌──────┴───────┐
│ users │───────────►│ order_items │
└──────────────┘ 0.._ └──────┬───────┘
│ 0.._
│
▼ 1
┌──────────────┐
│ orders │
└──────────────┘

### Table Matrix Details

- **`categories`**: Tracks organizational branches for organic supplements, lifestyle literature, and remedial oils. Includes unique constraints and absolute route url-slug matching structures.
- **`products`**: Retains critical product constraints, including inventory metric checks, cloud content references, and mass weight configurations (in grams) for automated shipping fee calculations.
- **`users`**: Manages entity profiles and system credentials. plain-text credentials are strictly blocked; system layer scrambles values securely through industry-standard salt-hashing (`bcrypt`) before saving to memory pools.
- **`orders` & `order_items`**: Handles financial accounting boundaries. Employs precision floating decimal allocations to block rounded penny currency bugs during transactions. Retains standalone purchase cost instances to preserve stable historical corporate statements if baseline store costs shift.
- **`product_embeddings`**: Houses highly advanced geometric AI array attributes (`vector(1536)`) map-linked directly to physical inventory elements via cascading parameters.

---

## 🛠️ Unified Ecosystem Configuration Scope

### Active Code Structures & Folder Matrix

The codebase is segmented into modular components to easily allow cross-platform portability:

- `src/actions/`: Centralized backend operations handling database queries and business mutations.
- `src/app/api/`: Standard App Router handlers exposing data vectors cleanly to the future mobile view layer and receiving background webhooks.
- `src/components/`: Reusable interface architecture designed through modular practices (including isolated custom assets like `AppLogo.tsx`).
- `src/db/`: Foundational data layer keeping structural table schemas and connection configuration contexts centralized.
- `src/lib/`: External integration managers keeping references to provider SDK engines secure.

### Local Infrastructure Layer (`.env.local`)

To shield infrastructure properties from scraping bots or target system attacks, variable profiles are mapped within localized states explicitly ignored by continuous Git tracking files:

- Core PostgreSQL Pipeline Credentials
- Authentication Session Encryption Signatures
- AI Engine Access Directives
- Countrywide & Global Monetary Gateways

---
