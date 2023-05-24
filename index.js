const express = require('express');
const uuidv4 = require('uuid/v4');
const path = require('path');
var cors = require('cors');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PORT = process.env.PORT || 5010;
const publicUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${ PORT }`;

const todos = {};
todos['aleh'] = {};
todos['aleh']['911d7404-f927-46b8-bde9-759be745061d'] = {
    id: '911d7404-f927-46b8-bde9-759be745061d',
    text: 'Agarra la sombrilla',
    description: '',
    completed: false,
    author: 'aleh',
    tags: [],
    createdAt: new Date() 
};
todos['aleh']['911d7404-f927-46b8-bde9-759be745061b'] = {
    id: '911d7404-f927-46b8-bde9-759be745061b',
    text: 'Agarra el bañador',
    description: 'Y pontelo',
    completed: false,
    author: 'aleh',
    tags: [],
    createdAt: new Date() 
};
todos['aleh']['911d7404-f927-46b8-bde9-759be745061a'] = {
    id: '911d7404-f927-46b8-bde9-759be745061a',
    text: 'Ponte a bailar',
    description: 'Y que salga el sol',
    completed: false,
    author: 'aleh',
    tags: [],
    createdAt: new Date() 
};

const app = express()
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
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
  .get('/users/:username/todos', (req, res) => {
      const username = req.params.username;

      if (!todos[username]) {
          todos[username] = {};
      }
      res.json(Object.values(todos[username]))
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
  .post('/users/:username/todos', (req, res) => {
      const username = req.params.username;

      if (!todos[username]) {
          todos[username] = {};
      }

      let newTodo = {
        id: uuidv4(),
        text: req.body.text,
        description: req.body.description || '',
        completed: false,
        author: username,
        tags: req.body.tags || [],
        createdAt: new Date()
      };

      todos[username][newTodo.id] = newTodo;
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
  .patch('/users/:username/todos/:id', (req, res) => {
      const username = req.params.username;
      const id = req.params.id;
      if (!todos[username] || !todos[username][id]) {
          res.status(404).json({ "error": 'Not found'});

          return;
      }

      const completed = req.body.completed ?? todos[username][id].completed;
      const text = req.body.text || todos[username][id].text;
      const description = req.body.description || todos[username][id].description;
      const tags = req.body.tags || todos[username][id].tags;

      todos[username][id].completed = completed;
      todos[username][id].text = text;
      todos[username][id].description = description;
      todos[username][id].tags = tags;

      res.json(todos[username][id]);
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
    *       200:
    *         description: Empty response.
    */
  .delete('/users/:username/todos/:id', (req, res) => {
      const username = req.params.username;
      const id = req.params.id;
      if (!todos[username] || !todos[username][id]) {
          res.status(404).json({ "error": 'Not found'});

          return;
      }

      delete todos[username][id];

      res.json({});
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