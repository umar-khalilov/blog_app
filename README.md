## Description

In this app you can manage blogs and posts

###

Enjoy it!

## Installation

You need install Docker: 23.0.1 and Docker Compose: v2.15.1 or latest version and type commands in CLI at the root directory of project.
In Windows OS there may be problems with the makefile. Then you can type docker commands.

## Running the app

```bash
$ make up-dev or docker compose up
```

## Stopping the app

```bash
$ make stop or CTRL+C or docker compose stop
```

## Downing the app

```bash
$ make down or docker compose down
```

## Clear all docker containers, images and volumes

```bash
$ make prune or docker system prune --all --force --volumes
```

## Documentation

Moderator user credentials for sign in:

### email: tzirw@example.com

### password: admin422I03Pfewq_3

After sign in you will get an access token. You must insert this token to auth panel in Swagger interface!!
Then you may exec protected queries!

```http request
http://127.0.0.1:4000/api/docs
```
