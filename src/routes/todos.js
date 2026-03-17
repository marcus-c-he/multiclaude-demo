const express = require('express');
const store = require('../store');

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

module.exports = router;
