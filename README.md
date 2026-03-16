# multiclaude-demo

A simple Todo REST API built with Express.js. Demonstrates MultiClaude parallel agent development.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Running the Server

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

The server listens on port `3000` by default. Override with the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | Port the HTTP server binds to |

Create a `.env` file in the project root to set variables:

```
PORT=3000
```

---

## API Reference

Base URL: `http://localhost:3000`

All request and response bodies use `application/json`.

---

### Health Check

#### `GET /health`

Returns server health status.

**Response `200 OK`**

```json
{ "status": "ok" }
```

---

### Todos

#### Data Model

| Field       | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| `id`        | `string`  | UUID v4, assigned on creation        |
| `title`     | `string`  | Todo text (1–500 characters)         |
| `completed` | `boolean` | Whether the todo is done             |
| `createdAt` | `string`  | ISO 8601 timestamp of creation time  |

**Example todo object:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

---

#### `GET /todos`

List all todos.

**Response `200 OK`** — array of todo objects (empty array if none exist)

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-03-16T21:51:52.000Z"
  }
]
```

---

#### `GET /todos/:id`

Get a single todo by ID.

**Path parameters**

| Parameter | Type     | Description   |
|-----------|----------|---------------|
| `id`      | `string` | Todo UUID     |

**Response `200 OK`** — todo object

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

**Response `404 Not Found`**

```json
{ "error": "Not found" }
```

---

#### `POST /todos`

Create a new todo.

**Request body**

| Field   | Type     | Required | Description                    |
|---------|----------|----------|--------------------------------|
| `title` | `string` | Yes      | Todo text (1–500 characters)   |

```json
{ "title": "Buy groceries" }
```

**Response `201 Created`** — the created todo object

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

**Response `400 Bad Request`** — validation errors

```json
{
  "errors": [
    { "field": "title", "message": "title is required" }
  ]
}
```

---

#### `PUT /todos/:id`

Update a todo's title and/or completed status. At least one field must be provided.

**Path parameters**

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `id`      | `string` | Todo UUID   |

**Request body** (all fields optional, but at least one should be present)

| Field       | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| `title`     | `string`  | New todo text (1–500 characters)     |
| `completed` | `boolean` | New completion status                |

```json
{ "completed": true }
```

**Response `200 OK`** — the updated todo object

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": true,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

**Response `400 Bad Request`** — validation errors

```json
{
  "errors": [
    { "field": "completed", "message": "completed must be a boolean" }
  ]
}
```

**Response `404 Not Found`**

```json
{ "error": "Not found" }
```

---

#### `DELETE /todos/:id`

Delete a todo.

**Path parameters**

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `id`      | `string` | Todo UUID   |

**Response `204 No Content`** — empty body on success

**Response `404 Not Found`**

```json
{ "error": "Not found" }
```

---

## Error Reference

| Status | Condition                                    | Body shape                             |
|--------|----------------------------------------------|----------------------------------------|
| `400`  | Invalid request body (validation failure)    | `{ "errors": [{ "field", "message" }] }` |
| `404`  | Todo with the given ID does not exist        | `{ "error": "Not found" }`             |

### Validation rules

**`POST /todos`**
- `title` is required
- `title` must be a non-empty string
- `title` must be 500 characters or fewer (after trimming)

**`PUT /todos/:id`**
- `title`, if provided, must be a non-empty string of 500 characters or fewer (after trimming)
- `completed`, if provided, must be a boolean

---

## Testing with curl

Start the server first:

```bash
npm start
```

All examples below assume the server is running on `http://localhost:3000`.

---

### List all todos

```bash
curl http://localhost:3000/todos
```

**Response `200 OK`**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-03-16T21:51:52.000Z"
  }
]
```

---

### Get a single todo

```bash
curl http://localhost:3000/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response `200 OK`**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

**Response `404 Not Found`** (unknown ID)

```json
{ "error": "Not found" }
```

---

### Create a todo

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

**Response `201 Created`**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

**Response `400 Bad Request`** (missing title)

```json
{
  "errors": [
    { "field": "title", "message": "title is required" }
  ]
}
```

---

### Update a todo

```bash
curl -X PUT http://localhost:3000/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Response `200 OK`**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Buy groceries",
  "completed": true,
  "createdAt": "2026-03-16T21:51:52.000Z"
}
```

**Response `404 Not Found`** (unknown ID)

```json
{ "error": "Not found" }
```

---

### Delete a todo

```bash
curl -X DELETE http://localhost:3000/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response `204 No Content`** — empty body on success

**Response `404 Not Found`** (unknown ID)

```json
{ "error": "Not found" }
```

---

## Project Structure

```
src/
  app.js              # Express app setup, middleware, route registration
  index.js            # Server entry point (binds port)
  routes/
    todos.js          # CRUD route handlers for /todos
  models/
    todo.js           # Todo factory function and type definition
    todoStore.js      # In-memory Map store (getAll, getById, create, update, remove)
  middleware/
    validate.js       # Request body validation middleware
```

> **Note:** Data is stored in memory and resets on every server restart. There is no database.
