//variables for required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
// const notesDb = require("./db/db")
const uuid = require("uuid");
const { readFromFile, writeToFile, readAndAppend } = require("./helpers/fsUtils");

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
    return;
});

//route handler to retrieve notes data from the db.json file
app.get("/api/notes", (req, res) => {
    console.log(`${req.method} request received to retrieve notes. Line 27`)
    readFromFile("./db/db.json")
        .then(notesContent => res.json(JSON.parse(notesContent)));
    // const notes = JSON.parse
    // return res.json(JSON.parse(notesDb))
    // fs.readFile("./db/db.json", (err, noteContent) => {
    //     err ? console.error(err) : res.json(JSON.parse(noteContent))
    //     return;
    // })
    // fs.readFile("./db/db.json", "utf-8", (err, noteContent) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         res.json(JSON.stringify(noteContent, null, 4))
    //     }
    // })
});

//route handler for the POST request to save a new note to the request body and add to the db.json file
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note.`)

    const { title, text } = req.body;

    //if the post request contains title and text then create a new note
    if (title && text) {

        let newNote = {
            id: uuid.v4(),
            title: req.body.title,
            text: req.body.text
        };
        readAndAppend(newNote, "./db/db.json");
        res.status(201).json({ Message: "Success!", Body: `${newNote}` });
    } else {
        res.status(400).json({ Message: "Please enter both a title for your note and text." });
    }

    //read the db.json file
    // fs.readFile("./db/db.json", "utf-8", (err, noteContent) => {
    //     if (err) {
    //         console.error(err);
    //     } else {

    //         //push newNote data
    //         const notes = JSON.parse(noteContent);
    //         notes.push(newNote);

    //         //write to the db.json file
    //         fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), (err) => {
    //             err ? console.error(err) : console.log(`New note ${newNote.title} added!`)
    //         })
    //     }
    // })

    //success response
    // const serverResponse = {
    //     status: "Success!",
    //     body: newNote,
    // };

    // console.log(serverResponse);
    //     return res.status(201).json({Message: "Success!", Body: `newNote`});

    // } else {
    //     return res.status(400).json({ Message: "Please enter both a title for your note and text." });
    // }
});

//delete note
app.delete("/api/notes/:id", (req, res) => {
    console.log(`${req.method} request received to delete notes.`);

    const noteId = req.params.id;

    //read the db.json file
    fs.readFile("db/db.json", (err, notesContent) => {
        if (err) {
            console.error(err);
        } else {
            const noteList = JSON.parse(notesContent);

            //filter out the noteId and create a new array of data with the noteId filtered out
            const updatedNoteList = noteList.filter(note => note.id !== noteId);
            // console.log(updatedNoteList);

            //write the updatedNoteList to the db.json file
            fs.writeFile("db/db.json", JSON.stringify(updatedNoteList, null, 4), (err) => {
                if (err) {
                    console.error(err)
                } else {
                    return res.json(`Removed Note ID ${noteId}`)
                }
            });
        }
    })
})

//wildcard route to send users to the index.html page
app.get("*", (req, res) => {
    console.log(`${req.method} request received.`);
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Houston, we're live! Listening on ${PORT}`)
});