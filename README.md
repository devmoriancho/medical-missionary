# Medical Missionary E-Commerce Web Engine

A high-performance, production-ready, serverless full-stack web storefront built with Next.js and Neon PostgreSQL. This core transactional engine features a type-safe relational architecture, secure server-isolated business mutations, atomic inventory reservation controls, and compliance-aligned retail catalog management.

---

## System Architecture & Core Data Flow

The platform enforces a strict **Server-Isolation Architecture Pattern**. The client browser never interacts with the database directly or executes calculations involving pricing or currency thresholds. All states, mutations, validation rules, and transactional pipelines run entirely within isolated server environments.

### 1. Atomic Stock Reservation & Checkout Flow

- **Ingress:** The customer specifies their order quantity in the browser interface and transmits only the item `id` and sequential `quantity` parameters to the server workspace.
- **Validation:** The incoming payload parameters are strictly verified on the backend layer utilizing **Zod Validation Engines** to eliminate parameter tampering.
- **Transaction Isolation:** The system initializes an atomic `db.transaction()` block. It locks down the database row, checks real-time inventory levels, and performs an atomic decrement constraint (`stock_quantity - quantity`) directly via SQL to fully eliminate double-selling race conditions.
- **Egress:** If a validation error or item stockout triggers mid-flight, the transaction automatically executes a database-level rollback, keeping the consumer's cart intact. On success, historic item variables are captured, and the cart is reset.

### 2. State Machine Separation & Idempotency Rules

- **Decoupled Lifecycles:** Order lifecycle states (`order_status`), payment settlement states (`payment_status`), and dynamic fulfillment logistics statuses (`delivery_status`) are managed through entirely separate, strict PostgreSQL database native enums to prevent structural state locking.
- **Webhook Identity Keys:** The database enforces a `unique` constraint layout over the transaction identifier column (`provider_reference`) inside the payment tracking records table. This guarantees a safe layer of automatic idempotency against duplicated API webhook retry updates from external payment gateways.

---

## Database Infrastructure Blueprint (Drizzle ORM)

The underlying relational schema is tracked programmatically using **Drizzle ORM Object Contracts** optimized for performance-tuned PostgreSQL runtime engines.

### Table Architecture Matrix

- **`categories`**: Stores structural taxonomy definitions for remedies, organic oils, and health literature using unique slug strings matching absolute route configurations.
- **`products`**: Retains store catalog details, precision prices (`numeric`), logistics weight metrics (in grams for dynamic courier routing), and automated status constraints (`is_active`).
- **`users`**: Manages secure account credentials, access attributes, and role permissions checked strictly on server execution routes.
- **`orders`**: Handles core financial parent boundaries. Implements a nullable `userId` relation parameter to seamlessly support high-conversion **Guest Checkout** paths while capturing immutable delivery addresses and buyer profiles directly on the row snapshot.
- **`orderItems`**: Manages transactional history boundaries. Saves an immutable snapshot copy of `price_at_purchase` and `product_name_snapshot` to keep old corporate corporate ledger states 100% clean if product data updates later.
- **`payments`**: **(New Isolation Table)** Monitors transaction attempts per order. Tracks the specified gateway provider, confirmation references, and preserves raw API metadata properties (`raw_payload`) for auditing.
- **`inventory_movements`**: **(New Audit Table)** Tracks chronological inventory changes. Logs exact additions, reservation holds, sales, or returns by product ID to deliver absolute stock visibility.
- **`product_embeddings`**: Holds specialized vector geometric multi-dimensional array parameters (`vector(1536)`) reserved for future AI engine feature releases.

---

## Unified Workspace File Matrix

- `src/actions/`: Holds server-isolated operations executing database mutations, input parsers, and financial transactions safely behind the client visibility line (`"use server"`).
- `src/app/`: Modern App Router setup incorporating asynchronous dynamic parameter layouts, dynamic route layouts (`/products/[slug]`), and high-performance server components.
- `src/components/`: Houses reusable visual UI components, navigation structures, and optimized brand vector assets (`AppLogo.tsx`).
- `src/context/`: Contains the global client application cart context and state provider hooks to handle fluid interactions seamlessly across view layers.
- `src/db/`: Foundational persistence core keeping data schemas (`schema.ts`), idempotent seed loaders (`seed.ts`), and the stateless serverless HTTP database connection configurations (`index.ts`) centralized.
- `proxy.ts`: **(Next.js 16 Configuration Layer)** Custom routing and authentication mediation mechanism protecting checkout paths and administrative boundaries securely.

---

## Current Features

- Responsive landing page with hero section
- About, Services, Products, and Contact sections
- Database-powered product catalogue using Drizzle ORM and Neon PostgreSQL
- Product detail pages with stock information
- Shopping cart and checkout flow
- Kenya-focused pricing and delivery support
- M-Pesa and Stripe payment options prepared for integration
- Responsive navigation with mobile menu
- Category-based product pages

## Routes

- `/`
- `/about`
- `/services`
- `/products`
- `/contact`
- `/categories/[slug]`
- `/checkout`

### Version 1.1 Structural Schema Hardening Updates

- **`orders`**: Added a mandatory `buyer_email` column snapshot to capture customer communications securely at checkout, while supporting the optional `user_id` relation branch for high-conversion Guest Checkout access.
- **`payments` & `inventory_movements`**: Introduced independent transaction and movement ledgers. The payment infrastructure locks a `unique` constraint over `provider_reference` parameters to enforce automated idempotency protections against repeated external webhook retries.
- **Atomic Operations Protection**: Database triggers and loops execute stock adjustments strictly inside `db.transaction()` pipelines, using direct SQL expressions (`stock_quantity - quantity`) to entirely eliminate concurrency double-selling bugs.

## Verification & Development Walkthrough

### Local Environment Asset Configuration (`.env.local`)

Create a localized key-value asset ledger file matching this parameter grid to connect local assets safely:

```env
DATABASE_URL=postgres://[user]:[password]@[host]/[database]?sslmode=require
```

### Operational Commands

Execute these baseline environment commands to build, inspect, and check your environment states cleanly:

```bash
# Verify TypeScript compilation safety across all source structures
npx tsc --noEmit --skipLibCheck

# Populate the remote Neon database with idempotent, compliance-aligned seed data
npm run db:seed

# Run the local Turbopack development compilation stack
npm run dev

# Compile a clean, optimized, production-ready environment site build bundle
npm run build
```
