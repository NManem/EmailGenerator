// const path = require('path');
import path from 'path';
// const express = require('express');
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import openaiRouter  from './routes/openai.js'
import gmailRouter from './routes/gmail.js'
app.use('/assets', express.static(path.resolve(__dirname, '../src/assets/')));

app.use('/api/openai', openaiRouter)
app.use('/api/gmail', gmailRouter)


app.use((req, res) => res.sendStatus(404)); 

// global error handler:
app.use((err, _req, res, _next) => {
  const defaultErr = {
    log: 'Express error handler has caught an unknown middleware error',
    status: 400,
    message: { err: 'an error occured.' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// start server:
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;