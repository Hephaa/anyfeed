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

var topicSchema = mongoose.Schema({
    Title: String,
    EntryAmount: Number
})

var Topic = mongoose.model("Topic", topicSchema);

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
    Topic: Topic,
    //Entry functions
    addEntryFunction: function(entry, callback){
        entry.save((err, entry) => {
            if(err){
                return callback(entry, err);
            }
            //check if it has a topic and add it to topic db
            if(entry.Topic != ""){
                //if it exists up the amount
                Topic.findOne({Title:entry.Topic}).exec((err,data) => {
                    if(data != null){
                        data.EntryAmount++;
                        data.save((err, topic) => {
                            return callback(entry);
                            
                        })
                    }
                    else{
                        var topic = new Topic({
                            Title: entry.Topic,
                            EntryAmount: 1
                        });
                        topic.save((err, topic) => {
                            return callback(entry);
                        })
                    }
                })
            }else{
                return callback(entry);
            }            
        });
    },
    getEntries: function(callback){
        Entry.find({}).sort({date: -1}).exec((err,data ) => {
            callback(data,err);
        });
    },
    getEntriesByTopic: function(topic, callback){
        Entry.find({Topic: topic}).sort({date: -1}).exec((err,data ) => {
            callback(data,err);
        });
    },
    getEntriesByQuery: function(query, callback){
        Entry.find({content: {$regex: query, $options: "i"}}).sort({date: -1}).exec((err, data) => {
            callback(data,err);
        });
    },
    //Topic functions
    addTopicFunction: function(topic, callback){
        entry.save((err, topic) => {
            return callback(entry,err);
        });
    },
    getTopics: function(amount,callback){
        Topic.find({}).sort({EntryAmount: -1}).limit(amount).exec((err, data) => {
            return callback(data, err);
        });
    }

}

module.exports = DBHandler;