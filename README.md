## Description

In this app you can manage blogs and posts

###

Enjoy it!

## Installation

You need install Docker: 23.0.1 and Docker Compose: v2.15.1 or latest version and type commands in CLI at the root directory of project.
In Windows OS there may be problems with the makefile. Then you can type docker commands.

## Running the app

```bash
$ make up or docker compose up
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

After sign in you will get an access token. You must insert this token to http headers interface like {
"Authorization": "Bearer <token>"
}
Then you may exec protected queries!

# Deployed url

```http request
https://first-blog-app.fly.dev/graphql
```

### Available requests:

#### User requests:

-   query {
    signIn(data: { email: "tzirw@example.com", password: "admin422I03Pfewq_3" }) {
    tokens {
    access
    refresh
    }
    user {
    id
    name
    surname
    email
    }
    }
    }

-   mutation {
    signUp(
    data: {
    name: "Hector"
    surname: "Troyanovich"
    email: "hector@mail.com"
    password: "etoiIN)978bY4!meww"
    }
    ) {
    tokens {
    access
    refresh
    }
    user {
    id
    name
    surname
    email
    }
    }
    }

-   query {
    findUser(userId: 1) {
    id
    name
    surname
    email
    createdAt
    updatedAt
    }
    }

-   mutation {
    changeRole(data: { userId: 3, role: MODERATOR }) {
    id
    name
    surname
    role
    }
    }

-   mutation {
    updateUserById(userId: 1, data: { name: "Hector" }) {
    id
    name
    surname
    email
    }
    }

-   mutation {
    removeUserById(userId: 2) {
    id
    }
    }

### Get users without pagination

-   query {
    findAllUsersWithoutPagination {
    id
    name
    surname
    email
    createdAt
    updatedAt
    role
    }
    }

#### Blog requests:

-   mutation {
    createBlogByUserId(
    userId: 3
    data: { name: "JavaScript", description: "Awesome language" }
    ) {
    id
    name
    description
    }
    }

-   query {
    findBlogByIds(userId: 3, blogId: 1) {
    id
    name
    description
    createdAt
    updatedAt
    }
    }

-   mutation {
    updateBlogByIds(
    userId: 3
    blogId: 1
    data: { name: "Java better than typescript" }
    ) {
    name
    description
    }
    }

-   mutation {
    removeBlogByIds(userId: 3, blogId: 1) {
    id
    }
    }

### Get blogs without pagination

-   query {
    findAllBlogsWithoutPagination {
    id
    name
    description
    createdAt
    updatedAt
    }
    }

### Post requests

-   mutation {
    createPostByIds(
    userId: 3
    blogId: 3
    data: { title: "SQL easy", content: "bla-bla-bla", isArchived: false }
    ) {
    id
    title
    content
    }
    }

-   query {
    findAllPostsByBlogId(userId: 3, blogId: 3) {
    id
    name
    description
    createdAt
    updatedAt
    posts {
    id
    title
    content
    isArchived
    createdAt
    updatedAt
    }
    }
    }

-   query {
    findPostByIds(userId: 3, blogId: 3, postId: 1) {
    id
    title
    content
    isArchived
    createdAt
    updatedAt
    }
    }

-   mutation {
    updatePostByIds(
    userId: 3
    blogId: 3
    postId: 1
    data: { title: "Graphql stronger" }
    ) {
    id
    title
    content
    }
    }

-   mutation {
    removePostByIds(userId: 3, blogId: 3, postId: 2) {
    id
    }
    }
