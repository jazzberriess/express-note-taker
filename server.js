const express = require("express");
const fs = require("fs");
const path = require("path");
const notesDb = require("./db/db")
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
    // for (let i = 0; i < notesDb.length; i++) {
    //     console.log(notesDb[i].id);
    // }

    res.json(notesDb);

});

// app.get("/api/notes/:id", (req, res) => {
//     const getId = req.params.id
//     const notesData = notesDb;
//     console.log(notesData);

//     if (getId) {
//         for (let i = 0; i < notesData.length; i++) {
//             if (getId.includes(notesData[i].id)) {
//                 res.json(notesData);
//             } else {
//                 console.log(getId);
//                 console.log(notesData[12].id);
//                 return res.json({ Message: `Unable to find note with an ID of ${req.params.id}` })
//             }
//         };
//     }
// });

// if (getId) {
//     notesData.forEach(id => {
//         if (getId === req.params.id) {
//             console.log(notesData.id + "line32");
//             res.json(notesData.id);
//         } else {
//             res.json({ Message: `Unable to find a note with ID: ${req.params}` });
//         }
//     });
// }

// });

// app.get("/api/notes/:id", (req, res) => {
//     console.log(`${req.method} request received to retrieve note.`)



//     const retrieveNote = JSON.parse(db).some(item => item.id === parseInt(req.params.id));
//     if (retrieveNote) {

//         res.json(db.filter(item => item.id === parseInt(req.params.id)));
//     } else {
//         res.json(({ Message: "No note here!" }));
//         console.log(retrieveNote);
//     }

// });

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
        };
        console.log(newNote);

        fs.readFile("./db/db.json", "utf-8", (err, noteContent) => {
            if (err) {
                console.error(err);
            } else {
                const notes = JSON.parse(noteContent);
                notes.push(newNote);
                console.log(noteContent);

                fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), (err) => {
                    err ? console.error(err) : console.log(`New note ${newNote.title} added!`)
                })
            }
        })
        console.log(newNote);
        const serverResponse = {
            status: "Success!",
            body: newNote,
        };

        console.log(serverResponse);
        res.status(200).json(serverResponse);

    } else {
        return res.json({ Message: "Please enter both a title for your note and text." });
    }
});

//delete note
app.delete("/api/notes/:id", (req, res) => {
    console.log(`${req.method} request received to delete notes.`);
    // const data = JSON.parse(notesDb);
    const noteId = req.params.id;

    console.log(noteId);

    fs.readFile("db/db.json", (err, notesContent) => {
        if (err) {
            console.error(err);
        } else {
            const noteList = JSON.parse(notesContent);
            const updatedNoteList = noteList.filter(note => note.id !== noteId);
            console.log(updatedNoteList);
            fs.writeFile("db/db.json", JSON.stringify(updatedNoteList, null, 4), (err) => {
                err ? console.error(err) : res.json(`Removed Note ID ${noteId}`);
            });

        }
    })
})

// console.log(notesDb);

//     fs.readFile("./db/db.json", "utf-8", (err, noteContent) => {
//         if (err) {
//             console.error(err);
//         } else {
//             let notes = JSON.parse(noteContent);
//             console.log(notes.id);

//         }
//             )
// }
//     })

//     for (let i = 0; i < notesDb.length; i++) {
//         console.log(notesDb[i].id)
//         const notes = JSON.parse(notesDb);

//         if (noteId === notesDb[i].id) {

//             const updatedNotes = notes.filter(note = notes.id !== noteId);

//             console.log(updatedNotes);

//             fs.writeFile("./db/db.json", JSON.stringify(updatedNotes, null, 4), (err) => {
//                 err ? console.error(err) : console.log(`Note ${updatedNotes.id} removed!`);

//                 res.json({ Message: `Note ${id} removed!` })
//             })
//         }
//     }
// });


// notesDb.splice(noteIndex);

//         console.log(noteIndex);

//         fs.writeFile("./db/db.json", JSON.stringify(notesDb, null, 4), (err) => {
//             err ? console.error(err) : console.log(`Note ${id} removed!`)
//             // })
//         })
//     }
//     else {
// res.send({ Message: "Oops! Unable to delete that ID!" })
//         console.log(id, "line 140")
//         console.log("Boo");
//     }
// }
// }

// notes.splice()

// data.forEach(note => {
//     if (note.id === req.params.id) {
//         res.json({ Message: `Note ${note.id} removed!` })


//         const noteId = notes.some(note => note.id === req.params.id);
//         note.splice(noteId);
//         console.log(noteContent);

//         fs.writeFile("./db/db.json", JSON.stringify(noteContent, null, 4), (err) => {
//             err ? console.error(err) : console.log(`Note ${noteId.title} removed!`)
//         })
//     }
// })
// })

// });

//wildcard route to send users to the index.html page
app.get("*", (req, res) => {
    console.log(`${req.method} request received.`);
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Houston, we're live! Listening on ${PORT}`)
});