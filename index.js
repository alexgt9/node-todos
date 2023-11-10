import express  from 'express';
import path  from 'path';
import cors  from 'cors';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import swaggerJsdoc  from "swagger-jsdoc";
import swaggerUi  from "swagger-ui-express";

const PORT = process.env.PORT || 5010;
const publicUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${ PORT }`;

import repositoryMemory from './todoRepositoryMemory.js';
import repositoryPsql from './todoRepositoryPSQL.js';

const repository = process.env.USE_DATABASE ? repositoryPsql : repositoryMemory;

repository.initializeDatabase();

const app = express()
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(function(_req, res, next) {
    res.setHeader('x-data-source', process.env.USE_DATABASE ? 'psql' : 'memory')
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
    *             $ref: '#/components/schemas/Todo'
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
          res.status(404).json({ "error": 'Todo not found'});

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
          res.status(404).json({ "error": 'Todo not found'});

          return;
      }

      res.status(204).json({});
  })

// Swagger
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Simple todos API",
        version: "0.1.0",
        description: "This is a simple CRUD API to manage todos.  The user 'aleh' contains some examples. The information stored in this API is not persistent. It will be deleted from time to time.",
      },
      servers: [
        {
          url: publicUrl,
        },
      ],
    },
    apis: ["./index.js", "./swagger.js"],
  };
  
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);
  
app.listen(PORT, () => {
    console.log(`Api docs on ${ publicUrl }/api-docs`);
    console.log(`Listening on ${ publicUrl }`);
});