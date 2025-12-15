import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../db.js'


const router = express.Router();
const SALT = 13;

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, SALT);

    // save a user and password to DB
    try {
        const insertUser = db.prepare(`
            INSERT INTO users (username, password) VALUES (?, ?)
        `);
        const result = insertUser.run(username, hashedPassword);

        // add default task after the user creation
        const defaultTodo = 'Hey, add your first task :)';
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);

        // user_id === result.lastInsertRowid
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        // create a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.sendStatus(503);
    }
})
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const user = getUser.get(username);

        if (!user) {
            return res.status(404).send({message: 'User not found!'});
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({message: 'Invalid password!'});
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.sendStatus(503);
    }
})


export default router;
