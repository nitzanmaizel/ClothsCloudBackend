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
app.use('/items', require('./routes/items'));
app.use('/api/sets', require('./routes/sets'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server on http://localhost:${PORT}`));
