# PostgreSQL QA, Refactor & Verification Report

This report covers a full QA pass over an already-migrated MySQL → PostgreSQL
codebase. No second migration was performed. The goal of this pass was to
make the application **100% PostgreSQL-native** (no MySQL-compatibility
shim), review the schema/security/transactions/models/controllers, fix real
bugs found along the way, and document what remains.

No API endpoint URLs, folder structure, or frontend behavior were changed.

---

## 1. Files Reviewed

Every file in the repository (110 files, excluding `node_modules`/`.git`)
was inspected. The ones relevant to this QA pass:

**Server core**
`server/app.js`, `server/config/database.js`

**Models**
`authModel.js`, `categoryModel.js`, `productModel.js`, `vendorModel.js`,
`userModel.js`, `roleModel.js`

**Controllers**
`authController.js`, `categoryController.js`, `productController.js`,
`vendorController.js`, `adminController.js`

**Middleware**
`authMiddleware.js`, `roleMiddleware.js`, `uploadMiddleware.js`

**Routes**
`authRoutes.js`, `categoryRoutes.js`, `productRoutes.js`, `vendorRoutes.js`,
`dashboardRoutes.js`, `adminRoutes.js`

**Validations**
`authValidation.js`, `categoryValidation.js`, `productValidation.js`,
`vendorValidation.js`

**Utilities**
`jwt.js`, `mailService.js`

**Database**
`schema_postgresql.sql`, `seed_postgresql.sql`, `schema.sql` (legacy),
`seed.sql` (legacy)

**Scripts / one-offs**
`createAdmin.js`, `test-db.js`, all 11 files in `script/`

**Package files**
`package.json`, `package-lock.json`

---

## 2. Dependency Audit (Step 2)

- ✅ No `mysql`, `mysql2`, or `mysql2/promise` in `package.json`,
  `package-lock.json`, or `node_modules`.
- ✅ Only `pg` (`^8.22.0`) is used for database access anywhere in the
  codebase.
- The only remaining occurrences of the word "mysql" anywhere in `.js`
  files are explanatory **comments** describing what changed and why
  (e.g. in `server/config/database.js`) — there is no executable MySQL
  code left.

---

## 3. The Compatibility Layer Has Been Removed (Steps 6–7)

The previous migration pass introduced a shim in `server/config/database.js`
that auto-converted `?` → `$1,$2,...` and emulated mysql2's `insertId` /
`affectedRows` on top of `pg`, so every model could be ported as a
drop-in swap without being rewritten.

That shim has now been **fully removed**. `server/config/database.js`
exports a plain `pg.Pool`. Every model and controller was rewritten to use
native PostgreSQL syntax directly:

| Before (shim) | After (native) |
|---|---|
| `?` placeholders | `$1, $2, $3, ...` |
| auto-injected `RETURNING <pk>` | explicit `RETURNING *` / `RETURNING <pk>` in the SQL itself |
| `result.insertId` | `result.rows[0].<column>` (returned directly from the model) |
| `result.affectedRows` | `result.rowCount` (returned directly from the model) |
| `const [rows] = await db.query(...)` | `const result = await pool.query(...); result.rows` |

**Files rewritten to native syntax:** `authModel.js`, `categoryModel.js`,
`productModel.js`, `vendorModel.js`, `userModel.js`, `authController.js`,
`categoryController.js`, `productController.js`, `vendorController.js`.

This was verified with a mocked `pg.Pool` exercising every model function —
all placeholder ordering, `RETURNING`-based id extraction, and `rowCount`
handling behave correctly.

### Critical bug found and fixed during this pass

`server/app.js`, `createAdmin.js`, and **7 files in `script/`**
(`check-db.js`, `check-users.js`, `datadir.js`, `db-info.js`,
`transaction.js`, `verify-password.js`, `whoami.js`) all did:

```js
const [rows] = await db.query(...)   // or db.execute(...)
```

This worked under the old shim (which returned a `[rows, fields]` tuple to
mimic mysql2), but **native `pg.Pool.query()` returns a single object**
(`{rows, rowCount, fields, ...}`), not an iterable tuple. With the shim
removed, every one of these lines would have thrown
`TypeError: result is not iterable` the moment it ran. All 9 files were
fixed to use `const result = await pool.query(...); result.rows`.

---

## 4. Query Review (Steps 4–5)

Searched the entire codebase for every MySQL-only construct:
`?` placeholders, `AUTO_INCREMENT`, `LAST_INSERT_ID()`, `IFNULL()`,
`UNSIGNED`, `ENGINE=`, `CHARSET=`, `COLLATE=`, backticks,
`ON UPDATE CURRENT_TIMESTAMP`, `LIMIT ?,?`, `SHOW TABLES`/`DATABASES`,
`DESCRIBE`, `GROUP_CONCAT`, `FIND_IN_SET`.

**Result: none found in any executable code path.** The only matches
anywhere are:
- Comments describing the conversion (e.g. `-- AUTO_INCREMENT -> GENERATED
  ALWAYS AS IDENTITY` in `schema_postgresql.sql`)
- The **original** `database/schema.sql` and `database/seed.sql` — these
  are intentionally kept as historical/reference artifacts. They are never
  read by any running code (the app only ever uses
  `schema_postgresql.sql` / `seed_postgresql.sql`); `README.md` documents
  them as MySQL reference files.

All queries now use: `RETURNING`, `CURRENT_TIMESTAMP` (in place of
`NOW()`), `COALESCE` where applicable, native PostgreSQL `ENUM` types,
`BOOLEAN`, `TEXT`, and `ILIKE` for the one case-insensitive lookup
(`categoryModel.findCategoryByName` — see §9).

No use case in this app needs `JSONB` (no semi-structured/document data
anywhere in the schema), so none was added — adding it speculatively would
be scope creep with no query to back it.

---

## 5. Database Review (Step 3) — `schema_postgresql.sql`

| Item | Status |
|---|---|
| Primary keys | ✅ Every table uses `GENERATED ALWAYS AS IDENTITY` |
| Foreign keys | ✅ `users.role_id → roles`, `products.vendor_id → users`, `products.category_id → categories`, `notifications.user_id → users` |
| Unique constraints | ✅ `users.email`, `roles.role_name`, `categories.category_name` |
| Cascade rules | `products.vendor_id` and `notifications.user_id` are `ON DELETE CASCADE` (deleting a user cleans up their products/notifications); `products.category_id` has no cascade by design — a category with products can't be deleted until they're moved (see §9 for the friendly error this now produces) |
| Check constraints | **Added** in this pass: `price >= 0`, `quantity >= 0` on `products` (previously unconstrained — nothing stopped a negative price/quantity from being written) |
| Triggers | ✅ `set_updated_at()` trigger on `users` and `products`, replacing MySQL's `ON UPDATE CURRENT_TIMESTAMP` |
| Default values | ✅ present on all status/timestamp columns |
| Identity columns | ✅ `GENERATED ALWAYS AS IDENTITY` throughout |
| Indexes | ✅ FK columns, status columns, **plus two added in this pass**: a composite `(approval_status, product_status)` index matching the exact WHERE clause `productModel.getAllProducts()`/`getPublicProducts()` use for customers, and a partial index on `users.reset_token WHERE reset_token IS NOT NULL` matching `authModel.findUserByResetToken()`'s access pattern |

A retrofit snippet (`ALTER TABLE ... ADD CONSTRAINT`/`CREATE INDEX`) was
added at the bottom of `schema_postgresql.sql` for anyone who already
deployed the schema before these additions, since `CREATE TABLE IF NOT
EXISTS` is a no-op against an existing table.

`seed_postgresql.sql` was re-checked against the updated schema — no
changes were needed (it doesn't touch price/quantity edge cases).

---

## 6. Transactions (Step 8)

**Finding: there were no transactions anywhere in the application before
this pass.** Every multi-statement operation ran as separate,
non-transactional queries. The clearest risk was the approve/reject flows,
which do a status **update** followed by a notification **insert** — if the
second query failed after the first succeeded, a product/vendor would end
up approved with no notification ever sent, and no way to know it happened.

**Fixed.** Added `pool.withTransaction(callback)` in
`server/config/database.js`:

```js
await pool.withTransaction(async (client) => {
  await productModel.approveProduct(id, client);
  await authModel.createNotification(vendorId, title, msg, client);
});
```

- Acquires a dedicated client via `pool.connect()`
- `BEGIN` → runs the callback → `COMMIT` on success, `ROLLBACK` on any
  thrown error
- `client.release()` always runs (`finally` block), even on error
- Verified against a mocked pool: `BEGIN`/`COMMIT`/`ROLLBACK`/`release`
  fire in the correct order for both the success and failure paths

Wired into `productController.approveProduct`, `productController.rejectProduct`,
and `vendorController.approveVendor`. Model functions
(`productModel.approveProduct/rejectProduct/getProductById`,
`vendorModel.approveVendor`, `authModel.createNotification`) now accept an
optional `client` parameter (defaulting to the shared `pool`), so they work
identically whether called standalone or from inside a transaction — this
required no changes to any other call site.

`rejectVendor` and `suspendVendor` were left as single-statement operations
(no notification is sent for those, so there's nothing to make atomic).

---

## 7. Security Review (Step 9)

| Area | Finding |
|---|---|
| SQL injection | ✅ Every query uses parameterized `$1,$2,...` placeholders. Grepped the entire codebase for string concatenation or template-literal interpolation of variables into SQL text — none found. The one place SQL is built conditionally (`productModel.getAllProducts`'s role-based `WHERE` clause) only branches between two **hardcoded** strings based on `role_id`; no user input is ever interpolated. |
| Password hashing | ✅ `bcrypt` with 10 salt rounds, used consistently for registration and password reset |
| JWT | ✅ signed with `process.env.JWT_SECRET`, verified via `authMiddleware.js`, role-gated via `roleMiddleware.js` |
| Input validation | ⚠️ **Found and fixed**: `server/validations/productValidation.js` had **no `module.exports`** at all — its `validateProduct` function was completely unreachable dead code. `productController.createProduct`/`updateProduct` had **zero server-side validation** (no check that `product_name`, `price`, `quantity`, `sku`, or `category_id` were valid before hitting the database). Fixed: exported `validateProduct` and wired it into both `createProduct` and `updateProduct`. |
| Validation bug | While fixing the above, found `!data.quantity` and `!data.price` treated a legitimate value of `0` as "missing" (0 is falsy in JS) — meaning a vendor could never set a product's stock to 0 or price to 0 once this validation was wired up. Fixed to explicit `undefined`/`null`/`""` checks, and aligned the price rule with the new `price >= 0` database constraint (was previously `> 0`, incorrectly rejecting free/zero-priced items). |
| File upload | ⚠️ **Found and fixed**: `uploadMiddleware.js` validated the client-supplied `mimetype` (spoofable) but then saved the file using the extension from the **user-controlled original filename** — an attacker could send an allowed `Content-Type` header alongside a filename like `payload.php` and have it saved with a `.php` extension. Fixed: the saved extension is now derived from a fixed `mimetype → extension` map, ignoring the original filename entirely. |
| Race conditions | Registration and category-creation both do a "check it doesn't exist" read followed by an insert — two concurrent requests for the same email/category name could both pass the pre-check before either insert commits. Added `23505` (unique-violation) handling in `authController.register`, `categoryController.createCategory`, and `categoryController.updateCategory` as a defense-in-depth safety net, so this now returns a clean `400`/`409` instead of an unhandled `500`. |
| FK violations | Deleting a category that still has products threw an unhandled `500`. Added `23503` handling in `categoryController.deleteCategory` for a proper `409` with a clear message. |
| Authorization | ✅ `roleMiddleware.js`'s `authorize(...roles)` correctly gates admin-only routes (product approve/reject/delete, vendor approve/reject/suspend) |
| Secrets | `.env` is correctly excluded via `.gitignore`. `JWT_SECRET` and DB credentials are read from environment variables, never hardcoded. |

---

## 8. Model & Controller Review (Steps 10–11)

- **CRUD**: Verified for Users (auth), Categories, Products, Vendors —
  all Create/Read/Update/Delete paths exist and now use consistent native
  return shapes (`rows[0]` for single-row reads/creates, `rowCount` for
  writes).
- **Pagination**: **None exists anywhere** in the app —
  `getAllProducts`, `getAllCategories`, and `getAllVendors` all return the
  full result set with no `LIMIT`/`OFFSET`. This is a pre-existing
  characteristic of the app, not something introduced by the migration.
  Not changed in this pass, since adding pagination would change the API
  response shape (frontend currently expects a full array in `data`) —
  that's a feature change outside a QA/migration scope. Flagged as a
  recommendation in §12.
- **Sorting**: present and sensible (`ORDER BY category_name ASC`,
  `ORDER BY product_id DESC`, `ORDER BY created_at DESC`).
- **Filtering**: `productModel.getAllProducts(role_id)` correctly filters
  to `Approved` + `Available` products for customers only; admins/vendors
  see everything.
- **Search**: no server-side search/filter endpoint exists for
  products/categories — the client-side pages (`admin/products.html` etc.)
  filter client-side over the full result set. Consistent with the "no
  pagination" finding above; same recommendation applies.
- **Relationships**: all `JOIN`s reviewed — `products ⋈ categories ⋈
  users` via `INNER JOIN` is correct (a product always has a valid
  category and vendor per the FK constraints, so `INNER JOIN` won't
  silently drop rows).
- **Error handling**: every controller function has a `try/catch` with a
  proper HTTP status code (`400` validation, `401`/`403` auth, `404` not
  found, `409` conflict, `500` unexpected). The `409` conflict responses
  for unique/FK violations were added in this pass (§7).
- **Code quality**: hoisted duplicate inline `require("../models/authModel")`
  calls inside `productController` (2 places) and `vendorController`
  (1 place) up to top-level imports — Node caches modules either way, so
  this is a pure readability fix with no behavior change.

---

## 9. Notable Non-Breaking Behavior Change

`categoryModel.findCategoryByName` was changed from `WHERE category_name =
$1` to `WHERE category_name ILIKE $1`. This is a **deliberate correctness
fix**, not a redesign: MySQL's default collation (`utf8_general_ci`) makes
`VARCHAR` comparisons case-insensitive, so the original MySQL schema
already treated "Electronics" and "electronics" as duplicates. PostgreSQL's
`=` is case-sensitive by default, so without this change the duplicate-name
check would have silently gotten *stricter* than the original MySQL
behavior after the migration (allowing accidental near-duplicate
categories). `ILIKE` with a parameterized value restores the original
case-insensitive semantics safely (no injection risk, no wildcard
characters involved).

---

## 10. Routes & Uploads (Steps 12–13)

- **Routes**: every endpoint URL in `authRoutes.js`, `categoryRoutes.js`,
  `productRoutes.js`, `vendorRoutes.js` was diffed against the pre-QA
  state — **zero URLs changed**. Only the controllers behind them were
  refactored.
- **Uploads**: `POST /api/products` and `PUT /api/products/:id` with a
  file still flow through `uploadMiddleware.js` → `req.file.filename` →
  stored in `products.image` → served statically at `/uploads/<filename>`
  via `express.static(path.join(__dirname, "uploads"))` in `app.js`. This
  path was not changed. The only change was *which* extension gets
  appended to the generated filename (§7).

---

## 11. Reports & Aggregates (Step 14)

`vendorModel.getVendorStats()` uses `COUNT(*) FILTER (WHERE ...)` with
explicit `::int` casts — this was already fixed in the original migration
pass (MySQL's `SUM(boolean_expression)` has no PostgreSQL equivalent) and
was re-verified here. The `::int` casts matter because `node-postgres`
returns `COUNT`/`BIGINT` aggregates as **strings** by default (JS numbers
can't safely represent the full `BIGINT` range) — without the cast, the
JSON response would return `"3"` instead of `3` for every stat.

`admin/reports.js` (client-side) builds its charts from `GROUP BY`-free
client-side aggregation over `/api/products`, `/api/categories`, and
`/api/vendors/stats` — reviewed, no server-side `GROUP BY`/`AVG`/`DISTINCT`
queries exist elsewhere in the app to check.

---

## 12. Performance (Step 15)

- Indexes added: see §5.
- No N+1 query patterns found — every model function issues exactly one
  query per call; the products listing does its category/vendor lookups
  via `JOIN`, not per-row queries.
- **Recommendation (not implemented — would change API shape)**: add
  `LIMIT`/`OFFSET` pagination to `getAllProducts`, `getAllVendors`, and
  `getAllCategories` once the dataset grows past a few hundred rows. Right
  now every list endpoint returns its full table on every request.

---

## 13. Dead Code Found (Step 16)

None of these were removed — deleting files/routes wasn't asked for and
carries its own risk of "removing a feature" someone intended to finish.
Documented here instead so the decision is explicit:

| File | Status |
|---|---|
| `server/models/userModel.js` | Fully rewritten to native syntax for consistency, but **not required anywhere** — no controller imports it. `authModel.js` duplicates its user-lookup functionality and is what's actually used. |
| `server/models/roleModel.js` | Empty file (0 bytes), never required. |
| `server/controllers/adminController.js` | Empty file (0 bytes), never required — `adminRoutes.js` defines its one route handler inline instead. |
| `server/routes/dashboardRoutes.js`, `server/routes/adminRoutes.js` | Both fully written but **never mounted** in `app.js` (only `/api/auth`, `/api/categories`, `/api/products`, `/api/vendors` are mounted). `GET /api/dashboard` and `GET /api/admin/overview` do not currently exist despite these files being present. No frontend code calls them. |
| `server/utils/jwt.js` | `generateToken()` is fully written but unused — `authController.js` signs its own JWTs inline instead, duplicating the same logic. |
| `server/validations/vendorValidation.js` | `validateVendor()` has no `module.exports` and no controller path currently accepts arbitrary vendor-detail updates (vendor registration is validated via `authValidation.js` instead), so there's no gap to close here the way there was for `productValidation.js`. |
| `server/validations/productValidation.js`'s `validateCategory` | An orphaned duplicate of the properly-used `validateCategory` in `categoryValidation.js`. Left unexported/unused since `categoryController.js` already correctly uses the real one. |

**Recommendation**: either wire these up (mount the routes, use
`userModel`/`jwt.js` where they overlap with `authModel`/inline signing) or
delete them in a future cleanup pass — right now they're inert.

---

## 14. Testing (Step 17)

No live PostgreSQL instance or internet access was available in this
sandbox, so full end-to-end testing against a real database could not be
run. What **was** verified:

- `node --check` passes on every file touched in this pass.
- The real Express app boots cleanly, loads all 4 route groups, and starts
  listening.
- `GET /health` → `500` with proper JSON when DB is unreachable (no
  crash, no unhandled rejection).
- `GET /api/categories` (no token) → `401` (auth middleware fires before
  any DB call).
- `GET /api/products/public` (no token needed) → `500` when DB is
  unreachable (reaches the DB layer correctly, fails gracefully).
- `POST /api/auth/register` with an empty body → `400` with a specific
  validation message (`"Role is required."`).
- `GET /api/nonexistent` → `404`.
- Every model function (`authModel`, `categoryModel`, `productModel`,
  `vendorModel`, `userModel`) was exercised against a mocked `pg.Pool` and
  confirmed to produce correct SQL text, correctly-ordered `$n` parameters,
  and correct `insertId`/`rowCount`-equivalent return values.
- `pool.withTransaction()` was exercised against a mocked pool for both
  the success path (`BEGIN`→query→`COMMIT`→`release`) and the failure path
  (`BEGIN`→query→`ROLLBACK`→`release`, error re-thrown).
- `validateProduct()` was tested against valid input, zero-quantity,
  zero-price, negative-price, and missing-name cases.

**Not verified against a real database in this session** (recommended
before production deploy): full registration → login → forgot-password →
reset-password → email-verification flow with real bcrypt/JWT round-trips
against live Postgres rows; category/product/vendor CRUD against a live
DB including the new `CHECK`/`UNIQUE`/FK constraint violations; actual
image upload + static file retrieval; the reports dashboard against real
aggregate data.

---

## 15. Deployment Compatibility (Step 18)

The connection setup in `server/config/database.js` uses a standard
`pg.Pool` with discrete `host`/`port`/`user`/`password`/`database` fields
read from environment variables — this pattern works unchanged across:

- **Local PostgreSQL** — as configured today (`ssl: false`)
- **Supabase / Render / Railway** — these typically provide a full
  `DATABASE_URL` connection string with SSL required. The current config
  does **not** read `DATABASE_URL` or enable SSL, which will need a small
  addition (not made in this pass, since it would require deciding on a
  new env var and isn't something to guess at silently):
  ```js
  const pool = new Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
      : { host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, ssl: false }
  );
  ```
- **Docker** — no changes needed beyond passing the same env vars into the
  container; `server/uploads` should be mounted as a volume if uploads
  need to persist across container restarts (not currently configured
  either way).

---

## Summary

| | |
|---|---|
| ✔ Files reviewed | 110 (all non-`node_modules`/`.git` files) |
| ✔ Files modified | 20 — `server/config/database.js`, 5 models, 4 controllers, `server/app.js`, `uploadMiddleware.js`, `productValidation.js`, `createAdmin.js`, 7 files in `script/`, `schema_postgresql.sql` |
| ✔ Critical bugs fixed | 1 — array-destructuring of native `pg` results in 9 files, which would have crashed on first use |
| ✔ Security issues fixed | 3 — dead product validation (zero server-side validation on products), upload extension trusted from user input, unhandled unique/FK constraint violations |
| ✔ Data-integrity issues fixed | 2 — `price`/`quantity` falsy-zero validation bug, missing `CHECK` constraints |
| ✔ Reliability issues fixed | 1 — no transactions anywhere; added transactional approve/reject + notify |
| ✔ Compatibility layer | Fully removed — 100% native `pg` syntax throughout |
| Remaining issues | No pagination on list endpoints (pre-existing, not fixed — would change API shape); several dead/unmounted files documented in §13 but not removed; SSL/`DATABASE_URL` support needed before deploying to Supabase/Render/Railway; full live-DB test pass still needed |
| **Migration score** | **9/10** — fully native, transactionally sound, and hardened; the one point held back is that none of this was verified against a real running PostgreSQL instance in this sandbox |
| **Production recommendation** | Run `schema_postgresql.sql` + `seed_postgresql.sql` against a real Postgres instance, execute the Step 17 manual test list end-to-end, add `DATABASE_URL`/SSL support for your hosting target, then ship. No known blocking issues. |
