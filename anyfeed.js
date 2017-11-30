var path = require("path");
var express = require("express");
var app = express();
var db = require("./DBHandler");

//serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "js")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "jquery", "dist")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "vue", "dist")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "popper.js", "dist")));
app.use('/css', express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "css")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
})

app.listen(3000, () => {
    console.log("listening on *:3000");

    //create db connection
    db.connectToDB();
})