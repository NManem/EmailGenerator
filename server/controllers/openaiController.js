import OpenAI from "openai";
import dotenv from 'dotenv';
import { testMessages, emailGeneratorV1, subjectTitlePrompt } from "../constants/openaiPrompts.js";
dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Controller Logic
const openaiController = {};
openaiController.generateEmail = async function (req, res, next) {
  try {
    const { experience, role } = req.body;
    emailGeneratorV1.push({
      "role": "user",
      "content": `Experience: ${experience}, Role:${role}`
    })
    const response = await openai.chat.completions.create({
      messages: emailGeneratorV1,
      model: 'gpt-3.5-turbo-16k',
      temperature: 0.8,
      max_tokens: 4096,
    });

    res.locals.email = response.choices[0].message.content;
    // console.log(res.locals.email)
    return next()
  }
  catch (err) {
    const log = `Error occuring in openaiController.generateEmail: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
};

openaiController.generateSubjectLine = async function (req, res, next) {
  try {
    const { draft, name } = req.body;
    subjectTitlePrompt.push({
      "role": "user",
      "content": `${draft}, Name:${name}`
    })
    const response = await openai.chat.completions.create({
      messages: subjectTitlePrompt,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 1000,
    });
    const data = response.choices[0].message.content;
    const list = data.split('\n');
    res.locals.data = list;
    console.log(list)
    return next();

  }
  catch (err) {
    const log = `Error occuring in openaiController.generateSubjectLine: ${err}`;
    const message = { err: 'Error occured on server side' };
    return next({ log: log, message: message });
  }
}

export default openaiController;