const express = require("express");
const app = express();
const port = 3000;
const { google } = require("googleapis");
const googleAuthorize = require("./googleAuthorizationHandler");

/* Cache object, so that the Gmail API is only called at most once every ten minutes */
let emailCache = {
  emails: null,
  lastFetched: null,
  cacheDuration: 1000 * 60 * 10 * 10, // 10 minutes (in milliseconds)
};

/* Get emails */
async function getEmails(auth) {
  // If cache exists and is valid, return the cached emails
  const now = Date.now();
  if (
    emailCache.emails &&
    now - emailCache.lastFetched < emailCache.cacheDuration
  ) {
    console.log("Returning cached emails.");
    return emailCache.emails; // Return cached emails
  }

  // ---------------------

  // otherwise, make an API request.
  console.log("Cache outdated, calling API");

  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    in: "inbox",
    newer_than: "1d",
    maxResults: 5,
    category: "primary",
  });

  const emailIds = res.data.messages || [];

  // Get details for each email
  const emails = await Promise.all(
    emailIds.map(async (email) => {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: email.id,
      });

      const emailData = message.data;
      // console.log(emailData);
      const emailBody = getBody(emailData.payload);

      return {
        id: emailData.id,
        body: emailBody,
      };
    })
  );

  // Update cache with new emails
  emailCache.emails = emails;
  emailCache.lastFetched = now;

  return emails;
}

/* Helper function for getEmails */
function getBody(payload) {
  const parts = payload.parts || [];

  // Function to extract text/plain part
  for (let part of parts) {
    if (part.mimeType === "text/plain" && part.body.data) {
      const body = Buffer.from(part.body.data, "base64").toString("utf-8");
      return body;
    }
  }
  return "";
}

module.exports = { getEmails };
