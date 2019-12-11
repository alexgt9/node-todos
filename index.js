const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const todos = [];
todos.push({'id': 1, 'text': 'Agarra la sombrilla', 'done': false });
todos.push({'id': 2, 'text': 'Agarra el bañador', 'done': false });
todos.push({'id': 3, 'text': 'Ponte a bailar', 'done': false });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/todos', (req, res) => res.render(JSON.stringify(todos)))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
