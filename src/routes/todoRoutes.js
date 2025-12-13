import express from 'express'
import db from '../db.js'

const router = express.Router();

// get all todos for the user
router.get('/', (req, res) => {})

// create task item
router.post('/', (req, res) => {})

// update task
router.put('/:id', (req, res) => {})

// delete task
router.delete('/:id', (req, res) => {})

export default router
