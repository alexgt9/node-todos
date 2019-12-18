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
  .get('/', (req, res) => {
      res.redirect('README.html');
  })
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
      }

      let newTodo = {
        "text": req.body.text,
        "id": uuidv4(),
        "completed": false,
        "author": username,
        "createdAt": new Date()
      };

      todos[username][newTodo.id] = newTodo;
      res.json(newTodo);
  })
  .patch('/users/:username/todos/:id', (req, res) => {
      const username = req.params.username;
      const id = req.params.id;
      if (!todos[username] || !todos[username][id]) {
          res.status(404).json({ "error": 'Not found'});

          return;
      }

      const completed = req.body.completed || todos[username][id].completed;
      const text = req.body.text || todos[username][id].text;

      todos[username][id].completed = completed;
      todos[username][id].text = text;

      res.json(todos[username][id]);
  })
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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
