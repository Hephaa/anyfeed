
//Main frame app
var MainFrame = new Vue({
    el: '#main-frame',
    data: {
        inputAlias: "",
        inputText: "",
        entryList: [],
        loading: true
    },
    mounted: function () {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/api/getlist',
            success: (data) => {
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
                sender: self.inputAlias,
                content: self.inputText
            };
            $.ajax({
                type: "POST",
                url: '/api/addentry',                
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (entry) => {
                    self.entryList.unshift(JSON.parse(entry));
                    self.inputAlias = "";
                    self.inputText = "";
                }
            })
        }
    }
})

//Left frame app


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