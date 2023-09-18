import fs from 'fs';
import path from 'path';


const dbController = {};
const filePath = './server/database/draftsDB.csv';

dbController.addDraft = async function (req, res, next) {
  const { emailId } = res.locals;
  fs.appendFileSync(filePath, emailId + '\n', 'utf8');
  return next()
}

dbController.getDrafts = async function (req, res, next) {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n');
  res.locals.data = lines;
  return next()

}

dbController.deleteDraft = async function (req, res, next) {
  const { emailId } = req.params;
  console.log(emailId)
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  lines = lines.filter(line => line !== emailId);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  return next()
}

export default dbController;