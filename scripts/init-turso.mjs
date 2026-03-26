import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN

if (!url || !token) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({ url, authToken: token })

const sql = `
CREATE TABLE IF NOT EXISTS "Loan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partName" TEXT NOT NULL,
    "model" TEXT,
    "brand" TEXT,
    "fromStore" TEXT NOT NULL,
    "toStore" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "loanDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedReturn" DATETIME NOT NULL,
    "returnDate" DATETIME
);

CREATE TABLE IF NOT EXISTS "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "storeId" INTEGER
);

CREATE TABLE IF NOT EXISTS "Store" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo" TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS "Employee_name_key" ON "Employee"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Store_name_key" ON "Store"("name");
`

async function main() {
  console.log('Pushing schema to Turso...')
  const statements = sql.split(';').filter(s => s.trim() !== '')
  for (const s of statements) {
    console.log('Executing:', s.trim())
    await client.execute(s)
  }
  console.log('Schema pushed successfully!')
}

main().catch(err => {
  console.error('Error pushing schema:', err)
  process.exit(1)
})
