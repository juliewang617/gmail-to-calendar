As a busy college student, my inbox is flooded daily with club events, meetings, talks, conferences, and more. Searching through emails and adding each event to my calendar I’m interested takes a long time — so I thought, what if I could automate this process?

The EmailToCalendar Bot just does this: it searches your recent emails for possible events, suggests them to you through a simple UI, and with a click of a button, they’ll be added to your calendar.

The application incorporates a JavaScript backend with Node and Express to implement a RESTful API. It seamlessly configures OAuth 2.0 to authenticate the user, then takes advantage of the Google Gemini LLM to parse emails for events. Caching is also implemented to reduce API calls.

The frontend, built with React, seamlessly calls the backend API to configure logic. With the click of a button, the application will search your emails and suggest events to add. The user can then accept or reject each event. If accepted, the event will be added to the user’s calendar. The user can also edit information about the event in the UI before adding it.

Through this project, I was able to identify a real-life nuisance and build a solution for it. I gained experience in crafting a RESTful API with Node and express, and used my strong skills in React to build a user-friendly frontend. I also learned how to integrate Google’s Developer APIs—OAuth 2.0, Gmail, Calendar, and Gemini.
