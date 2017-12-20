
//Main frame app
var MainFrame = new Vue({
    el: '#main-frame',
    data: {
        inputAlias: "",
        inputText: "",
        inputTopic: "",
        entryList: [],
        entryQuery: {
            Topic: "",
            Search: "",
            Sort: ""
        },
        loading: true
    },
    mounted: function () {
        this.loadMain();
    },
    methods: {
        sendEntry: function () {
            var self = this;
            if (this.inputText == "") {
                //give error that it cannot be empty
                return;
            }
            var data = {
                sender: self.inputAlias.trim(),
                content: self.inputText.trim(),
                Topic: self.inputTopic.trim()
            };
            $.ajax({
                type: "POST",
                url: '/api/entry/add',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (entry) => {
                    self.entryList.unshift(JSON.parse(entry));
                    //eğer topic liste içinde varsa amountu arttır
                    var topic = LeftFrame.topicList.filter((obj) => {
                        return obj.Title == self.inputTopic.trim();
                    })
                    if (topic.length != 0) {
                        topic[0].EntryAmount++;
                    }
                    else if (LeftFrame.topicList.length < 10 && self.inputTopic.trim() != "") {
                        LeftFrame.topicList.push({ Title: self.inputTopic.trim(), EntryAmount: 1 })
                    }
                    self.inputAlias = "";
                    self.inputText = "";
                    self.inputTopic = "";
                }
            })
        },
        loadMain: function () {
            //Clear query
            this.entryQuery = {
                Topic: "",
                Search: "",
                Sort: ""
            }
            //call
            this.queryEntry();
            /*var self = this;
            loading = true;
            $.ajax({
                type: "GET",
                url: '/api/entry/list',
                success: (data) => {
                    self.loading = false;
                    self.entryList = JSON.parse(data);                
                }
            });*/
        },
        openTopic: function (topic) {
            LeftFrame.openTopic(topic);
        },
        queryEntry: function () {
            var self = this;
            self.loading = true;
            //set sorting method
            self.entryQuery.Sort = LeftFrame ? LeftFrame.sortingMethod : "date-desc";
            $.ajax({
                type: "POST",
                url: '/api/entry/query',
                contentType: 'application/json',
                data: JSON.stringify(self.entryQuery),
                success: ((data) => {
                    self.loading = false;
                    self.entryList = JSON.parse(data);
                })
            });
        },
        queryEntryNew: function () {
            var data = {
                contentContain: LeftFrame.searchQuery,
                Topic: LeftFrame.selectedTopic,
                date: this.entryList[0].date
            }
        },
        voteOnEntry: function (entry, isNegative) {
            var id = entry._id
            var data = {
                id: id,
                isNegative: isNegative
            }
            $.ajax({
                type: "POST",
                url: '/api/entry/vote',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (() => {
                    if (isNegative)
                        entry.NegativeVote++;
                    else
                        entry.PositiveVote++;                        
                })
            });
        },
        selectEntry: function(entry){
            RightFrame.setSelectedEntry(entry);
        }
    },
    filters: {
        formatDate: function(date){
            return moment(date).fromNow();
        }
    }
})

//Left frame app
var LeftFrame = new Vue({
    el: '#left-frame',
    data: {
        topicList: [],
        selectedTopic: null,
        searchQuery: null,
        sortingMethod: "date-desc"
    },
    mounted: function () {
        var self = this;
        var data = { amount: 10 }
        $.ajax({
            type: "POST",
            url: "/api/topic/list",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (list) => {
                self.topicList = JSON.parse(list);
            }
        })
    },
    methods: {
        openTopic: function (topic) {
            MainFrame.entryQuery.Topic = topic;
            MainFrame.entryQuery.Search = "";
            MainFrame.inputTopic = topic;
            Search.query = "";
            this.selectedTopic = topic;
            MainFrame.queryEntry();
            /*
            var self = this;
            var data = {
                topic: topic
            }
            MainFrame.loading = true;

            $.ajax({
                type: "POST",
                url:"/api/entry/bytopic",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (list) => {
                    MainFrame.entryList = JSON.parse(list);
                    MainFrame.inputTopic = topic;
                    MainFrame.loading = false;
                    self.selectedTopic = topic;
                    Search.query = "";
                    self.searchQuery = null;
                }
            });
            */
        },
        closeTopic: function () {
            MainFrame.entryQuery.Topic = "";
            this.selectedTopic = null;
            MainFrame.inputTopic = "";
            MainFrame.queryEntry();

        },
        clearSearch: function () {
            MainFrame.entryQuery.Search = "";
            this.searchQuery = null;
            Search.query = "";
            MainFrame.queryEntry();
        },
        changeSort: function () {
            MainFrame.queryEntry();
        }
    }
})

var RightFrame = new Vue({
    el: '#right-frame',
    data: {
        selectedEntry: null,
        loading: false,
        answerEntryList: [],
        isActive: false,
        answerAlias: "",
        answerContent: ""
    },
    methods: {
        setActive: function(b){
            this.isActive = b;
        },
        setSelectedEntry: function(entry){
            this.setActive(true);
            this.loading = true;
            this.selectedEntry = entry;

            var data = {
                AnswerTo: entry._id,
                sortingMethod: "date-desc"
            }
            var self = this;
            $.ajax({
                type: "POST",
                url: "/api/entry/query",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (list) => {
                    self.loading=false;
                    self.answerEntryList = JSON.parse(list);                    
                }
            })
        },
        answer: function(entry){
            var self = this;
            var data = {
                sender: self.answerAlias.trim(),
                content: self.answerContent.trim(),
                AnswerTo: self.selectedEntry._id
            }

            $.ajax({
                type: "POST",
                url: '/api/entry/add',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (entry) => {
                    self.answerEntryList.unshift(JSON.parse(entry));
                    self.answerAlias = "";
                    self.answerContent = "";
                }
            })
        },
        voteOnEntry: function (entry, isNegative) {
            var id = entry._id
            var data = {
                id: id,
                isNegative: isNegative
            }
            $.ajax({
                type: "POST",
                url: '/api/entry/vote',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (() => {
                    if (isNegative)
                        entry.NegativeVote++;
                    else
                        entry.PositiveVote++;                        
                })
            });
        },
        selectEntry: function(entry){
            this.setSelectedEntry(entry);
        }
    },
    filters: {
        formatDate: function(date){
            return moment(date).fromNow();
        }
    }
});

var EntryOverlay = new Vue({
    el: '#over-panel',
    data: {
        selectedEntry: null,
        commetnEntries: [],
        loading: false
    },
    methods: {
        clearEntry: function(){
            this.selectedEntry = null;
        },
        dummy: function(){
            event.stopPropagation()
        }
    }
})

//Search app
var Search = new Vue({
    el: '#search',
    data: {
        query: ""
    },
    methods: {
        searchQuery: function () {
            LeftFrame.searchQuery = this.query;
            MainFrame.entryQuery.Search = this.query
            MainFrame.queryEntry();
            /*
            var self = this;
            if(this.query == "") return;
            var data = {
                query: this.query
            };
            MainFrame.loading = true;
            $.ajax({
                type: "POST",
                url:"/api/entry/query",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (list) => {
                    MainFrame.entryList = JSON.parse(list);
                    MainFrame.loading = false;
                    LeftFrame.selectedTopic = null;
                    LeftFrame.searchQuery = self.query;
                }
            });
            */
        }
    }
})