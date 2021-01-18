require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./util/db');
const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use('/api', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/clothsset', require('./routes/ClothsSet'));

const PORT = process.env.PORT;
app.listen(PORT, console.log(`server on http://localhost:${PORT}`));
