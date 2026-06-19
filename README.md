# Vendly Backend

This repository contains the backend API for Vendly. It's a Node.js + Express application using MongoDB (Mongoose) and several services (Redis, Upstash, SendGrid, Cloudinary, Bull queues) to support authentication, payments, bundles, orders, commissions, payouts, and store configuration.

## Features
- Modular route structure (modules/): Auth, Users, Payments, Bundle, Transaction, Commission, Payout, Delivery, Store, TrackOrder, ResellerBundlesPrice
- Express-based API mounted under /api/v1
- MongoDB via Mongoose
- Background jobs and queues (Bull)
- Email (SendGrid / Nodemailer) and scheduled jobs
- File uploads (multer) and Cloudinary integration
- Rate limiting, CORS, and error middleware

## Quickstart

### Docker (docker-compose)
Use docker-compose.yml for an easy setup:

1. Ensure Docker and Docker Compose are installed.
2. From repo root run: docker-compose up --build

This will start the app plus services (MongoDB, Redis, etc.) defined in docker-compose. For containerless setup, follow the steps below.
1. Install dependencies
   npm install

2. Create environment file
   Copy ENVEXAMPLE to a local env file matching your NODE_ENV. Example:
   .env.development.local

3. Important environment variables
   The app loads env from config/env.js. Key variables (see ENVEXAMPLE):
   - PORT - server port
   - DB_URI - MongoDB connection string
   - JWT_SECRET, JWT_EXPIRES_IN - auth
   - SENDGRID_API_KEY, EMAIL_FROM
   - REDIS_HOST, REDIS_PORT, REDIS_PASSWORD (or UPSTASH keys)
   - CLOUDINARY_* - Cloudinary credentials
   - PAYSTACK_SECRET_KEY - payment provider
   - ARCJET_KEY / ARCJET_ENV - optional observability

4. Run the app
   - Development (hot reload): npm run dev
   - Production: npm start

5. Seed database (example data)
   npm run seed

## Project structure (important files)
- app.js — main Express app and route registration
- config/env.js — environment loader and exported env variables
- database/mongodb.js — MongoDB connection (mongoose)
- modules/* — feature modules (each contains route, controllers, services, models for that domain)
- models/ — shared/global Mongoose models
- services/ — business logic and integrations
- queues/ — job processors / Bull queues
- scripts/seedDB.js — database seeding script
- middlewares/ — express middlewares (error handler, etc.)
- utils/ — helper utilities

## Routes overview
Routes are mounted under /api/v1. Key routes include:
- /api/v1/auth — authentication (login, refresh tokens, signup)
- /api/v1/users — user management
- /api/v1/payments — payment initiation, webhooks
- /api/v1/bundles — bundle CRUD and pricing
- /api/v1/order — order tracking and creation
- /api/v1/commissions — commission calculations and payouts
- /api/v1/transaction — transaction history
- /api/v1/payout — payout processing
- /api/v1/resellerBundlePrice — reseller pricing
- /api/v1/delivery — delivery/tracking
- /api/v1/store-config — store configuration

## Dependencies (high level)
See package.json for complete list. Notable packages:
- express, mongoose, mongodb
- bcrypt / bcryptjs, jsonwebtoken
- bull, redis, @upstash/redis
- dotenv, cors, cookie-parser, multer
- nodemailer, @sendgrid/mail, cloudinary

## Configuration & Deployment Notes
- Ensure the correct env file is present: config/env.js expects `.env.${NODE_ENV || 'development'}.local`.
- CORS is preconfigured in app.js with an allowed origins list — update as needed.
- For production, ensure secure credentials for MongoDB, Redis (or Upstash), Cloudinary and SendGrid.
- If running background jobs, ensure Redis is reachable and Bull workers/processors are started.

## Contributing
- Follow existing code patterns inside modules/
- Run linting if configured and tests (no tests present by default)
- Open PRs for fixes or feature additions

## License
- Package.json lists ISC license. Adjust as needed.


If you want, create a more detailed README with API examples, endpoint details, and environment samples — say which modules/endpoints you want documented first.
