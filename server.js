//variables for required modules
const express = require("express");
const path = require("path");
const uuid = require("uuid");

//helper variables to read,write and append file. Thank you Trilogy!
const {
    readFromFile,
    writeToFile,
    readAndAppend } = require("./helpers/fsUtils");

//use express.js
const app = express();

//setting variable for the port: either whatever is in the environment variable port, or use port 3001
const PORT = process.env.PORT || 3001;

//middleware for parsing json, parsing incoming urlencoded payloads and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//route handler for the the notes.html file
app.get("/notes", (req, res) => {
    console.log(`${req.method} request received.`);
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//route handler to retrieve notes data from the db.json file
app.get("/api/notes", (req, res) => {
    console.log(`${req.method} request received to retrieve notes.`)
    readFromFile("./db/db.json")
        .then(notesContent => res.json(JSON.parse(notesContent)));
});

//route handler for the POST request to save a new note to the request body and add to the db.json file
app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;

    console.info(`${req.method} request received to add a note titled: ${title}.`)

    //if the post request contains title and text then create a new note
    if (title && text) {

        let newNote = {
            id: uuid.v4(),
            title: req.body.title,
            text: req.body.text
        };

        //read and append the newNote data to the db.json file
        readAndAppend(newNote, "./db/db.json");
        res.status(201).json({ Message: "Success!", Body: `${newNote}` });
    } else {
        res.status(400).json({ Message: "Please enter both a title for your note and text." });
    }
});

//delete note
app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;

    console.log(`${req.method} request received to delete noteID: ${req.params.id}.`);

    readFromFile("./db/db.json")
        .then(notesContent => JSON.parse(notesContent))
        .then((parsedNotesContent) => {
            const updatedNoteList = parsedNotesContent.filter(note => note.id !== noteId);
            writeToFile("./db/db.json", updatedNoteList)
            return res.json(`Removed Note ID ${noteId}`);
        })
})

//wildcard route to send users to the index.html page
app.get("*", (req, res) => {
    console.log(`${req.method} request received.`);
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//listening for any connections on the host and port
app.listen(PORT, () => {
    console.log(`Houston, we're live! Listening on ${PORT}`)
});