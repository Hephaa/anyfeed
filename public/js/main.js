
//Main frame app
var MainFrame = new Vue({
    el: '#main-frame',
    data: {
        inputAlias: "",
        inputText: "",
        inputTopic: "",
        entryList: [],
        loading: true
    },
    mounted: function () {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/api/entry/list',
            success: (data) => {
                self.loading = false;
                self.entryList = JSON.parse(data);                
            }
        });
    },
    methods: {
        sendEntry: function(){
            var self = this;            
            if(this.inputText == ""){
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
                    if(topic.length != 0){
                        topic[0].EntryAmount++;
                    }
                    else if(LeftFrame.topicList.length < 10 && elf.inputTopic.trim() != ""){
                        LeftFrame.topicList.push({Title: self.inputTopic.trim(), EntryAmount: 1})
                    }
                    self.inputAlias = "";
                    self.inputText = "";
                    self.inputTopic = "";                    
                }
            })
        },
        loadMain: function(){
            var self = this;
            loading = true;
            $.ajax({
                type: "GET",
                url: '/api/entry/list',
                success: (data) => {
                    self.loading = false;
                    self.entryList = JSON.parse(data);                
                }
            });
        },
        openTopic: function(topic){
            LeftFrame.openTopic(topic);
        },
        queryEntry: function(){
            var data = {
                contentContain: LeftFrame.searchQuery,
                Topic: LeftFrame.selectedTopic
            }
            this.loading = true;
        },
        queryEntryNew: function(){            
            var data = {
                contentContain: LeftFrame.searchQuery,
                Topic: LeftFrame.selectedTopic,
                date: this.entryList[0].date
            }
        }
    }
})

//Left frame app
var LeftFrame = new Vue({
    el: '#left-frame',
    data:{
        topicList: [],
        selectedTopic: null,
        searchQuery: null
    },
    mounted: function(){
        var self = this;
        var data = {amount:10}
        $.ajax({
            type:"POST",
            url:"/api/topic/list",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (list) => {
                self.topicList = JSON.parse(list);
            }
        })
    },
    methods: {
        openTopic: function(topic){
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
        },
        closeTopic: function(){
            MainFrame.loadMain();
            this.selectedTopic = null;
            MainFrame.inputTopic = "";
        },
        clearSearch: function(){
            this.searchQuery = null;
            Search.query = "";
            MainFrame.loadMain();
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
        searchQuery: function() {
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
        }
    }
})