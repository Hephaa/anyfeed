var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var db = require("./DBHandler");
var api = require("./routes/api");
var admin = require("./routes/admin");

var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

var port = process.env.PORT || 3000;

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret: 'anystringoftext',
saveUninitialized: true,
resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//for the admin panel
app.set('view engine', 'ejs');

//serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "js")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "jquery", "dist")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "vue", "dist")));
app.use('/js', express.static(path.join(__dirname, "node_modules", "popper.js", "dist")));
app.use('/css', express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "css")));

app.use("/api", api);
app.use("/admin", admin);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
})

app.listen(port, () => {
    console.log("listening on *:" + port);

    //create db connection
    db.connectToDB();
})