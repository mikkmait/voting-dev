# voting-dev

A development version of a web application utilizing node.js, express, mongoDB and other smaller modules to run a live voting functionality.

This app is created as a part of a theatre performance, to have an option for the audience to vote for possibilities happening on stage.
  
Preview of all the functionality running at once in a single window:
https://voting-dev.herokuapp.com
  
## How to run.

- git clone https://github.com/mikkmait/voting-dev.git
- cd voting-dev
- npm i
- npm start ( npm test - with the debugger switched on )

(the DEFAULT port for the app is 7089, so the preview will be at http://localhost:7089)

### Parts

1. the CLIENT part - Public part for users, wher they can vote for possibilities at 4 different points during the show
2. the ADMIN part - This is for theatre tech people, and here they acn see who won the vote, and present it in the third part, which is the result view. They can also switch on and off the different votes since they are happening during different parts of the show.
3. the RESULT part - this is running on a separate screen facing the stage so the performers can see which one of the won the current vote. The page refreshes itself every 5 seconds, so if the tech updates the database with a winner then it will display on this screen at most 5 seconds later.

### Plans for updates:

- introducing some kind of websocket or socket.io or that kind of possibility so the results would update and be displayed in real time

### Notes on possible questions:

- Yes, I know people can vote more than once. I had the functionality to vote only once - per session, or - per device. But we killed that, because during rehearsals and testing the dramaturgy of the play needed it to be "hackable" or create this environment of "a race towards win", and since the voting time is only five minutes, a static one-per-person voting was a bit anticlimatic.