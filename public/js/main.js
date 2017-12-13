
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
                    else if(LeftFrame.topicList.length < 10){
                        LeftFrame.topicList.push({Title: self.inputTopic.trim(), EntryAmount: 1})
                    }
                    self.inputAlias = "";
                    self.inputText = "";
                    self.inputTopic = "";                    
                }
            })
        }
    }
})

//Left frame app
var LeftFrame = new Vue({
    el: '#left-frame',
    data:{
        topicList: []
    },
    mounted: function(){
        var self = this;
        var data = {amount:10}
        $.ajax({
            type:"GET",
            url:"/api/topic/list",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (list) => {
                self.topicList = JSON.parse(list);
            }
        })
    },
    methods: {
        openTopic: function(){
            console.log(topic + " open action")
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
            console.log(this.query);
            //get the data
        }
    }
})