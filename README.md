# Gift Hub World — Luxury Floral Boutique & Indian Bakery Cake Atelier

Gift Hub World is a full-stack luxury e-commerce web application featuring handcrafted flower bouquets, bespoke floral atelier, and an authentic 30-flavour Indian bakery cake patisserie.

---

## 🔒 Security & Secret Safety Architecture

This application strictly complies with modern security and secret isolation standards:

### 1. Zero Hardcoded Secrets
- No private API keys, database connection URIs, passwords, or secret tokens are hardcoded into the source code, components, or client assets.
- Server-side secrets (such as `GEMINI_API_KEY`) remain strictly on the backend Node.js / Express server (`server.ts`) and are never bundled into client JavaScript.
- All client-side configuration parameters (such as Firebase Web identifiers) use public-facing project identifiers protected by strict cloud database rules.

### 2. Database Row-Level Security (RLS)
- Firestore database access is governed by production-grade security rules (`firestore.rules`):
  - **Default Deny**: All unmapped paths are closed by default (`allow read, write: if false`).
  - **User Isolation**: User cart items and wishlists can only be read or written by the authenticated owner (`request.auth.uid == userId`).
  - **Order Integrity**: Customer orders can only be created by the authenticated owner, and orders can only be accessed by the order creator or verified boutique administrators.
  - **Catalog Protection**: Product creation, modification, and deletion are strictly restricted to verified administrators (`isAdmin()`).

### 3. Frontend Exposure Protection
- Vite only bundles variables prefixed with `VITE_` into client-side code.
- No sensitive keys, private certificates, or server tokens use the `VITE_` prefix.

### 4. Logging & Error Sanitization
- API routes sanitize internal exceptions before returning responses to client applications, preventing internal stack traces or database error leaks.
- Client error handlers mask user email addresses and sensitive data before logging warnings.

---

> ### ⚠️ CRITICAL: Git History Secret Rotation Warning
> If any secret, token, password, or API key was ever previously hardcoded or committed to version control in earlier commits:
> **Rotate all previously hardcoded secrets immediately.**
> Commits stored in git history remain retrievable even if deleted in subsequent commits.
> Always generate new keys in the respective provider consoles (Google Cloud, Firebase, Stripe, etc.) before public deployment.

---

## 🛠️ Environment Configuration

Copy the `.env.example` template to `.env`:

```bash
cp .env.example .env
```

Ensure `.env` contains your runtime credentials:

```bash
# Server-side secrets (Never exposed to client)
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Optional client-side public overrides
VITE_FIREBASE_API_KEY="your-firebase-web-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_FIRESTORE_DATABASE_ID="your-firestore-database-id"
```

Verify that `.env` is listed in `.gitignore` (already configured).

---

## 🚀 Building & Running

### Development
```bash
npm install
npm run dev
```

### Production Build & Launch
```bash
npm run build
npm start
```
