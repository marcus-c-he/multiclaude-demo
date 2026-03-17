# multiclaude-demo

A simple Todo REST API built with Node.js and Express.

## Setup

```bash
npm install
```

## Running the server

```bash
npm start
```

The server listens on port `3000` by default. Set the `PORT` environment variable to use a different port:

```bash
PORT=8080 npm start
```

## Running tests

```bash
npm test
```

## API Reference

Base path: `/todos`

All request and response bodies use JSON. Set the `Content-Type: application/json` header when sending a body.

### Todo object

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false
}
```

| Field | Type | Description |
|---|---|---|
| `id` | integer | Auto-assigned unique identifier |
| `title` | string | Description of the todo item |
| `completed` | boolean | Whether the item is done |

---

### GET /todos

Returns all todos.

**Response**

`200 OK`
```json
[
  { "id": 1, "title": "Buy milk", "completed": false },
  { "id": 2, "title": "Walk dog", "completed": true }
]
```

Returns an empty array `[]` when no todos exist.

---

### GET /todos/:id

Returns a single todo by ID.

**Path parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | integer | ID of the todo |

**Response**

`200 OK`
```json
{ "id": 1, "title": "Buy milk", "completed": false }
```

`404 Not Found` — when no todo with that ID exists
```json
{ "error": "Todo not found" }
```

---

### POST /todos

Creates a new todo.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Description of the todo item (must be non-empty) |
| `completed` | boolean | No | Initial completion state (defaults to `false`) |

```json
{ "title": "Buy milk", "completed": false }
```

**Response**

`201 Created`
```json
{ "id": 1, "title": "Buy milk", "completed": false }
```

`400 Bad Request` — when `title` is missing, empty, or not a string
```json
{ "error": "title is required and must be a non-empty string" }
```

---

### PUT /todos/:id

Updates an existing todo. Only the fields provided in the body are changed.

**Path parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | integer | ID of the todo to update |

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | No | New title |
| `completed` | boolean | No | New completion state |

```json
{ "completed": true }
```

**Response**

`200 OK` — returns the updated todo
```json
{ "id": 1, "title": "Buy milk", "completed": true }
```

`404 Not Found` — when no todo with that ID exists
```json
{ "error": "Todo not found" }
```

---

### DELETE /todos/:id

Deletes a todo.

**Path parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | integer | ID of the todo to delete |

**Response**

`204 No Content` — todo was deleted successfully (no body)

`404 Not Found` — when no todo with that ID exists
```json
{ "error": "Todo not found" }
```
