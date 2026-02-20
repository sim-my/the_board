import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { user as usersTable } from './db/schema';
  
const db = drizzle(process.env.DATABASE_URL!);
async function main() {
  const user = await db
    .select()
    .from(usersTable)

  console.log('User found:', user);
}

main();