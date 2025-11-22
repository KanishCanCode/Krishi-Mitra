import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;   // 👈 THIS FIXES YOUR IMPORT ERROR
=======

const prisma = new PrismaClient();

export default prisma;
>>>>>>> e8c39978d34f0dab72e72cd07075c58d0c37de54
