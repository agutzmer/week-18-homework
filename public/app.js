
$.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {

    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// p tag clicked
$(document).on("click", "p", function() {
 
  $("#notes").empty();

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .done(function(data) {
      console.log(data);
   
      $("#notes").append("<h2>" + data.title + "</h2>");   
      $("#notes").append("<input id='titleinput' name='title' >");   
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");   
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");   //ag

 
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// Save note
$(document).on("click", "#savenote", function() {
    console.log ("Got to save note");
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// Delete note
$(document).on("click", "#deletenote", function() {
  console.log ("Got to delete note");
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("").val(),
      body: $("").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });

});
