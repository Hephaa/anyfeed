var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var db = require("./DBHandler");
var api = require("./routes/api")

var port = process.env.PORT || 3000;


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "js")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "jquery", "dist")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "vue", "dist")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "popper.js", "dist")));
app.use('/css', express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "css")));

app.use("/api", api);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
})

app.listen(port, () => {
    console.log("listening on *:" + port);

    //create db connection
    db.connectToDB();
})