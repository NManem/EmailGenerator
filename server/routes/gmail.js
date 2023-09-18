import express from 'express';
import gmailController from '../controllers/gmailController.js';
import dbController from '../controllers/dbController.js';
import { gmail } from 'googleapis/build/src/apis/gmail/index.js';
const router = express.Router();


router.get('/user/:email', gmailController.getUser,(req, res) =>{
  return res.status(200).send(res.locals.data);
});

router.post('/draft/', gmailController.mimeDraft, gmailController.createDraft, dbController.addDraft,(req, res) =>{
  return res.status(200).send(res.locals.data);
});

router.delete('/draft/:emailId', gmailController.sendDraft, dbController.deleteDraft, (req,res) =>{
  return res.status(200).send()
});

router.get('/draft/:emailId', gmailController.getDraft, (req,res)=>{
  return res.status(200).send(res.locals.data)
});


export default router;
