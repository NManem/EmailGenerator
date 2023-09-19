import { google } from 'googleapis';
import dotenv from 'dotenv';
import axios from 'axios';
// import createDraft from '../scripts/createDraft.js';
import { Base64 as base64 } from 'js-base64';
dotenv.config();

//? ----------------------------------------HELPER METHODS---------------------------------------->


// For Axios
const generateConfig = (url, accessToken) => {
  return {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      "Content-type": "application/json",
    },
  };
};

// const auth = {
//   type: "OAuth2",
//   user: "nitesh.manem@gmail.com",
//   clientId: process.env.VITE_CLIENT_ID,
//   clientSecret: process.env.VITE_SECRET_ID,
//   refreshToken: process.env.REFRESH_TOKEN,
// };

const oAuth2Client = new google.auth.OAuth2(
  process.env.VITE_CLIENT_ID,
  process.env.VITE_SECRET_ID,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });



//? ----------------------------------------CONTROLLER METHODS---------------------------------------->

const gmailController = {};
gmailController.getUser = async function (req, res, next) {
  try {

    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.locals.data = response.data;
    return next()
  }
  catch (err) {
    const log = `Error occuring in gmailController.getUser: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
}

gmailController.mimeDraft = async function (req, res, next) {
  try {
    console.log('inside here')
    const { to, subject, body, networkersName, name, linkedinLink, githubLink, resumeLink } = req.body;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    let messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      ''
    ];

    // Add 'Hello <networkersName>,' Capitalize first letter
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    body[0] = `Hello ${capitalizeFirstLetter(networkersName)},`;
    let bodyString = body.join('<br>');

    const signature = `
    <a href="${resumeLink}" target="_blank">Resume</a> |
    <a href="${linkedinLink}" target="_blank">LinkedIn</a> |
    <a href="${githubLink}" target="_blank">GitHub</a>
    `;
    bodyString += '<br>' + name + '<br>' + signature;

    let message = messageParts.join('\n');
    message = message + '\n' + bodyString;
    res.locals.message = message;
    return next()
  }
  catch (err) {
    const log = `Error occuring in gmailController.mimeDraft: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
}

gmailController.createDraft = async function (req, res, next) {
  try {
    const { message } = res.locals;
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send request to GMAIL API
    const response = await gmail.users.drafts.create({
      userId: 'me',
      resource: {
        message: {
          raw: encodedMessage,
        },
      },
    });
    res.locals.emailId = response.data.id;
    console.log(`Draft created with ID: ${response.data.id}`);
    return next()

  }
  catch (err) {
    const log = `Error occuring in gmailController.createDraft: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
}

gmailController.getDraftDetails = async function (req, res, next) {
  try {
    const { emailId } = req.params;
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/drafts/${emailId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    const data = response.data
    // console.log(data)

    const from = data.message.payload.headers.find(header => header.name === "From").value;
    const to = data.message.payload.headers.find(header => header.name === "To").value;
    const subject = data.message.payload.headers.find(header => header.name === "Subject").value;
    const bodyData = data.message.payload.body.data;
    const body = Buffer.from(bodyData, 'base64').toString('utf8');
    const output = { from, to, subject, body}
    res.locals.data = output;
    return next()
  }
  catch (err) {
    const log = `Error occuring in gmailController.getDraft: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
}

gmailController.sendDraft = async function (req, res, next) {
  try {
    const { emailId } = req.params;
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const response = await gmail.users.drafts.send({
      userId: 'me',
      resource: {
        id: emailId
      }
    });
    if (response.data && response.data.id) {
      console.log(`Draft was successfuly sent with ID: ${emailId}`)
    }
    else {
      throw new Error(`Failed to send draft ${emailId}`);
    }
    return next()
  }
  catch (err) {
    const log = `Error occuring in gmailController.sendDraft: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
}


export default gmailController;