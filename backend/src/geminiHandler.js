const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function prompt(body) {
  const date = new Date().toDateString();

  const prompt =
    "Given this email body, are there any upcoming events to attend that could be added " +
    "as a calendar event? If so, please generate your response as an array of " +
    "events, where each event is of form: " +
    "{" +
    "description: <description>, " +
    "start: dd Month yyyy hh:ss" +
    "end: dd Month yyyy hh:ss" +
    "summary: (the event name), " +
    "location: (if unknown, write null)}. " +
    "Do not include events that have already happened or are not tangible events to attend. If you cannot determine any possible events, please return just []. " +
    "If there is no date, do not include the event! " +
    "It is fine if a time or location cannot be determined. Please only have " +
    "the array, and nothing else (such as ```json) in your response. For " +
    "reference, these emails were retrieved on " +
    date +
    ". Here is the body: " +
    body;
  const promptResult = await model.generateContent(prompt);

  const result = promptResult.response.text();

  // console.log(JSON.parse(result));

  return JSON.parse(result);
}

async function parseEvents(data) {
  const result = await Promise.all(
    data.map(async (email) => {
      return await prompt(email.body);
    })
  );

  console.log("result: " + result);
  return result;
}

module.exports = { parseEvents };
