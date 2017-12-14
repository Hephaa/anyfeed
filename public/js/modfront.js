$(document).ready(function(){

  $('body').on('click', 'button3',  function(){
      $(this).closest("li").fadeOut();
      var item=$(this).closest("li").find("p4").text();
      $.ajax({
        type: 'DELETE',
        url: '/admin/' + item,
        success: function(data){
          //do something with the data via front-end framework
  //$("#FeedEnter").load(location.href + " #FeedEnter>*", "");
        }
      });
  });

});

$(document).ready(function(){

  $('body').on('click', 'button3',  function(){
    $(this).closest("li").fadeOut();
      var item=$(this).closest("li").find("p4").text();
      $.ajax({
        type: 'DELETE',
        url: '/admin/modlist/' + item,
        success: function(data){
          //do something with the data via front-end framework
  //$("#FeedEnter").load(location.href + " #FeedEnter>*", "");
        }
      });
  });

});
