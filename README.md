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
        "description": "Y ponte al sol, esta es una descripción más larga",
        "completed": false,
        "author": ":username",
        "tags": [
            "important",
            "school",
            "LaSalle"
        ],
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
    "text": "New text",
    "description": "New description",
    "tags": [
        "important",
        "school",
        "LaSalle"
    ]
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
