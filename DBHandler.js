var mongoose = require("mongoose");
var bcrypt = require('bcrypt');

//variables
var mongoDB = 'mongodb://localhost/anyfeed';
var db = null;


//db schemas
var entrySchema = mongoose.Schema({
    sender: String,
    content: String,
    date: { type: Date, default: Date.now },
    Tags: [{ title: String }],
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

var userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
}

var User = mongoose.model("User", userSchema);

//Functionality
var DBHandler = {
    //variables
    db: db,
    //base functions
    connectToDB: function () {
        mongoose.connect(mongoDB, {
            useMongoClient: true
        });
        db = mongoose.connection;

        //db listener
        db.on('error', () => {
            console.error.bind(console, "MongoDB connection error");
        });
        db.once('open', () => { console.log("Connected to MongoDB") });
    },
    //expand models
    Entry: Entry,
    Topic: Topic,
    User: User,
    //Entry functions
    addEntryFunction: function (entry, callback) {
        entry.save((err, entry) => {
            if (err) {
                return callback(entry, err);
            }
            //check if it has a topic and add it to topic db
            if (entry.Topic != "" && entry.Topic != null) {
                //if it exists up the amount
                Topic.findOne({ Title: entry.Topic }).exec((err, data) => {
                    if (data != null) {
                        data.EntryAmount++;
                        data.save((err, topic) => {
                            return callback(entry);

                        })
                    }
                    else {
                        var topic = new Topic({
                            Title: entry.Topic,
                            EntryAmount: 1
                        });
                        topic.save((err, topic) => {
                            return callback(entry);
                        })
                    }
                })
            } else {
                if (entry.AnswerTo) {
                    Entry.findById(entry.AnswerTo).exec((err, data) => {
                        if(data!= null){
                            data.AnswerAmount++;
                            data.save((err, e) => {
                                return callback(entry);
    
                            })
                        }
                        else{
                            return callback(entry);
                        }
                    })
                }
                else
                    return callback(entry);
            }
        });
    },
    getEntries: function (callback) {
        Entry.find({}).sort({ date: -1 }).exec((err, data) => {
            callback(data, err);
        });
    },
    getEntriesByTopic: function (topic, callback) {
        Entry.find({ Topic: topic }).sort({ date: -1 }).exec((err, data) => {
            callback(data, err);
        });
    },
    getEntriesByQuery: function (query, callback) {
        /*Entry.find({content: {$regex: query, $options: "i"}}).sort({date: -1}).exec((err, data) => {
            callback(data,err);
        });*/

        //create query method
        var queryMethod = {};
        if (query.Topic)
            queryMethod.Topic = query.Topic;
        if (query.Search)
            queryMethod.content = { $regex: query.Search, $options: "i" }
        if (query.AnswerTo){
            queryMethod.AnswerTo = query.AnswerTo
        }
        else{
            queryMethod.AnswerTo = null;
        }


        //create sort method
        var sortMethod = {};
        if (query.Sort == "date-desc") {
            sortMethod = { date: -1 };
        } else if (query.Sort == "date-asc") {
            sortMethod = { date: 1 };
        }

        //Query contains: Topic, search -- sort method
        Entry
            .find(queryMethod)
            .sort(sortMethod)
            .exec((err, data) => {
                callback(data, err);
            })
    },
    voteOnEntry: function (id, isNegative, callback) {
        Entry.findById(id).exec((err, entry) => {
            if (entry == null || err) {
                callback(err ? err : "cannot find");
                return;
            }
            if (isNegative)
                entry.NegativeVote++;
            else
                entry.PositiveVote++;
            entry.save((err, entry) => {
                return callback();

            })
        })
    },
    //Topic functions
    addTopicFunction: function (topic, callback) {
        entry.save((err, topic) => {
            return callback(entry, err);
        });
    },
    getTopics: function (amount, callback) {
        Topic.find({}).sort({ EntryAmount: -1 }).limit(amount).exec((err, data) => {
            return callback(data, err);
        });
    },


    //general functions
    clearDatabase: function (callback) {
        Entry.remove({}, () => {
            Topic.remove({}, callback);
        })
    }

}

module.exports = DBHandler;