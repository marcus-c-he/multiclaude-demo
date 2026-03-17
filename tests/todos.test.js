const request = require('supertest');
const app = require('../src/index');
const store = require('../src/store');

beforeEach(() => {
  store._reset();
});

describe('GET /todos', () => {
  it('returns an empty array when no todos exist', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all todos', async () => {
    store.create({ title: 'First' });
    store.create({ title: 'Second' });
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe('First');
    expect(res.body[1].title).toBe('Second');
  });
});

describe('GET /todos/:id', () => {
  it('returns a todo by id', async () => {
    const todo = store.create({ title: 'Test todo' });
    const res = await request(app).get(`/todos/${todo.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: todo.id, title: 'Test todo', completed: false });
  });

  it('returns 404 when todo not found', async () => {
    const res = await request(app).get('/todos/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Todo not found' });
  });
});

describe('POST /todos', () => {
  it('creates a new todo with title only', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'New todo' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'New todo', completed: false });
    expect(res.body.id).toBeDefined();
  });

  it('creates a todo with completed set to true', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Done todo', completed: true });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Done todo', completed: true });
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/todos')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title is required and must be a non-empty string' });
  });

  it('returns 400 when title is an empty string', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title is required and must be a non-empty string' });
  });

  it('returns 400 when title is only whitespace', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title is required and must be a non-empty string' });
  });

  it('returns 400 when title is not a string', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 123 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title is required and must be a non-empty string' });
  });
});

describe('PUT /todos/:id', () => {
  it('updates the title of an existing todo', async () => {
    const todo = store.create({ title: 'Original' });
    const res = await request(app)
      .put(`/todos/${todo.id}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: todo.id, title: 'Updated', completed: false });
  });

  it('updates the completed status of an existing todo', async () => {
    const todo = store.create({ title: 'Task' });
    const res = await request(app)
      .put(`/todos/${todo.id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: todo.id, title: 'Task', completed: true });
  });

  it('returns 404 when todo not found', async () => {
    const res = await request(app)
      .put('/todos/999')
      .send({ title: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Todo not found' });
  });
});

describe('DELETE /todos/:id', () => {
  it('deletes an existing todo and returns 204', async () => {
    const todo = store.create({ title: 'To delete' });
    const res = await request(app).delete(`/todos/${todo.id}`);
    expect(res.status).toBe(204);
    expect(store.getById(todo.id)).toBeNull();
  });

  it('returns 404 when todo not found', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Todo not found' });
  });
});
