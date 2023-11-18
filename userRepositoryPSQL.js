import pg from 'pg';
import uuid from 'uuid';
import userMemoryRepository from './userRepositoryMemory.js';

const pool =  new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

const getUsers = async (author) => {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
};

const getUserByUsername = async (username) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};

const createUser = async (user, id = null) => {
  const res = await pool.query(
    'INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *', 
    [id ?? uuid.v4(), user.username, user.password]
  );
  return res.rows[0];
};

const deleteUser = async (username) => {
  const res = await pool.query('DELETE FROM users WHERE username = $1', [username]);

  return res.rowCount;
};

const initializeDatabase = async () => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid NOT NULL,
    "username" varchar NOT NULL,
    "password" varchar NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
)
  `);

  const existinguser = await getUserByUsername("aleh")
  if(existinguser) {
    return
  }

  console.log("Creating default users")

  const defaultusers = await userMemoryRepository.getUsers("aleh");
  defaultusers.forEach(async (user) => {
    await createUser(
      user,
      user.id
    );
  });
};

export default {
  getUsers,
  createUser,
  deleteUser,
  initializeDatabase
}
  