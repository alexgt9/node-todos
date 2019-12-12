const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const todos = {};
todos['aleh'] = [];
todos['aleh'].push({'id': 1, 'text': 'Agarra la sombrilla', 'done': false });
todos['aleh'].push({'id': 2, 'text': 'Agarra el bañador', 'done': false });
todos['aleh'].push({'id': 3, 'text': 'Ponte a bailar', 'done': false });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/todos/:username', (req, res) => {
      const username = req.params.username;

      if (!todos[username]) {
          todos[username] = [];
      }
      res.json(todos[username])
  })
  .post('/todos/:username', (req, res) => {
      const username = req.params.username;
      if (!todos[username]) {
          todos[username] = [];
      }
      let newTodo = req.body;
      newTodo.done = false;
      todos[username].push(newTodo);
      res.json();
  })
  .post('/todos/:username/:id', (req, res) => {
      const username = req.params.username;
      const id = req.params.id;
      if (!todos[username] || !todos[username][id]) {
          res.status(404).send('Not found');
      }

      const done = req.body.done || false;

      todos[username][id].done = done;

      res.json(todos[username][id]);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
