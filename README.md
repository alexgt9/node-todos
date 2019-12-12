# MPWAR Todos

Simple API to create todo lists [https://todos-mpwar.herokuapp.com/](https://todos-mpwar.herokuapp.com/).

Each :username is a unique todo list

## Endpoints

### Get todos

`GET /todos/:username`

### Post todo

`POST /todos/:username`

```
Body
{
    "id": 1,
    "text": "Agarra la sombrilla"
}
```

### Mark as done/undone

`POST /todos/:username/:id`

```
Body
{
    "done": true/false
}
```

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
