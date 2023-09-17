import express from 'express';
import openaiController from '../controllers/openaiController.js';
const router = express.Router();

router.post('/email', openaiController.generateEmail ,(req, res) =>{
  console.log('inside email router')
  return res.status(200).json(res.locals.email);
});


export default router;
