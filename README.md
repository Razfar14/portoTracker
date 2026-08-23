# IDX Financial & Corporate Fundamentals API-as-a-Service

A production-ready SaaS API project designed for developers to retrieve comprehensive financial fundamentals (PER, PBV, Market Cap, ROE, DER, Revenue Growth, and Sector) for Indonesian Stock Exchange (IDX) companies.

Built with **Express.js**, **Sequelize ORM**, and **PostgreSQL**, optimized for serverless deployments on **Vercel Serverless Functions** with **Supabase (Postgres)** database hosting.

---

## 🚀 Key Features

1. **Dual Authentication Framework**:
   * **Developer JWT Auth**: Used to secure the developer portal (register/login/dashboard).
   * **SHA-256 API Key Auth**: Hashed key verification via the `X-API-KEY` header for highly secure, low-latency client data consumption.
2. **Serverless Optimized Architecture**:
   * Lazy database connection pools to handle Vercel cold-starts and connection limits.
   * Auto-synchronizing schemas to match database tables automatically on the first serverless request.
3. **Interactive Developer Portal**:
   * A beautiful single-page dashboard designed using Tailwind CSS.
   * Self-service API Key generation (keys shown only once) with a clipboard copy utility.
   * Interactive **API Sandbox playground** to run API queries and view styled JSON responses in real-time.
4. **Rich Historical Seeding**:
   * Pre-configured seeder containing **exactly 50 real IDX stocks** across 8 sectors with accurate, realistic financial ratios.

---

## 🛠 Tech Stack

* **Backend Framework**: Node.js & Express.js (configured for Vercel Serverless Functions)
* **Database & ORM**: PostgreSQL (Supabase) & Sequelize ORM
* **Security & Auth**: `bcrypt` (10 rounds password hashing), `jsonwebtoken` (JWT), and SHA-256 (Crypto-based API Key hashing)
* **Frontend**: Vanilla HTML5/JS and Tailwind CSS (CDN)
* **Hosting Platforms**: Vercel (Functions & Static Assets hosting) & Supabase (Managed Postgres Database)

---

## 📁 Directory Structure

```
UCP2/
├── .env                  # Local and production environment configurations
├── vercel.json           # Vercel deployment routing and configuration
├── package.json          # Dependency definition and script triggers
├── README.md             # Project setup guide (this file)
├── REPORT.md             # Project design report (ERD, Use Case, Flow Diagrams)
├── api/
│   └── index.js          # Express app entrypoint & serverless handler
├── config/
│   ├── config.js         # Environment-based database configurations
│   └── db.js             # Lazy DB sync & verification connection pool
├── middleware/
│   └── auth.js           # JWT & X-API-KEY verification middleware
├── models/
│   ├── index.js          # Sequelize model bootstrap
│   ├── user.js           # Developer account model
│   ├── apiKey.js         # API Key model (stores hash, key hint)
│   ├── apiMetric.js      # API endpoint usage analytics log model
│   ├── stockSector.js    # Stock sector category model
│   └── financialAsset.js # Detailed stock fundamental ratios model
├── controller/
│   ├── authController.js # Signup / signin controller logic
│   ├── keyController.js  # Key generation & usage list logic
│   └── stockController.js# Public stock listings & ticker detail logic
├── routes/
│   ├── api.js            # Unified API master router
│   ├── authRoutes.js     # Auth API routes
│   ├── keyRoutes.js      # Key management routes
│   └── stockRoutes.js    # Stock metrics & data routes
├── seed/
│   ├── init.sql          # Raw SQL schema & stock insertions for Supabase
│   └── seedData.js       # Node Sequelize database seeder script
└── public/
    └── index.html        # Single-Page Developer Portal Interface
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **PostgreSQL** installed locally.

### 2. Configure Environment Variables
Create or edit your local `.env` file in the root of the project:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=idx_saas
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DIALECT=postgres

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=1d

# Local connection string template
POSTGRES_URL=postgresql://postgres:your_postgres_password@127.0.0.1:5432/idx_saas
```

### 3. Install Dependencies
Navigate into the `UCP2` directory and install required packages:
```bash
npm install
```

### 4. Create local database and Seed Data
Create a PostgreSQL database named `idx_saas` locally. Then, populate it with sectors and 50 stock records by running:
```bash
npm run seed
```

### 5. Start Server Locally
Run the Node Express server in development watch mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the **Developer Portal**.

---

## 🌐 Deploy to Vercel and Supabase (Production)

### Part A: Database Setup (Supabase)
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** tab in your Supabase project dashboard.
3. Paste the contents of `seed/init.sql` into the editor and click **Run**.
4. This creates all 5 tables with proper indexes and seeds them with 8 sectors and 50 stock fundamentals.

### Part B: Deploy to Vercel
1. Install the Vercel CLI (`npm install -g vercel`) or deploy via the Vercel Git Integration.
2. In your terminal, navigate to the `UCP2` directory and run:
   ```bash
   vercel
   ```
3. Set the following **Environment Variables** when prompted (or via the Vercel Dashboard -> Project Settings):
   * `NODE_ENV`: `production`
   * `JWT_SECRET`: A long random secret key.
   * `POSTGRES_URL`: Copy the **Transaction Connection String** from Supabase (Dashboard -> Settings -> Database -> Connection string -> URI). Replace the placeholder password with your database password.
4. Complete the deployment by running:
   ```bash
   vercel --prod
   ```
5. Your API and Developer Dashboard are now live!

---

## 🔌 API Endpoints Summary

### Developer Portal Routes (JWT Protected)

| Method | Endpoint | Headers | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | None | Registers a developer account |
| **POST** | `/api/auth/login` | None | Authenticates developer & returns JWT |
| **POST** | `/api/keys/generate` | `Authorization: Bearer <JWT>` | Generates a new API Key (returned once) |
| **GET** | `/api/keys` | `Authorization: Bearer <JWT>` | Lists developer's generated API Keys & request count |

### Public Data Routes (API Key Protected)

| Method | Endpoint | Headers | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/stocks` | `X-API-KEY: <key>` | Lists stocks. Supports filtering/sorting/pagination. |
| **GET** | `/api/v1/stocks/:ticker` | `X-API-KEY: <key>` | Retrieves details of a specific stock ticker |

#### Query Parameters for `GET /api/v1/stocks`:
* `sector` (string or integer): Filter by sector name (e.g. `Financials`) or ID (e.g. `1`).
* `limit` (integer): Limit results returned (Default `50`, Max `100`).
* `sort_by` (string): Fields to sort by (`ticker`, `company_name`, `market_cap`, `last_price`, `per`, `pbv`, `dividend_yield`, `roe`, `debt_to_equity`, `revenue_growth`).
* `order` (string): Sort order (`ASC` or `DESC`).
