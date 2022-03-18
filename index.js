const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Enable .env
dotenv.config();

// App
const app = express();

// DB
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to DB!');
  }
});

// Middlewares
app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => {
  console.log('Server is running!');
});
