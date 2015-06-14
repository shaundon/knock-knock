Hosted on Heroku at https://salty-plains-7151.herokuapp.com/.

Demo video: https://www.youtube.com/watch?v=2orEnXsOQAU

## Residences API

### GET /residence

Returns all residences as a JSON array, e.g.:

```
[
    {
        "id": "id_of_residence",
        "name": "name_of_residence",
        "code": "access_code"
    }
]
```

### GET /residence/:id

Returns a single residence as a JSON object, e.g.:

```
{
    "id": "id_of_residence",
    "name": "name_of_residence",
    "code": "access_code"
}
```

If ID isn't valid, returns *404 Not Found*.

### DELETE /residence/:id

Deletes the residence with the specified ID. Returns *204 No Content* if successful, or *404 Not Found* if ID isn't found.

### POST /residence

```
{
    "name": "name_of_residence"
}
```

Takes a request body with a JSON object containing the name, will then autogenerate an ID and a random code, which is returned along with a *201 Created* response. Otherwise returns *400 Bad Request*.

### PUT /residence/:id

```
{
    "name": "name_of_residence"
}
```

Takes a request body with a JSON object containing the name and code. Code must be 4 digits 0-9. If data is invalid returns *400 Bad Request*. If ID isn't valid, *404 Not Found*. If update is successful, *200 OK* along with the updated entity.

## Authentication API

### PUT /authenticate/:id

Send JSON body like this:

```
{
    "code": "1234"
}
```

..where *1234* is the code you're trying to authenticate with and *id* (in the URL) is the ID of the residence.

#### Possible return values

* 200 OK - If code is correct.
* 403 Forbidden - If code is incorrect.
* 404 Not Found - If ID doesn't correspond to a valid residence.
* 400 Bad Request - If *code* is not submitted at all.


