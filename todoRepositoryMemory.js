import uuid from 'uuid';

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

const getTodos = async (author) => {
    if (!todos[author]) {
        todos[author] = {};
    }
  
    return Object.values(todos[author])
};

const createTodo = async (author, todo) => {
    if (!todos[author]) {
        todos[author] = {};
    }

    let newTodo = {
      id: uuid.v4(),
      text: todo.text,
      description: todo.description || '',
      completed: false,
      author: author,
      tags: todo.tags || [],
      createdAt: new Date()
    };

    todos[author][newTodo.id] = newTodo;
    console.log(newTodo)

    return newTodo
};

const updateTodo = async (author, id, todo) => {
    if (!todos[author] || !todos[author][id]) {
        return null
    }

    const completed = todo.completed ?? todos[author][id].completed;
    const text = todo.text || todos[author][id].text;
    const description = todo.description || todos[author][id].description;
    const tags = todo.tags || todos[author][id].tags;

    todos[author][id].completed = completed;
    todos[author][id].text = text;
    todos[author][id].description = description;
    todos[author][id].tags = tags;

    return todos[author][id];
};

const deleteTodo = async (author, id) => {
    console.log(author, id)
    console.log(todos)
    if (!todos[author] || !todos[author][id]) {
        console.log('no existe')
        return false;
    }

    delete todos[author][id];

    return true;
};

const initializeDatabase = async () => {
    // Nothing to do here
}

export default {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    initializeDatabase,
};