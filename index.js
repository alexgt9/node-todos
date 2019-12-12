const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const todos = {};
todos['aleh'] = {};
todos['aleh'][1] = {'id': 1, 'text': 'Agarra la sombrilla', 'done': false };
todos['aleh'][2] = {'id': 2, 'text': 'Agarra el bañador', 'done': false };
todos['aleh'][3] = {'id': 3, 'text': 'Ponte a bailar', 'done': false };

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/todos/:username', (req, res) => {
      const username = req.params.username;

      if (!todos[username]) {
          todos[username] = {};
      }
      res.json(Object.values(todos[username]))
  })
  .post('/todos/:username', (req, res) => {
      const username = req.params.username;
      if (!req.body.id) {
          res.status(400).json({ "error": 'You should send an id in the body'});

          return;
      }
      if (!todos[username]) {
          todos[username] = {};

          return;
      }
      let newTodo = req.body;
      newTodo.done = false;
      todos[username][newTodo.id] = newTodo;
      res.json();
  })
  .post('/todos/:username/:id', (req, res) => {
      const username = req.params.username;
      const id = req.params.id;
      if (!todos[username] || !todos[username][id]) {
          res.status(404).json({ "error": 'Not found'});

          return;
      }

      const done = req.body.done || false;

      todos[username][id].done = done;

      res.json(todos[username][id]);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
