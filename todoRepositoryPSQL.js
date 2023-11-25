import pg from 'pg';
import uuid from 'uuid';
import memoryRepository from './todoRepositoryMemory.js';

const pool =  new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

const getTodos = async (author) => {
  const res = await pool.query('SELECT * FROM todo WHERE author = $1', [author]);
  return res.rows;
};

const getTodoById = async (author, id) => {
  const res = await pool.query('SELECT * FROM todo WHERE id = $1 AND author = $2', [id, author]);
  return res.rows[0];
};

const createTodo = async (author, todo, id = null) => {
  const defaultTodo = {
    id: id ?? uuid.v4(),
    description: '',
    completed: false,
    tags: []
  };
  const todoToCreate = {
    ...defaultTodo,
    ...todo,
    author
  };
  const res = await pool.query(
    'INSERT INTO todo (id, text, description, completed, author, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
    [todoToCreate.id, todoToCreate.text, todoToCreate.description, todoToCreate.completed, todoToCreate.author, JSON.stringify(todoToCreate.tags)]
  );
  return res.rows[0];
};

const updateTodo = async (author, id, newTodo) => {
  const todoToUpdate = getTodoById(author, id)

  if (!todoToUpdate) {
      return null
  }

  const todo = {
    ...todoToUpdate,
    ...newTodo,
    id,
    author
  }

  const result = await pool.query(
      'UPDATE todo SET text = $1, description = $2, completed = $3, tags = $4 WHERE id = $5 AND author = $6 RETURNING *', 
      [todo.text, todo.description, todo.completed, JSON.stringify(todo.tags), todo.id, author]
  )

  if (result.rowCount === 0) {
      console.log("No rows updated")
      return null
  }

  return todo
};

const deleteTodo = async (author, id) => {
  const res = await pool.query('DELETE FROM todo WHERE author = $1 AND id = $2', [author, id]);

  return res.rowCount;
};

const initializeDatabase = async () => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS "todo" (
    "id" uuid NOT NULL,
    "text" varchar NOT NULL,
    "description" varchar NOT NULL DEFAULT ''::character varying,
    "completed" bool NOT NULL DEFAULT false,
    "author" varchar NOT NULL,
    "tags" json DEFAULT '[]'::json,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
)
  `);

  const existingTodo = await getTodoById("aleh", "911d7404-f927-46b8-bde9-759be745061d")
  if(existingTodo) {
    return
  }

  console.log("Creating default todos")

  const defaultTodos = await memoryRepository.getTodos("aleh");
  defaultTodos.forEach(async (todo) => {
    await createTodo(
      todo.author,
      todo,
      todo.id
    );
  });
};

export default {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  initializeDatabase
}
  