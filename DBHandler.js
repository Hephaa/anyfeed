var mongoose = require("mongoose");

//variables
var mongoDB = 'mongodb://localhost/anyfeed';
var db = null;


//db schemas
var entrySchema = mongoose.Schema({
    sender: String,
    content: String,
    date: {type: Date, default: Date.now},
    Tags: [{title: String}],
    Topic: String,
    AnswerTo: String,
    AnswerAmount: Number,
    PositiveVote: Number,
    NegativeVote: Number
});

var Entry = mongoose.model("Entry", entrySchema);

//Functionality
var DBHandler = {
    //variables
    db: db,
    //base functions
    connectToDB: function(){
        mongoose.connect(mongoDB, {
            useMongoClient: true
        });
        db = mongoose.connection;

        //db listener
        db.on('error', () =>{
            console.error.bind(console, "MongoDB connection error");
        });
        db.once('open', () => {console.log("Connected to MongoDB")});
    },
    //expand models
    Entry: Entry,
    //Entry functions
    addEntryFunction: function(entry, callback){
        entry.save((err, entry) => {
            if(err) return callback(entry, err);
            callback(entry);
        });
    },
    getEntries: function(callback){
        Entry.find({}).sort({date: -1}).exec((err,data ) => {
            if(err) callback(data,err);
            callback(data);
        })
    }
}

module.exports = DBHandler;