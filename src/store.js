let todos = [];
let nextId = 1;

function getAll() {
  return [...todos];
}

function getById(id) {
  return todos.find((todo) => todo.id === id) || null;
}

function create({ title, completed = false }) {
  const todo = { id: nextId++, title, completed };
  todos.push(todo);
  return todo;
}

function update(id, { title, completed }) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  return todo;
}

function remove(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

// Reset store — used in tests
function _reset() {
  todos = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, _reset };
