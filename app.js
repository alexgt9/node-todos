import express from 'express';
import path from 'path';
import cors from 'cors';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import morgan from 'morgan';

import { swaggerMiddleware } from './swagger.js';

import repositoryMemory from './todoRepositoryMemory.js';
import repositoryPsql from './todoRepositoryPSQL.js';

import userRepositoryMemory from './userRepositoryMemory.js';
import userRepositoryPsql from './userRepositoryPSQL.js';

const useDatabase = process.env.USE_DATABASE == '1';
const repository = useDatabase ? repositoryPsql : repositoryMemory;
const userRepository = useDatabase ? userRepositoryPsql : userRepositoryMemory;

if (useDatabase) {
  console.log("Using database");
  repository.initializeDatabase();
  userRepository.initializeDatabase();
}

const app = express()
  .use(morgan('short'))
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(function (_req, res, next) {
    res.setHeader('x-data-source', useDatabase ? 'psql' : 'memory')
    next();
  })
  .get('/', (req, res) => {
    res.redirect('/api-docs');
  })
  /**
    * @openapi
    * /users/{username}/todos:
    *   get:
    *     tags:
    *       - todos
    *     description: Get todos
    *     parameters:
    *      - $ref: '#/components/schemas/username'
    *     responses:
    *       200:
    *         description: Returns all todos.
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/Todo'
    */
  .get('/users/:username/todos', async (req, res) => {
    const username = req.params.username;
    const todos = await repository.getTodos(username)

    res.json(todos)
  })
  /**
    * @openapi
    * /users/{username}/todos:
    *   post:
    *     tags:
    *       - todos
    *     description: Create new Todo
    *     parameters:
    *      - $ref: '#/components/schemas/username'
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CreateTodoBody'
    *     responses:
    *       200:
    *         description: The just created Todo.
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Todo'
    */
  .post('/users/:username/todos', async (req, res) => {
    const username = req.params.username;

    if (!req.body.text) {
      res.status(400).json({ "error": 'Text is required' });

      return;
    }

    const newTodo = await repository.createTodo(username, req.body);

    res.json(newTodo);
  })
  /**
    * @openapi
    * /users/{username}/todos/{id}:
    *   patch:
    *     tags:
    *       - todos
    *     description: Create new Todo
    *     parameters:
    *      - $ref: '#/components/schemas/username'
    *      - $ref: '#/components/schemas/todoId'
    *     requestBody:
    *       required: false
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Todo'
    *     responses:
    *       200:
    *         description: The just updated Todo.
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Todo'
    */
  .patch('/users/:username/todos/:id', async (req, res) => {
    const username = req.params.username;
    const id = req.params.id;

    const updatedTodo = await repository.updateTodo(username, id, req.body);
    if (!updatedTodo) {
      res.status(404).json({ "error": 'Todo not found' });

      return;
    }

    res.json(updatedTodo);
  })
  /**
    * @openapi
    * /users/{username}/todos/{id}:
    *   delete:
    *     tags:
    *       - todos
    *     description: Delete Todo
    *     parameters:
    *      - $ref: '#/components/schemas/username'
    *      - $ref: '#/components/schemas/todoId'
    *     responses:
    *       204:
    *         description: Empty response.
    */
  .delete('/users/:username/todos/:id', async (req, res) => {
    const username = req.params.username;
    const id = req.params.id;

    const deletedTodo = await repository.deleteTodo(username, id);
    if (!deletedTodo) {
      res.status(404).json({ "error": 'Todo not found' });

      return;
    }

    res.status(204).json({});
  })
  /**
    * @openapi
    * /login:
    *   post:
    *     tags:
    *       - users
    *     description: Login
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/LoginBody'
    *     responses:
    *       200:
    *         description: Success if you are able to login.
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/User'
    *       401:
    *         description: Failure if login or password are wrong.
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/User'
    */
  .post('/login', async (req, res) => {
    const logged = await userRepository.login(req.body.username, req.body.password)

    if (!logged) {
      res.status(401).json({
        "success": false,
        "error": 'Login or password not correct'
      });

      return;
    }

    res.json({
      sucess: true
    })
  })
  /**
    * @openapi
    * /users:
    *   get:
    *     tags:
    *       - users
    *     description: Get users
    *     responses:
    *       200:
    *         description: Returns all users.
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/User'
    */
  .get('/users', async (_, res) => {
    const users = await userRepository.getUsers()

    res.json(users)
  })
  /**
    * @openapi
    * /users:
    *   post:
    *     tags:
    *       - users
    *     description: Create new User
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/User'
    *     responses:
    *       200:
    *         description: The just created User.
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/User'
    */
  .post('/users', async (req, res) => {
    const newUser = await userRepository.createUser(req.body);

    res.json(newUser);
  })
  /**
    * @openapi
    * /users/{username}:
    *   delete:
    *     tags:
    *       - users
    *     description: Delete User
    *     parameters:
    *      - $ref: '#/components/schemas/username'
    *     responses:
    *       204:
    *         description: Empty response.
    */
  .delete('/users/:username', async (req, res) => {
    const username = req.params.username;

    const deletedUser = await userRepository.deleteUser(username);
    if (!deletedUser) {
      res.status(404).json({ "error": 'User not found' });

      return;
    }

    res.status(204).json({});
  })


swaggerMiddleware(app);

export default app;