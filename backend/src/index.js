require("dotenv").config({ path: "../.env" });
console.log("HI", process.cwd());
//console.log(process.env);

const express = require("express");
const app = express();
const port = 3000;
const { google } = require("googleapis");
const googleAuthorizeHandler = require("./googleAuthorizationHandler");
const emailHandler = require("./emailHandler");
const geminiHandler = require("./geminiHandler");
const calendarHandler = require("./calendarHandler");

/*---------------------------------------------------------------------------*/

/* Route to fetch emails and return them as JSON */
app.get("/", async (req, res) => {
  try {
    const auth = await googleAuthorizeHandler.authorize(); // Get the authorized client
    const emails = await emailHandler.getEmails(auth); // Fetch emails

    // console.log(emails);

    const parsedEmails = await geminiHandler.parseEvents(emails);

    const cleanedEvents = cleanParsedEvents(parsedEmails, emails);

    // calendarHandler.createCalendarEvent(auth, cleanedEvents[0]);

    res.json(cleanedEvents); // Send emails as JSON response
  } catch (error) {
    res.status(500).json({
      error: "Error fetching or parsing emails",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/*---------------------------------------------------------------------------*/

/* 
Helper function to clean the parsed emails: 
removes empty arrays and events without a date 
adds the id for each email and 
changes each event to be of the correct form for 
the calendar API. 

summary: (title) 
description 
location: 
start: 
end: 
*/

function cleanParsedEvents(parsedEvents, emails) {
  // add error checking for if arrays are of diff sizes

  // get the list of IDs from each email
  let IdArr = emails.map((email) => {
    return email.id;
  });

  let i = -1;

  let cleanedEvents = parsedEvents.map((eventArr) => {
    if (eventArr.length === 0) return null;
    i++;
    return eventArr.map((event) => {
      if (event.start === null || event.end === null) return null;
      return { id: IdArr[i], ...event };
    });
  });

  // then flatten the list and filter out nulls
  return cleanedEvents.flat().filter(Boolean);
}
