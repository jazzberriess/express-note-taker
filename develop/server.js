const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json")

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//return the notes.html file
app.get("/notes", (req, res) => {
    console.log(`${req.method} request received.`);
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//request notes data from the db.json file
app.get("/api/notes", (req, res) => {
    console.log(`${req.method} request received to retrieve notes.`)
    res.json(db);
});

//post request to save a new note to the request body and add to the db.json file
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note.`)

    let note;


});

app.listen(PORT, () => {
    console.log(`Houston, we're live! Listening on ${PORT}`)
});