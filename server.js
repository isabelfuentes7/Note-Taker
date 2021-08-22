const express = require("express");
const fs = require("fs");
const notes = require("./db/db.json");
const path = require("path");
const uuid = require("uuid");
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");

const app = express();
var PORT = process.env.PORT || 3000;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Setting routes for APIs
//Saves notes and joins in db.json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
});
//Function that add new notes
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id =uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});
//Deleting the notes
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNotes = notes.filter((revNote) => revNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNotes));
    res.json(delNotes);
})
//HTML calls
//homepage
app.get("/", function (req, res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//Call for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
//Start
app.listen(PORT, function (){
    console.log(" App listening on PORT:" + PORT);
});