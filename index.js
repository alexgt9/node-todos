const express = require('express');
const uuidv4 = require('uuid/v4');
const path = require('path');
var cors = require('cors');

const PORT = process.env.PORT || 5000

const todos = {};
todos['aleh'] = {};
todos['aleh']['911d7404-f927-46b8-bde9-759be745061d'] = {'id': '911d7404-f927-46b8-bde9-759be745061d', 'text': 'Agarra la sombrilla', 'completed': false, 'author': 'aleh', 'createdAt': new Date() };
todos['aleh']['911d7404-f927-46b8-bde9-759be745061b'] = {'id': '911d7404-f927-46b8-bde9-759be745061b', 'text': 'Agarra el bañador', 'completed': false, 'author': 'aleh', 'createdAt': new Date() };
todos['aleh']['911d7404-f927-46b8-bde9-759be745061a'] = {'id': '911d7404-f927-46b8-bde9-759be745061a', 'text': 'Ponte a bailar', 'completed': false, 'author': 'aleh', 'createdAt': new Date() };

express()
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/users/:username/todos', (req, res) => {
      const username = req.params.username;

      if (!todos[username]) {
          todos[username] = {};
      }
      res.json(Object.values(todos[username]))
  })
  .post('/users/:username/todos', (req, res) => {
      const username = req.params.username;

      if (!todos[username]) {
          todos[username] = {};

          return;
      }
      let newTodo = req.body;
      newTodo.id = uuidv4();
      newTodo.completed = false;
      newTodo.author = username;
      newTodo.createdAt = new Date();

      todos[username][newTodo.id] = newTodo;
      res.json();
  })
  .patch('/users/:username/todos:id', (req, res) => {
      const username = req.params.username;
      const id = req.params.id;
      if (!todos[username] || !todos[username][id]) {
          res.status(404).json({ "error": 'Not found'});

          return;
      }

      const completed = req.body.completed || false;

      todos[username][id].completed = completed;

      res.json(todos[username][id]);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
