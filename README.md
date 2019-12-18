# MPWAR Todos

Simple API to create todo lists [https://todos-mpwar.herokuapp.com](https://todos-mpwar.herokuapp.com).

Each `:username` is a unique todo list

## Endpoints

### Get todos

`GET /users/:username/todos`

Response
```
[
    {
        "id": 1,
        "text": "Agarra la mochila",
        "completed": false,
        "author": ":username",
        "createdAt": "2019-12-18T19:12:47.826Z"
    },
    {
        ...
    }
]
```

### Post todo

`POST /users/:username/todos`

```
Body
{
    "text": "Agarra la sombrilla"
}
```

### Edit ToDo

`PATCH /users/:username/todos/:id`

```
Body
{
    "completed": true/false,
    "text": "New text"
}
```

### Delete ToDo

`DELETE /users/:username/todos/:id`

## Deploying to Heroku

```
$ git push heroku master
$ heroku open
```

## Working locally

```
$ heroku local
```

Api will be available at [http://localhost:5000](http://localhost:5000)
