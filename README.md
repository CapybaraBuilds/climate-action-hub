# ClimateAction Hub API

A RESTful API for a climate action community forum, built with Node.js and Express.js

## Features

- Forum post management (CRUD)
- Nested comments on posts
- User management

## Tech Stack

- Node.js
- Express.js

## API Endpoints

### Posts

| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| GET    | /posts     | Get all posts |
| GET    | /posts/:id | Get a post    |
| POST   | /posts     | Create a post |
| PUT    | /posts/:id | Update a post |
| DELETE | /posts/:id | Delete a post |

### Comments

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| GET    | /posts/:postId/comments     | Get all comments of a post |
| POST   | /posts/:postId/comments     | Create a comment           |
| DELETE | /posts/:postId/comments/:id | Delete a comment           |

### Users

| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| GET    | /users     | Get all users |
| GET    | /users/:id | Get a user    |
| POST   | /users     | Create a user |

## Error Responses

Errors are returned as JSON with an `error` message and an appropriate HTTP status code, for example:

```json
{
  "error": "Post with id 123 not found"
}
```

## Run Locally

npm install
npm run dev

## Run with Docker

# Start all services

docker-compose up --build

# Stop all services

docker-compose down
