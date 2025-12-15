import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const port = process.env.PORT || 5858;

// get the file path from the URL of current module
const __fileName = fileURLToPath(import.meta.url);
// get the directory name from the file path
const __dirname = path.dirname(__fileName);

// middleware
// let us expect and parse json
app.use(express.json());
// serve all files from /public directory
app.use(express.static(path.join(__dirname, '../public')));

// serve the index.html from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.listen(port, () => {
    console.log(`Server booted, listening on port ${port}`);
})
