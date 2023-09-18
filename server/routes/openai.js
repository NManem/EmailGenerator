import express from 'express';
import openaiController from '../controllers/openaiController.js';
const router = express.Router();

router.post('/email', openaiController.generateEmail ,(req, res) =>{
  return res.status(200).json(res.locals.email);
});

router.post('/subject', openaiController.generateSubjectLine, (req,res)=>{
  return res.status(200).json(res.locals.data);
});


export default router;
