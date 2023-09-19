import express from 'express';
import gmailController from '../controllers/gmailController.js';
import dbController from '../controllers/dbController.js';
import openaiController from '../controllers/openaiController.js';
import { gmail } from 'googleapis/build/src/apis/gmail/index.js';
const router = express.Router();


router.get('/user/:email', gmailController.getUser,(req, res) =>{
  return res.status(200).send(res.locals.data);
});

router.post('/draft/', openaiController.generatureCompany, gmailController.mimeDraft, gmailController.createDraft, dbController.addDraft,(req, res) =>{
  return res.status(200).send(res.locals.data);
});

router.delete('/draft/:emailId', gmailController.sendDraft, dbController.deleteDraft, (req,res) =>{
  return res.status(200).send()
});

router.get('/drafts', dbController.getDrafts, (req, res) => {
  return res.status(200).send(res.locals.data);
});

router.get('/draftdetails/:emailId', gmailController.getDraftDetails, (req,res)=>{
  return res.status(200).send(res.locals.data)
});


export default router;
