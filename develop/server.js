const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json")
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

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

    const { title, text } = req.body;

    //if the post request contains title and text then create a new note
    if (title && text) {

        let newNote = {
            id: uuid.v4(),
            title: req.body.title,
            text: req.body.text
        }

        fs.readFile("./db/db.json", "utf-8", (err, noteContent) => {
            if (err) {
                console.error(err);
            } else {
                const notes = json.parse(noteContent);
                notes.push(newNote);
                console.log(noteContent);

                fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), (err) => {
                    err ? console.error(err) : console.log(`New note ${newNote.title} added!`)
                })
            }
        })
    }

});

app.get("*", (req, res) => {
    console.log(`${req.method} request received.`);
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Houston, we're live! Listening on ${PORT}`)
});