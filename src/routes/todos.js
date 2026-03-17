const express = require('express');
const store = require('../store');
const { requireTitle } = require('../middleware/validate');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.getAll());
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = store.getById(id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

router.post('/', requireTitle, (req, res) => {
  const { title, completed } = req.body;
  const todo = store.create({ title, completed });
  res.status(201).json(todo);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = store.update(id, req.body);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const removed = store.remove(id);
  if (!removed) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
});

module.exports = router;
