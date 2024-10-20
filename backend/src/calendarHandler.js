const { google } = require("googleapis");

async function createCalendarEvent(auth, event) {
  const calendar = google.calendar({ version: "v3", auth });

  let startDate = new Date(event.start);
  let ISOStartDate = startDate.toISOString();

  let endDate = new Date(event.end);
  let ISOEndDate = endDate.toISOString();

  try {
    const response = await calendar.events.insert({
      calendarId: "primary", // Use 'primary' for the main calendar, or specify another calendar ID
      resource: {
        summary: event.summary,
        loctation: event.location,
        description: event.description,
        start: {
          dateTime: ISOStartDate,
          timeZone: "America/New_York",
        },
        end: {
          dateTime: ISOEndDate,
          timeZone: "America/New_York",
        },
      }, // The event object from the JSON
    });
    console.log(
      `Event created: ${response.data.summary} - ${response.data.htmlLink}`
    );
  } catch (error) {
    console.error(`Error creating event: ${error}`);
  }
}

module.exports = { createCalendarEvent };
