import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter as csvWriterLib } from 'csv-writer';
import Papa from 'papaparse';


const dbController = {};
const filePath = './server/database/draftsDB.csv';

//? ----------------------------------------HELPER METHODS---------------------------------------->


const csvWriter = (emailId, to, company) => {
  const writer = csvWriterLib({
      path: filePath,
      header: [
          { id: 'emailId', title: 'Email ID' },
          { id: 'to', title: 'Recipient' },
          { id: 'company', title: 'Company' }
      ],
      append: true
  });
  const record = {
      emailId: emailId,
      to: to,
      company: company
  };
  writer.writeRecords([record]);
}

const deleteRecordByEmailId = (emailId) => {
  const file = fs.readFileSync(filePath, 'utf8');
  Papa.parse(file, {
      complete: (result) => {
          const data = result.data;
          const newData = data.filter(row => row[0] !== emailId); // Assuming emailId is the first column

          const csv = Papa.unparse(newData);
          fs.writeFileSync(filePath, csv);
      }
  });
}

// const readFile = () => {
//   const file = fs.readFileSync(filePath, 'utf8');
//   let emails = [];

//   Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//           emails = result.data;
//       },
//       error: (error) => {
//           console.error('Error parsing CSV:', error.message);
//       }
//   });

//   return emails;
// };

const parseCSV = (data) => {
  const lines = data.trim().split('\n');
  const headers = lines[0].split(',');

  const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, index) => {
          row[header.trim()] = values[index];  // Trim the header here
      });
      return row;
  });

  return rows;
};

const readFile = () => {
  const file = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  return parseCSV(file);
};

//? ----------------------------------------CONTROLLER METHODS---------------------------------------->


dbController.addDraft = async function (req, res, next) {
  const { to} = req.body;
  let {company} = res.locals;
  if (!company) company = '';
  const emailId = res.locals.emailId;

  csvWriter(emailId, to, company)
  return next()
}

dbController.getDrafts = async function (req, res, next) {
  res.locals.data = readFile();
  return next()

}

dbController.deleteDraft = async function (req, res, next) {
  const { emailId } = req.params;
  if (!emailId) {
    console.log('Email id does not exist so cannot delete from DB');
    return next()
  }
  deleteRecordByEmailId(emailId);
  return next()
}

export default dbController;