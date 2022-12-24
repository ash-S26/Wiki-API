// This is a RESTful API
// It provides aricles , post aticles , delete and modify when requested particular endpoint
// API's are created to give in return some data when requested in form of JSON

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//////////////////////// Request for articles /////////////////////////////////////////

app.get("/articles", function (req,res) {
  Article.find({}, function (err, articleArray) {
    if(err){
      res.send(err);
    } else {
      res.send(articleArray);
    }
  });
});

app.post("/articles", function (req,res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function (err) {
    if(err){
      res.send(err);
    } else {
      res.send("Successfully saved article.")
    }
  });
});

app.delete("/articles", function (req,res) {
  Article.deleteMany({},function (err) {
    if(err){
      res.send(err);
    } else {
      res.send("Successfully deleted all articles");
    }
  });
});

//////////////////////// Request for specific articles /////////////////////////////////////////

app.route("/articles/:articleTitle")

  .get(function (req,res) {
    Article.findOne({title: req.params.articleTitle}, function (err, foundOne) {
      if(err){
        res.send("Error");
      } else {
        if(foundOne){
          res.send(foundOne);
        } else {
          res.send("No article found with this title.");
        }
      }
    });
  })

  .put(function (req,res) {
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function (err) {
        if(err){
          res.send(err);
        } else {
          res.send("Successfully updated article.")
        }
      });
  })

  .patch(function (req,res) {
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function (err) {
        if(err) {
          res.send(err);
        }
        else {
          res.send("Update Done.")
        }
      });
  })

  .delete(function (req,res) {
    Article.deleteOne(
      {title: req.params.articleTitle},
      function (err) {
      if(err){
        res.send(err);
      } else {
        res.send("Deleted article.")
      }
    });
  });


// Listner


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
// !
