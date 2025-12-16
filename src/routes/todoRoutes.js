import express from 'express'
import db from '../db.js'

const router = express.Router();

// get all todos for the user
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId);
    res.json(todos);
})

// create task item
router.post('/', (req, res) => {
    const { task } = req.body
    if (!task) { return res.status(400).json({ message: "No task provided" }) }
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    const result = insertTodo.run(req.userId, task)

    res.json({ id: result.lastInsertRowid, task, completed: 0 })
})

// update task
router.put('/:id', (req, res) => {
    const { id } = req.params
    const { completed } = req.body;

    if (!id) {
        return res.status(400).json({ message: "No id provided" })
    }
    if (completed < 0 || completed > 1) {
        return res.status(400).json({ message: "Wrong status provided" })
    }

    const prepareUpdate = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`);
    prepareUpdate.run(completed, id);

    if(completed !== 0) {
        res.json('Todo completed')
    }
})

// delete task
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.userId

    if (!id) {
        return res.status(400).json({ message: "No id provided" })
    }

    const prepareDelete = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
    prepareDelete.run(id, userId);

    res.send({ message: "Todo deleted" })
})

export default router
