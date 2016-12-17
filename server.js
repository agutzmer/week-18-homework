

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
var Promise = require("bluebird");

mongoose.Promise = Promise;


// Init Express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/week18day4mongoose");

var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// Get route
app.get("/", function(req, res) {
  res.send(index.html);
});

// Scrape route
app.get("/scrape", function(req, res) {

  console.log ("Got to scrape");
 
  request("http://www.nytimes.com/", function(error, response, html) {

     console.log ("\n\nBACK FROM REQUEST\n\n ", html);

    var $ = cheerio.load(html);

    // parse title tags out of nyt

    $("title:").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }

        else {
          console.log(doc);
        }
      });

    });
  });
  res.send("Scrape Complete");
});

// Articles route
app.get("/articles", function(req, res) {
  
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


app.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {

    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


// Article post
app.post("/articles/:id", function(req, res) {
 
  var newNote = new Note(req.body);

  newNote.save(function(error, doc) {

    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })

      .exec(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});


// Open port 3000
app.listen(3000, function() {
  console.log("Running on port 3000");
});
